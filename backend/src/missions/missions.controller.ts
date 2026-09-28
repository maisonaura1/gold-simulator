import { Controller, Get, Post, UseGuards, Headers, UnauthorizedException } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('missions')
export class MissionsController {
  constructor(private missionsService: MissionsService) {}

  // Admin-only: overwrites mission definitions
  @Post('seed')
  seed(@Headers('x-admin-key') adminKey?: string) {
    const key = process.env.ADMIN_RESET_KEY;
    if (!key || adminKey !== key) throw new UnauthorizedException();
    return this.missionsService.seedMissions();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getMissions(@CurrentUser() user: { sub: string }) {
    return this.missionsService.getUserMissions(user.sub);
  }

  @Post('evaluate')
  @UseGuards(JwtAuthGuard)
  evaluate(@CurrentUser() user: { sub: string }) {
    return this.missionsService.evaluateMissions(user.sub);
  }
}
