import { JwtPayload } from './../interfaces/payload.jwt';
import { WsAuthGuard } from './ws.guard';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class WsRolesGuard implements CanActivate {
  static logger = new Logger('WsRolesGuard');
  constructor(private reflector: Reflector, private wsAuthGuard: WsAuthGuard) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const can = await this.wsAuthGuard.canActivate(context);
    if (!can) return false;
    if (!roles) return true;
    const { user }: { user: JwtPayload } = context.switchToWs().getData();

    WsRolesGuard.logger.debug(`WsRoles { [ ${roles.join(', ')} ] }`);
    WsRolesGuard.logger.debug(`User WsRole { ${user.role} }`);

    if (!roles.includes(user.role)) throw new ForbiddenException();
    return true;
  }
}
