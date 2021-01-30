import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as cryptoRandomString from 'crypto-random-string';
import { Request, Response } from 'express';
import { TTL, STRING_LENGTH } from './../common/constants';
import { JwtPayload } from './interfaces/payload.jwt';
import { UserDocument } from './../users/entities/user.entity';
import { UpdateUserWithEmail } from '../users/dto/update-with-email.dto';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ username });

    if (user && (await compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: UserDocument) {
    const payload: JwtPayload = {
      username: user.username,
      _id: user._id,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async sendRecoverPasswordEmail({ email }: UpdateUserWithEmail, req: Request) {
    try {
      const user = await this.usersService.findOne({
        email,
      });
      if (!user) return false;

      const bytes = cryptoRandomString({
        length: STRING_LENGTH,
        type: 'url-safe',
      });

      const hostname = `${req.protocol}://${req.headers.host}`;
      const url = `${hostname}/auth/recover-password/${user.id}/${bytes}/`;

      const ttl = TTL.FIFTEEN;
      await this.cacheManager.set(user.id, bytes, { ttl });

      return await this.mailService.sendRecoverPasswordEmail({
        email,
        username: user.username,
        url,
        ttl: new Date(ttl).getMinutes(),
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async compareRecoveryAddress({ bytes, id }: { id: string; bytes: string }) {
    return bytes === (await this.cacheManager.get<string>(id));
  }

  logout(res: Response) {
    res.clearCookie('jwt_token');
  }
}
