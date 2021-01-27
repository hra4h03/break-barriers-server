import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  static logger = new Logger('JwtGuard');
  canActivate(context: ExecutionContext) {
    const can = super.canActivate(context);
    return can;
  }

  handleRequest(err, user) {
    if (!user || err) {
      JwtAuthGuard.logger.warn('Unauthorized Exception');
      throw new UnauthorizedException();
    }
    return user;
  }
}
