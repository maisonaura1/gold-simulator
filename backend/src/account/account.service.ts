import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, SimAccount } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async getAccount(userId: string) {
    const account = await this.prisma.simAccount.findUnique({
      where: { userId },
    });
    if (!account) throw new NotFoundException('Account not found');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayTrades = await this.prisma.trade.findMany({
      where: { userId, entryAt: { gte: todayStart }, status: 'CLOSED' },
      select: { resultUsd: true },
    });

    const dailyPnl = todayTrades.reduce((sum, t) => sum + (t.resultUsd ?? 0), 0);
    const pnlPct = ((account.currentBalance - account.initialBalance) / account.initialBalance) * 100;

    return {
      ...account,
      user,
      dailyPnl,
      totalPnlPct: pnlPct,
    };
  }

  async resetAccount(userId: string) {
    await this.prisma.trade.updateMany({
      where: { userId },
      data: { status: 'CLOSED' },
    });

    return this.prisma.simAccount.update({
      where: { userId },
      data: {
        currentBalance: 10000,
        equity: 10000,
        level: 1,
        xp: 0,
      },
    });
  }

  async updateEquity(userId: string, openTradesPnl: number) {
    const account = await this.prisma.simAccount.findUnique({ where: { userId } });
    if (!account) return;

    return this.prisma.simAccount.update({
      where: { userId },
      data: { equity: account.currentBalance + openTradesPnl },
    });
  }

  async applyTradeResult(userId: string, resultUsd: number, tx?: Prisma.TransactionClient): Promise<SimAccount> {
    if (!tx) return this.prisma.$transaction((t) => this.applyTradeResult(userId, resultUsd, t));

    const xpGain = resultUsd > 0 ? 10 : 2;
    // Atomic increment: the row stays locked until the transaction commits, so
    // concurrent trades can't overwrite each other's balance update
    const acct = await tx.simAccount.update({
      where: { userId },
      data: { currentBalance: { increment: resultUsd }, xp: { increment: xpGain } },
    });

    // Never allow balance to go below 0 (no margin debt in a simulator)
    const newBalance = Math.max(0, acct.currentBalance);
    return tx.simAccount.update({
      where: { userId },
      data: {
        currentBalance: newBalance,
        equity: newBalance,
        level: Math.floor(acct.xp / 100) + 1,
      },
    });
  }
}
