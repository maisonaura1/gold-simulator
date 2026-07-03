import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('missions')
export class MissionsController {
  constructor(private missionsService: MissionsService) {}

  @Post('seed')
  seed() {
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
