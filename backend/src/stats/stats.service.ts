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

    // Equity curve + max drawdown (start from 10000 default)
    const { equityCurve, maxDrawdown } = this.buildEquityCurve(closed);

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
      equityCurve,
      maxDrawdown: +maxDrawdown.toFixed(2),
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

  private buildEquityCurve(trades: { resultUsd: number | null; entryAt: Date }[]) {
    const INITIAL = 10000;
    let balance = INITIAL;
    let peak = INITIAL;
    let maxDrawdown = 0;

    const equityCurve: { date: string; balance: number }[] = [
      { date: new Date(trades[0]?.entryAt ?? new Date()).toISOString().slice(0, 10), balance: INITIAL },
    ];

    for (const t of trades) {
      balance += t.resultUsd ?? 0;
      if (balance > peak) peak = balance;
      const dd = peak > 0 ? ((peak - balance) / peak) * 100 : 0;
      if (dd > maxDrawdown) maxDrawdown = dd;
      equityCurve.push({
        date: new Date(t.entryAt).toISOString().slice(0, 10),
        balance: +balance.toFixed(2),
      });
    }

    return { equityCurve, maxDrawdown };
  }

  async getDailyStats(userId: string) {
    const trades = await this.prisma.trade.findMany({
      where: { userId, status: { in: ['CLOSED', 'SIMULATED'] } },
      orderBy: { entryAt: 'asc' },
      select: { resultUsd: true, entryAt: true, rrRatio: true },
    });

    const map: Record<string, { pnl: number; trades: number; wins: number }> = {};

    for (const t of trades) {
      const day = new Date(t.entryAt).toISOString().slice(0, 10);
      if (!map[day]) map[day] = { pnl: 0, trades: 0, wins: 0 };
      map[day].pnl    += t.resultUsd ?? 0;
      map[day].trades += 1;
      if ((t.resultUsd ?? 0) > 0) map[day].wins += 1;
    }

    // Build monthly totals
    const monthMap: Record<string, number> = {};
    for (const [day, d] of Object.entries(map)) {
      const month = day.slice(0, 7);
      monthMap[month] = (monthMap[month] ?? 0) + d.pnl;
    }

    const days = Object.entries(map).map(([date, d]) => ({
      date,
      pnl:      +d.pnl.toFixed(2),
      trades:   d.trades,
      winRate:  d.trades > 0 ? +((d.wins / d.trades) * 100).toFixed(1) : 0,
    }));

    const months = Object.entries(monthMap).map(([month, pnl]) => ({
      month, pnl: +pnl.toFixed(2),
    }));

    return { days, months };
  }

  async getCsvExport(userId: string): Promise<string> {
    const trades = await this.prisma.trade.findMany({
      where: { userId, status: { in: ['CLOSED', 'SIMULATED'] } },
      orderBy: { entryAt: 'asc' },
    });

    const rows = [
      ['Date', 'Type', 'Lot', 'Entry', 'Exit', 'SL', 'TP', 'R:R', 'Risk%', 'P/L USD', 'P/L%', 'Status'],
      ...trades.map((t) => [
        new Date(t.entryAt).toISOString().slice(0, 16).replace('T', ' '),
        t.type,
        t.lot,
        t.entryPrice.toFixed(2),
        t.exitPrice?.toFixed(2) ?? '',
        t.sl?.toFixed(2) ?? '',
        t.tp?.toFixed(2) ?? '',
        t.rrRatio?.toFixed(2) ?? '',
        t.riskPct?.toFixed(2) ?? '',
        t.resultUsd?.toFixed(2) ?? '',
        t.resultPct?.toFixed(2) ?? '',
        t.status,
      ]),
    ];

    return rows.map((r) => r.join(',')).join('\n');
  }

  async getPublicStats() {
    const [totalUsers, totalTrades] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.trade.count({ where: { status: { in: ['CLOSED', 'SIMULATED'] } } }),
    ]);
    return { totalUsers, totalTrades };
  }

  private emptyStats() {
    return {
      winRate: 0, totalPnl: 0, avgPnl: 0, avgRisk: 0, avgRR: 0,
      winStreak: 0, lossStreak: 0, totalTrades: 0, wins: 0, losses: 0,
      behaviours: ['Aún no tienes operaciones. ¡Empieza a simular!'],
      weeklyPnl: [], equityCurve: [], maxDrawdown: 0,
    };
  }
}
