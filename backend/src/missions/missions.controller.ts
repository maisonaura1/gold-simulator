import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('missions')
@UseGuards(JwtAuthGuard)
export class MissionsController {
  constructor(private missionsService: MissionsService) {}

  @Get()
  getMissions(@CurrentUser() user: { sub: string }) {
    return this.missionsService.getUserMissions(user.sub);
  }

  @Post('evaluate')
  evaluate(@CurrentUser() user: { sub: string }) {
    return this.missionsService.evaluateMissions(user.sub);
  }
}
