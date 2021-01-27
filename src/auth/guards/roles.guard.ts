import { JwtAuthGuard } from './jwt.guard';
import { UserDocument } from 'src/users/entities/user.entity';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  static logger = new Logger('RolesGuard');
  constructor(
    private reflector: Reflector,
    private jwtAuthGuard: JwtAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const can = await this.jwtAuthGuard.canActivate(context);
    if (!can) return false;
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const user: UserDocument = request.user;

    RolesGuard.logger.debug(`Roles { [ ${roles.join(', ')} ] }`);
    RolesGuard.logger.debug(`User Role { ${user.role} }`);

    if (!roles.includes(user.role)) throw new ForbiddenException();
    return true;
  }
}
