import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('public')
  getPublicStats() {
    return this.statsService.getPublicStats();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getStats(@CurrentUser() user: { sub: string }) {
    return this.statsService.getStats(user.sub);
  }

  @Get('streak')
  @UseGuards(JwtAuthGuard)
  getStreak(@CurrentUser() user: { sub: string }) {
    return this.statsService.getStreak(user.sub);
  }

  @Get('daily')
  @UseGuards(JwtAuthGuard)
  getDailyStats(@CurrentUser() user: { sub: string }) {
    return this.statsService.getDailyStats(user.sub);
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard)
  async exportCsv(
    @CurrentUser() user: { sub: string },
    @Res() res: Response,
  ) {
    const csv = await this.statsService.getCsvExport(user.sub);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="goldtrader-journal.csv"');
    res.send(csv);
  }
}
