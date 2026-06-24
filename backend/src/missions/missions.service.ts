import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MissionsService {
  constructor(private prisma: PrismaService) {}

  async getUserMissions(userId: string) {
    return this.prisma.userMission.findMany({
      where: { userId },
      include: { mission: true },
      orderBy: { assignedAt: 'desc' },
    });
  }

  async evaluateMissions(userId: string) {
    const userMissions = await this.prisma.userMission.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { mission: true },
    });

    const trades = await this.prisma.trade.findMany({
      where: { userId, status: { in: ['CLOSED', 'SIMULATED'] } },
    });

    const updates: Promise<unknown>[] = [];

    for (const um of userMissions) {
      const progress = this.calcProgress(um.mission.type, trades);

      if (progress >= um.targetProgress) {
        updates.push(
          this.prisma.userMission.update({
            where: { id: um.id },
            data: { status: 'COMPLETED', currentProgress: progress, completedAt: new Date() },
          }),
        );
        // Grant XP
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

    return this.getUserMissions(userId);
  }

  private calcProgress(type: string, trades: { riskPct: number | null; rrRatio: number | null; resultUsd: number | null }[]): number {
    const closed = trades.filter((t) => t.resultUsd !== null);

    switch (type) {
      case 'TRADES_COUNT':
        return closed.length;

      case 'RISK_MAX_PCT': {
        // Progress = how many trades had risk ≤ 2%
        const compliant = closed.filter((t) => (t.riskPct ?? 99) <= 2).length;
        return compliant;
      }

      case 'MIN_RR_RATIO': {
        const compliant = closed.filter((t) => (t.rrRatio ?? 0) >= 2).length;
        return compliant;
      }

      case 'WIN_STREAK': {
        let streak = 0;
        let max = 0;
        for (const t of closed) {
          if ((t.resultUsd ?? 0) > 0) {
            streak++;
            max = Math.max(max, streak);
          } else {
            streak = 0;
          }
        }
        return max;
      }

      case 'MAX_DAILY_LOSS_PCT':
        return 1; // simplified — requires day-grouping logic

      default:
        return 0;
    }
  }
}
