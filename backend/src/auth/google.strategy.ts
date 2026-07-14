import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private static readonly log = new Logger('GoogleStrategy');

  constructor() {
    const clientID     = process.env.GOOGLE_CLIENT_ID     ?? 'PLACEHOLDER_ID';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? 'PLACEHOLDER_SECRET';

    if (clientID === 'PLACEHOLDER_ID') {
      GoogleStrategy.log.warn('GOOGLE_CLIENT_ID not set — Google OAuth disabled');
    }

    super({
      clientID,
      clientSecret,
      callbackURL: process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:3001/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id, displayName, emails, photos } = profile;
    done(null, {
      googleId: id,
      email:    emails?.[0]?.value ?? '',
      name:     displayName ?? '',
      avatar:   photos?.[0]?.value ?? null,
    });
  }
}
