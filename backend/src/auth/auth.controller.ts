import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
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

  @Post('reset-password')
  resetPassword(@Body() body: { email: string; newPassword: string; adminKey: string }) {
    if (body.adminKey !== 'goldadmin2024') throw new Error('Unauthorized');
    return this.authService.resetPassword(body.email, body.newPassword);
  }
}
