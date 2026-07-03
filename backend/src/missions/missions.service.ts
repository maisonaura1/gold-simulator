import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type ClosedTrade = {
  riskPct: number | null;
  rrRatio: number | null;
  resultUsd: number | null;
  entryAt: Date;
  exitAt: Date | null;
};

@Injectable()
export class MissionsService {
  constructor(private prisma: PrismaService) {}

  async getUserMissions(userId: string) {
    return this.prisma.userMission.findMany({
      where: { userId },
      include: { mission: true },
      orderBy: [{ status: 'asc' }, { assignedAt: 'desc' }],
    });
  }

  async evaluateMissions(userId: string) {
    await this.ensureMissionsAssigned(userId);

    const userMissions = await this.prisma.userMission.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { mission: true },
    });

    const trades = await this.prisma.trade.findMany({
      where: { userId, status: { in: ['CLOSED', 'SIMULATED'] } },
      orderBy: { entryAt: 'asc' },
    });

    const updates: Promise<unknown>[] = [];

    for (const um of userMissions) {
      const { progress } = this.calcProgress(um.mission.type, um.mission.isDaily, trades);
      const target = um.targetProgress;

      if (progress >= target) {
        updates.push(
          this.prisma.userMission.update({
            where: { id: um.id },
            data: { status: 'COMPLETED', currentProgress: progress, completedAt: new Date() },
          }),
        );
        updates.push(
          this.prisma.simAccount.update({
            where: { userId },
            data: { xp: { increment: um.mission.xpReward } },
          }),
        );
      } else {
        updates.push(
          this.prisma.userMission.update({
            where: { id: um.id },
            data: { currentProgress: progress },
          }),
        );
      }
    }

    await Promise.all(updates);
    await this.updateLevel(userId);
    return this.getUserMissions(userId);
  }

  private async ensureMissionsAssigned(userId: string) {
    const allMissions = await this.prisma.mission.findMany();
    const existing = await this.prisma.userMission.findMany({ where: { userId }, select: { missionId: true } });
    const existingIds = new Set(existing.map((e) => e.missionId));
    const toCreate = allMissions.filter((m) => !existingIds.has(m.id));
    if (toCreate.length > 0) {
      await this.prisma.userMission.createMany({
        data: toCreate.map((m) => ({ userId, missionId: m.id, targetProgress: m.targetValue })),
        skipDuplicates: true,
      });
    }
  }

  private async updateLevel(userId: string) {
    const account = await this.prisma.simAccount.findUnique({ where: { userId } });
    if (!account) return;
    let level = 1;
    if (account.xp >= 1500) level = 3;
    else if (account.xp >= 500) level = 2;
    if (account.level !== level) {
      await this.prisma.simAccount.update({ where: { userId }, data: { level } });
    }
  }

  private calcProgress(type: string, isDaily: boolean, trades: ClosedTrade[]): { progress: number } {
    const relevant = isDaily
      ? trades.filter((t) => {
          const d = new Date(t.entryAt);
          const now = new Date();
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
        })
      : trades;

    const closed = relevant.filter((t) => t.resultUsd !== null);

    switch (type) {
      case 'TRADES_COUNT':
        return { progress: closed.length };

      case 'RISK_MAX_PCT': {
        const compliant = closed.filter((t) => (t.riskPct ?? 99) <= 2).length;
        return { progress: compliant };
      }

      case 'MIN_RR_RATIO': {
        const compliant = closed.filter((t) => (t.rrRatio ?? 0) >= 2).length;
        return { progress: compliant };
      }

      case 'WIN_STREAK': {
        let streak = 0, max = 0;
        for (const t of closed) {
          if ((t.resultUsd ?? 0) > 0) { streak++; max = Math.max(max, streak); }
          else streak = 0;
        }
        return { progress: max };
      }

      case 'NO_REVENGE_TRADE': {
        let revengeCount = 0;
        for (let i = 1; i < closed.length; i++) {
          const prev = closed[i - 1];
          const curr = closed[i];
          if ((prev.resultUsd ?? 0) < 0 && (curr.resultUsd ?? 0) < 0) {
            const gap = new Date(curr.entryAt).getTime() - new Date(prev.exitAt ?? prev.entryAt).getTime();
            if (gap < 5 * 60 * 1000) revengeCount++;
          }
        }
        return { progress: revengeCount === 0 ? closed.length : 0 };
      }

      case 'MAX_DAILY_LOSS_PCT': {
        const byDay = new Map<string, number>();
        for (const t of closed) {
          const day = new Date(t.entryAt).toDateString();
          byDay.set(day, (byDay.get(day) ?? 0) + (t.resultUsd ?? 0));
        }
        const goodDays = [...byDay.values()].filter((pnl) => pnl >= -500).length;
        return { progress: goodDays };
      }

      default:
        return { progress: 0 };
    }
  }

  async seedMissions() {
    const missions = [
      { name: '🟡 Primera Operación',     description: 'Abre y cierra tu primer trade en el simulador.',                                        type: 'TRADES_COUNT' as const, targetValue: 1,   xpReward: 50,  isDaily: false },
      { name: '🟡 SL Siempre',            description: 'Completa 5 operaciones con riesgo ≤ 2%. Nunca operes sin Stop Loss.',                   type: 'RISK_MAX_PCT' as const, targetValue: 5,   xpReward: 100, isDaily: false },
      { name: '🟡 Ratio R:R 1:2',         description: 'Completa 3 operaciones con R:R ≥ 2:1. La matemática a tu favor.',                       type: 'MIN_RR_RATIO' as const, targetValue: 3,   xpReward: 100, isDaily: false },
      { name: '🟡 10 Trades Completados', description: 'Cierra 10 operaciones en total.',                                                        type: 'TRADES_COUNT' as const, targetValue: 10,  xpReward: 150, isDaily: false },
      { name: '🟡 Primera Racha',         description: 'Consigue 2 operaciones ganadoras consecutivas.',                                         type: 'WIN_STREAK'   as const, targetValue: 2,   xpReward: 150, isDaily: false },
      { name: '🔵 Disciplina de Riesgo',  description: 'Realiza 15 operaciones con riesgo ≤ 2%. La disciplina es el borde competitivo.',         type: 'RISK_MAX_PCT' as const, targetValue: 15,  xpReward: 200, isDaily: false },
      { name: '🔵 Maestro del R:R',       description: 'Completa 8 operaciones con R:R ≥ 2:1.',                                                  type: 'MIN_RR_RATIO' as const, targetValue: 8,   xpReward: 200, isDaily: false },
      { name: '🔵 Racha Dorada',          description: 'Logra 3 operaciones ganadoras consecutivas.',                                            type: 'WIN_STREAK'   as const, targetValue: 3,   xpReward: 250, isDaily: false },
      { name: '🔵 Veterano',              description: 'Cierra 30 operaciones en total.',                                                         type: 'TRADES_COUNT' as const, targetValue: 30,  xpReward: 250, isDaily: false },
      { name: '🔵 Control Total',         description: 'Realiza 25 operaciones con riesgo ≤ 2%. Esto separa a los traders rentables.',           type: 'RISK_MAX_PCT' as const, targetValue: 25,  xpReward: 300, isDaily: false },
      { name: '🔴 El Profesional',        description: 'Cierra 60 operaciones en total.',                                                         type: 'TRADES_COUNT' as const, targetValue: 60,  xpReward: 400, isDaily: false },
      { name: '🔴 Listo para Fondeo',     description: 'Completa 15 operaciones con R:R ≥ 2:1.',                                                 type: 'MIN_RR_RATIO' as const, targetValue: 15,  xpReward: 400, isDaily: false },
      { name: '🔴 Racha Legendaria',      description: 'Consigue 5 operaciones ganadoras consecutivas.',                                         type: 'WIN_STREAK'   as const, targetValue: 5,   xpReward: 500, isDaily: false },
      { name: '🔴 Centurión del Oro',     description: 'Cierra 100 operaciones. Bienvenido al 1% de traders que realmente practican.',           type: 'TRADES_COUNT' as const, targetValue: 100, xpReward: 750, isDaily: false },
      { name: '📅 Sesión Disciplinada',   description: 'Hoy: 2 operaciones con riesgo ≤ 2%. Un día a la vez.',                                   type: 'RISK_MAX_PCT' as const, targetValue: 2,   xpReward: 30,  isDaily: true  },
      { name: '📅 R:R del Día',           description: 'Hoy: 1 operación con R:R ≥ 2:1. Calidad sobre cantidad.',                                type: 'MIN_RR_RATIO' as const, targetValue: 1,   xpReward: 25,  isDaily: true  },
    ];

    for (const m of missions) {
      await this.prisma.mission.upsert({
        where: { name: m.name },
        update: { description: m.description, xpReward: m.xpReward, targetValue: m.targetValue },
        create: m,
      });
    }
    return { seeded: missions.length };
  }
}
