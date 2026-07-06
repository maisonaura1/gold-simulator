import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TradeDeskService } from './trade-desk.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ReviewOrderDto } from './dto/review-order.dto';

@UseGuards(JwtAuthGuard)
@Controller('trade-desk')
export class TradeDeskController {
  constructor(private readonly svc: TradeDeskService) {}

  @Get('overview')
  overview(@CurrentUser() user: { email: string }) {
    return this.svc.getAuditOverview(user.email);
  }

  @Get('orders')
  listOrders(
    @CurrentUser() user: { email: string },
    @Query('bookId') bookId?: string,
  ) {
    return this.svc.listOrders(user.email, bookId);
  }

  @Post('orders')
  createOrder(
    @CurrentUser() user: { email: string },
    @Body() dto: CreateOrderDto,
  ) {
    return this.svc.createOrder(user.email, dto);
  }

  @Patch('orders/:id/submit')
  submitOrder(
    @CurrentUser() user: { email: string },
    @Param('id') id: string,
  ) {
    return this.svc.submitOrder(user.email, id);
  }

  @Patch('orders/:id/review')
  reviewOrder(
    @CurrentUser() user: { email: string },
    @Param('id') id: string,
    @Body() dto: ReviewOrderDto,
  ) {
    return this.svc.reviewOrder(user.email, id, dto);
  }
}
