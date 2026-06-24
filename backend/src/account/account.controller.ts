import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get()
  getAccount(@CurrentUser() user: { sub: string }) {
    return this.accountService.getAccount(user.sub);
  }

  @Post('reset')
  resetAccount(@CurrentUser() user: { sub: string }) {
    return this.accountService.resetAccount(user.sub);
  }
}
