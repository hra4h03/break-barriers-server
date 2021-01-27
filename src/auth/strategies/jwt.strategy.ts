import { JwtPayload } from './../interfaces/payload.jwt';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  static cookieExtractor(req: Request) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['jwt_token'];
    }
    return token;
  }
  constructor() {
    super({
      jwtFromRequest: JwtStrategy.cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return { _id: payload._id, username: payload.username, role: payload.role };
  }
}
