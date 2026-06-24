import { Controller, Get, Post, Patch, Body, Param, UseGuards, Query } from '@nestjs/common';
import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('trades')
@UseGuards(JwtAuthGuard)
export class TradesController {
  constructor(private tradesService: TradesService) {}

  @Post('simulate')
  simulate(@CurrentUser() user: { sub: string }, @Body() dto: CreateTradeDto) {
    return this.tradesService.simulate(user.sub, dto);
  }

  @Post('open')
  openTrade(@CurrentUser() user: { sub: string }, @Body() dto: CreateTradeDto) {
    return this.tradesService.openTrade(user.sub, dto);
  }

  @Patch(':id/close')
  closeTrade(
    @CurrentUser() user: { sub: string },
    @Param('id') id: string,
    @Query('exitPrice') exitPrice?: string,
  ) {
    return this.tradesService.closeTrade(user.sub, id, exitPrice ? +exitPrice : undefined);
  }

  @Get()
  getHistory(@CurrentUser() user: { sub: string }) {
    return this.tradesService.getHistory(user.sub);
  }

  @Get('open')
  getOpenTrades(@CurrentUser() user: { sub: string }) {
    return this.tradesService.getOpenTrades(user.sub);
  }
}
