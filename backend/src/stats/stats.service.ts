import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const trades = await this.prisma.trade.findMany({
      where: { userId, status: { in: ['CLOSED', 'SIMULATED'] } },
      orderBy: { entryAt: 'asc' },
    });

    if (trades.length === 0) {
      return this.emptyStats();
    }

    const closed = trades.filter((t) => t.resultUsd !== null);
    const wins = closed.filter((t) => (t.resultUsd ?? 0) > 0);
    const losses = closed.filter((t) => (t.resultUsd ?? 0) <= 0);

    const winRate = closed.length > 0 ? (wins.length / closed.length) * 100 : 0;
    const totalPnl = closed.reduce((sum, t) => sum + (t.resultUsd ?? 0), 0);
    const avgPnl = closed.length > 0 ? totalPnl / closed.length : 0;
    const avgRisk = closed.reduce((sum, t) => sum + (t.riskPct ?? 0), 0) / (closed.length || 1);
    const avgRR = closed.reduce((sum, t) => sum + (t.rrRatio ?? 0), 0) / (closed.length || 1);

    const { winStreak, lossStreak } = this.calculateStreaks(closed);

    const behaviours = this.detectBehaviours({ winRate, avgRisk, avgRR, trades: closed });

    // Weekly PnL for chart
    const weeklyPnl = this.buildWeeklyPnl(closed);

    // Save snapshot
    await this.prisma.statsSnapshot.create({
      data: {
        userId,
        winRate,
        avgRisk,
        avgRR,
        winStreak,
        lossStreak,
        totalTrades: closed.length,
        totalPnl,
        avgPnlPerTrade: avgPnl,
      },
    });

    return {
      winRate: +winRate.toFixed(1),
      totalPnl: +totalPnl.toFixed(2),
      avgPnl: +avgPnl.toFixed(2),
      avgRisk: +avgRisk.toFixed(2),
      avgRR: +avgRR.toFixed(2),
      winStreak,
      lossStreak,
      totalTrades: closed.length,
      wins: wins.length,
      losses: losses.length,
      behaviours,
      weeklyPnl,
    };
  }

  private calculateStreaks(trades: { resultUsd: number | null }[]) {
    let winStreak = 0;
    let lossStreak = 0;
    let currentWin = 0;
    let currentLoss = 0;

    for (const t of trades) {
      if ((t.resultUsd ?? 0) > 0) {
        currentWin++;
        currentLoss = 0;
        winStreak = Math.max(winStreak, currentWin);
      } else {
        currentLoss++;
        currentWin = 0;
        lossStreak = Math.max(lossStreak, currentLoss);
      }
    }

    return { winStreak, lossStreak };
  }

  private detectBehaviours(data: {
    winRate: number;
    avgRisk: number;
    avgRR: number;
    trades: { resultUsd: number | null }[];
  }): string[] {
    const findings: string[] = [];

    if (data.avgRisk > 3) {
      findings.push('⚠️ Sobreexposición: tu riesgo promedio supera el 3%. Reduce el tamaño de lote.');
    }
    if (data.avgRR < 1.5) {
      findings.push('⚠️ Relación R/R baja: estás arriesgando más de lo que ganas. Busca setups con R/R ≥ 2.');
    }
    if (data.winRate < 40 && data.trades.length > 10) {
      findings.push('📊 Winrate bajo del 40%. Revisa tus criterios de entrada.');
    }
    if (data.winRate > 60 && data.avgRR < 1) {
      findings.push('🎲 Winrate alto pero R/R pobre — podrías estar cerrando profits demasiado pronto.');
    }
    if (findings.length === 0) {
      findings.push('✅ Tu estadística se ve saludable. Mantén la disciplina.');
    }

    return findings;
  }

  private buildWeeklyPnl(trades: { resultUsd: number | null; entryAt: Date }[]) {
    const map: Record<string, number> = {};

    for (const t of trades) {
      const week = this.getWeekKey(t.entryAt);
      map[week] = (map[week] ?? 0) + (t.resultUsd ?? 0);
    }

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([week, pnl]) => ({ week, pnl: +pnl.toFixed(2) }));
  }

  private getWeekKey(date: Date): string {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d.toISOString().slice(0, 10);
  }

  private emptyStats() {
    return {
      winRate: 0, totalPnl: 0, avgPnl: 0, avgRisk: 0, avgRR: 0,
      winStreak: 0, lossStreak: 0, totalTrades: 0, wins: 0, losses: 0,
      behaviours: ['Aún no tienes operaciones. ¡Empieza a simular!'],
      weeklyPnl: [],
    };
  }
}
