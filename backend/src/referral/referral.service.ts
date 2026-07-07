import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReferralService {
  constructor(private prisma: PrismaService) {}

  async getMyReferral(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true, referralBonus: true },
    });

    const referredCount = await this.prisma.user.count({
      where: { referredBy: user?.referralCode },
    });

    return {
      code:          user?.referralCode ?? '',
      bonus:         user?.referralBonus ?? 0,
      referredCount,
    };
  }
}
