import {
  Controller, Post, Get, Body, UseGuards, Req, Res, Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
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
    const tokens = await this.authService.findOrCreateGoogleUser(req.user);
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3001';
    // Pass tokens to frontend via query params (short-lived, stored immediately)
    res.redirect(
      `${frontendUrl}/auth/google/success?` +
      `accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`,
    );
  }

  // ── Password recovery ─────────────────────────────────────────────────────

  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password-token')
  resetPasswordByToken(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPasswordByToken(body.token, body.newPassword);
  }

  // ── Admin reset (kept for backwards compat) ───────────────────────────────

  @Post('reset-password')
  resetPassword(@Body() body: { email: string; newPassword: string; adminKey: string }) {
    const key = process.env.ADMIN_RESET_KEY;
    if (!key || body.adminKey !== key) throw new Error('Unauthorized');
    return this.authService.resetPassword(body.email, body.newPassword);
  }
}
