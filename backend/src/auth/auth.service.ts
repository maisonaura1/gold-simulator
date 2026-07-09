import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailsService } from '../emails/emails.service';

const REFERRAL_BONUS = 5;

function genReferralCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private emails: EmailsService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Generate a unique 6-char referral code
    let referralCode = genReferralCode();
    while (await this.prisma.user.findUnique({ where: { referralCode } })) {
      referralCode = genReferralCode();
    }

    // Validate incoming referral code
    let referrer: { id: string } | null = null;
    if (dto.referralCode) {
      referrer = await this.prisma.user.findUnique({
        where: { referralCode: dto.referralCode.toUpperCase() },
        select: { id: true },
      });
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
        referralCode,
        referredBy: referrer ? dto.referralCode!.toUpperCase() : null,
        account: {
          create: {
            initialBalance: 10000,
            currentBalance: 10000,
            equity: 10000,
          },
        },
      },
    });

    // Credit bonus simulations to referrer
    if (referrer) {
      await this.prisma.user.update({
        where: { id: referrer.id },
        data: { referralBonus: { increment: REFERRAL_BONUS } },
      });
    }

    // Assign default missions to new user
    const missions = await this.prisma.mission.findMany();
    await this.prisma.userMission.createMany({
      data: missions.map((m) => ({
        userId: user.id,
        missionId: m.id,
        targetProgress: m.targetValue,
      })),
    });

    const tokens = this.buildTokens(user.id, user.email);
    // Fire-and-forget welcome email
    this.emails.sendWelcome(user.email).catch(() => null);
    return tokens;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.buildTokens(user.id, user.email);
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('User not found');
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { email }, data: { passwordHash } });
    return { message: 'Password updated' };
  }

  async refreshTokens(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return this.buildTokens(user.id, user.email);
  }

  private buildTokens(userId: string, email: string) {
    const jwtSecret     = process.env.JWT_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!jwtSecret || !refreshSecret) {
      throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables');
    }
    const payload = { sub: userId, email };
    const accessToken  = this.jwt.sign(payload, { secret: jwtSecret,     expiresIn: '15m' });
    const refreshToken = this.jwt.sign(payload, { secret: refreshSecret, expiresIn: '7d'  });
    return { accessToken, refreshToken };
  }
}
