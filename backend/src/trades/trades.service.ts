import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountService } from '../account/account.service';
import { SimulatorService } from './simulator.service';
import { PricesService } from '../prices/prices.service';
import { CreateTradeDto } from './dto/create-trade.dto';

const LOT_SIZE_XAU = 100;

@Injectable()
export class TradesService {
  constructor(
    private prisma:     PrismaService,
    private account:    AccountService,
    private simulator:  SimulatorService,
    private prices:     PricesService,
  ) {}

  private async enforceFreeTierLimit(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { paidAt: true, subscriptionStatus: true, referralBonus: true },
    });
    const isPro = user?.subscriptionStatus === 'ACTIVE' || !!user?.paidAt;
    if (isPro) return;
    const count = await this.prisma.trade.count({ where: { userId } });
    const limit = 20 + (user?.referralBonus ?? 0);
    if (count >= limit) {
      throw new ForbiddenException('FREE_LIMIT_REACHED');
    }
  }

  async simulate(userId: string, dto: CreateTradeDto) {
    await this.enforceFreeTierLimit(userId);
    const acct = await this.prisma.simAccount.findUnique({ where: { userId } });
    if (!acct) throw new NotFoundException('Account not found');
    if (!dto.sl || !dto.tp) throw new BadRequestException('SL y TP son obligatorios para simular');
    this.validateSlTp(dto.type, dto.entryPrice, dto.sl, dto.tp);

    const result = this.simulator.simulate({
      type: dto.type, lot: dto.lot,
      entryPrice: dto.entryPrice,
      sl: dto.sl, tp: dto.tp,
      accountBalance: acct.currentBalance,
    });

    const trade = await this.prisma.trade.create({
      data: {
        userId, type: dto.type, lot: dto.lot,
        entryPrice: dto.entryPrice,
        exitPrice: result.exitPrice,
        sl: dto.sl, tp: dto.tp,
        resultUsd: result.resultUsd,
        resultPct: result.resultPct,
        rrRatio:   result.rrRatio,
        riskPct:   result.riskPct,
        status: 'SIMULATED',
        notes: dto.notes,
        exitAt: new Date(),
      },
    });

    await this.account.applyTradeResult(userId, result.resultUsd);

    return { trade, simulation: result };
  }

  private validateSlTp(type: 'BUY' | 'SELL', entry: number, sl: number, tp: number) {
    if (type === 'BUY') {
      if (sl >= entry)
        throw new BadRequestException(`SL (${sl}) debe estar por debajo del precio de entrada (${entry}) en operaciones BUY`);
      if (tp <= entry)
        throw new BadRequestException(`TP (${tp}) debe estar por encima del precio de entrada (${entry}) en operaciones BUY`);
    } else {
      if (sl <= entry)
        throw new BadRequestException(`SL (${sl}) debe estar por encima del precio de entrada (${entry}) en operaciones SELL`);
      if (tp >= entry)
        throw new BadRequestException(`TP (${tp}) debe estar por debajo del precio de entrada (${entry}) en operaciones SELL`);
    }
    const slDist = Math.abs(entry - sl);
    const tpDist = Math.abs(tp - entry);
    if (slDist < 0.10)
      throw new BadRequestException('SL demasiado cerca del precio de entrada (mínimo 10 pips / $0.10)');
    if (tpDist < 0.10)
      throw new BadRequestException('TP demasiado cerca del precio de entrada (mínimo 10 pips / $0.10)');
  }

  async openTrade(userId: string, dto: CreateTradeDto) {
    await this.enforceFreeTierLimit(userId);
    const acct = await this.prisma.simAccount.findUnique({ where: { userId } });
    if (!acct) throw new NotFoundException('Account not found');

    const entry   = dto.entryPrice || this.prices.getCurrentPrice();
    if (dto.sl && dto.tp) this.validateSlTp(dto.type, entry, dto.sl, dto.tp);
    const slDist  = dto.sl ? Math.abs(entry - dto.sl) : 0;
    const tpDist  = dto.tp ? Math.abs(dto.tp - entry) : 0;
    const riskUsd = slDist * dto.lot * LOT_SIZE_XAU;
    const riskPct = acct.currentBalance > 0 ? +(riskUsd / acct.currentBalance * 100).toFixed(2) : 0;
    const rrRatio = slDist > 0 ? +(tpDist / slDist).toFixed(2) : 0;

    return this.prisma.trade.create({
      data: {
        userId, type: dto.type, lot: dto.lot,
        entryPrice: entry,
        sl: dto.sl, tp: dto.tp,
        riskPct, rrRatio,
        status: 'OPEN',
        notes: dto.notes,
      },
    });
  }

  async closeTrade(userId: string, tradeId: string, exitPrice?: number) {
    const trade = await this.prisma.trade.findFirst({
      where: { id: tradeId, userId, status: 'OPEN' },
    });
    if (!trade) throw new NotFoundException('Open trade not found');

    const acct = await this.prisma.simAccount.findUnique({ where: { userId } });
    if (!acct) throw new NotFoundException('Account not found');

    const currentPrice = this.prices.getCurrentPrice();
    // Reject exit prices that deviate more than 5% from current market price
    if (exitPrice !== undefined) {
      const deviation = Math.abs(exitPrice - currentPrice) / currentPrice;
      if (deviation > 0.05) {
        throw new BadRequestException(
          `Exit price ${exitPrice} deviates more than 5% from current price ${currentPrice.toFixed(2)}`,
        );
      }
    }
    const price    = exitPrice ?? currentPrice;
    const diff     = trade.type === 'BUY' ? price - trade.entryPrice : trade.entryPrice - price;
    const resultUsd = +(diff * trade.lot * LOT_SIZE_XAU).toFixed(2);
    const resultPct = +(resultUsd / acct.currentBalance * 100).toFixed(2);

    const closed = await this.prisma.trade.update({
      where: { id: tradeId },
      data: { exitPrice: price, resultUsd, resultPct, status: 'CLOSED', exitAt: new Date() },
    });

    await this.account.applyTradeResult(userId, resultUsd);
    return closed;
  }

  async getHistory(userId: string) {
    return this.prisma.trade.findMany({
      where: { userId },
      orderBy: { entryAt: 'desc' },
      take: 200,
    });
  }

  async getOpenTrades(userId: string) {
    return this.prisma.trade.findMany({
      where: { userId, status: 'OPEN' },
      orderBy: { entryAt: 'desc' },
    });
  }
}
