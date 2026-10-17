import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AcademyService } from './academy.service';
import { SaveProgressDto } from './academy.dto';

@Controller('academy')
@UseGuards(JwtAuthGuard)
export class AcademyController {
  constructor(private academy: AcademyService) {}

  @Get('progress')
  getProgress(@CurrentUser() user: { sub: string }) {
    return this.academy.getProgress(user.sub);
  }

  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @Post('progress')
  saveProgress(@CurrentUser() user: { sub: string }, @Body() dto: SaveProgressDto) {
    return this.academy.saveProgress(user.sub, dto);
  }
}
