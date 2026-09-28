import {
  Controller, Post, Get, Body, UseGuards, Req, Res, UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { timingSafeEqual } from 'crypto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AdminResetPasswordDto, ForgotPasswordDto, ResetPasswordTokenDto } from './dto/password-reset.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  refresh(@CurrentUser() user: { sub: string }) {
    return this.authService.refreshTokens(user.sub);
  }

  // ── Google OAuth ──────────────────────────────────────────────────────────

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Passport redirects to Google — no body needed
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3001';
    let tokens: { accessToken: string; refreshToken: string };
    try {
      tokens = await this.authService.findOrCreateGoogleUser(req.user);
    } catch {
      return res.redirect(`${frontendUrl}/auth/login?error=google`);
    }
    // Pass tokens to frontend via query params (short-lived, stored immediately)
    res.redirect(
      `${frontendUrl}/auth/google/success?` +
      `accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
    );
  }

  // ── Password recovery ─────────────────────────────────────────────────────

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('reset-password-token')
  resetPasswordByToken(@Body() body: ResetPasswordTokenDto) {
    return this.authService.resetPasswordByToken(body.token, body.newPassword);
  }

  // ── Admin reset (kept for backwards compat) ───────────────────────────────

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('reset-password')
  resetPassword(@Body() body: AdminResetPasswordDto) {
    const key = process.env.ADMIN_RESET_KEY;
    if (!key || !safeEqual(body.adminKey, key)) throw new UnauthorizedException();
    return this.authService.resetPassword(body.email, body.newPassword);
  }
}
