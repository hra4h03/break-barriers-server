import { MailModule } from './../mail/mail.module';
import { WsRolesGuard } from './guards/ws.roles.guard';
import { WsAuthGuard } from './guards/ws.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { LocalSerializer } from './serializer/passport.serialize';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from './../users/users.module';
import { Module, CacheModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    CacheModule.register(),
    MailModule,
    UsersModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('EXPIRES_IN') },
      }),
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    LocalSerializer,
    RolesGuard,
    WsAuthGuard,
    WsRolesGuard,
    JwtAuthGuard,
    LocalAuthGuard,
  ],
  exports: [
    AuthService,
    PassportModule,
    WsAuthGuard,
    WsRolesGuard,
    JwtAuthGuard,
    RolesGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
