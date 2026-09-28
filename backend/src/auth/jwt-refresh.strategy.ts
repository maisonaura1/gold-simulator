import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Validates refresh tokens (signed with JWT_REFRESH_SECRET). Access tokens are
// signed with a different secret, so they cannot be used to mint new tokens.
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    return { sub: payload.sub, email: payload.email };
  }
}
