import { JwtPayload } from './../interfaces/payload.jwt';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import * as cookie from 'cookie';
import { verify } from 'jsonwebtoken';

@Injectable()
export class WsAuthGuard implements CanActivate {
  private static readonly logger = new Logger('WsAuthGuard');
  async canActivate(context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient();
    const { jwt_token } = cookie.parse(client.handshake.headers.cookie);
    if (!jwt_token) {
      WsAuthGuard.logger.warn('No JwtToken');
      return false;
    }

    try {
      const user = verify(jwt_token, process.env.JWT_SECRET) as JwtPayload;
      context.switchToWs().getData().user = user;
      WsAuthGuard.logger.debug(`Valid Handshake: ${user.username}`);
      return true;
    } catch (error) {
      WsAuthGuard.logger.warn('Invalid Handshake');
      return false;
    }
  }
}
