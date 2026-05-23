import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, StrategyOptions } from 'passport-jwt';
import { UserRole } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(require('passport-jwt').Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-change-this-in-prod',
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, userId: payload.sub, email: payload.email, role: payload.role };
  }
}
