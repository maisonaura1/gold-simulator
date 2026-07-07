import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ReferralService } from './referral.service';

@Controller('referral')
export class ReferralController {
  constructor(private referral: ReferralService) {}

  @Get('my-code')
  @UseGuards(JwtAuthGuard)
  getMyCode(@Request() req: { user: { sub: string } }) {
    return this.referral.getMyReferral(req.user.sub);
  }
}
