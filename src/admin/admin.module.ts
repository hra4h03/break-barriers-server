import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { AdminModule as AdminBroModule } from '@admin-bro/nestjs';
import { Model } from 'mongoose';
import { compare } from 'bcrypt';

import { UsersService } from '../users/users.service';
import { User, UserDocument } from '../users/entities/user.entity';
import { RoomDocument } from '../rooms/entities/room.entity';
import { Room } from '../rooms/entities/room.entity';
import { UsersModule } from '../users/users.module';
import { MongooseSchemasModule } from '../mongoose-schema/mongoose-schema.module';
import { Role } from '../auth/roles/roles.enum';
import { AdminModuleOptions } from '@admin-bro/nestjs/types/interfaces/admin-module-options.interface';

@Module({
  imports: [
    AdminBroModule.createAdminAsync({
      imports: [MongooseSchemasModule, UsersModule, ConfigModule],
      inject: [
        getModelToken(Room.name),
        getModelToken(User.name),
        UsersService,
        ConfigService,
      ],
      useFactory: (
        roomModel: Model<RoomDocument>,
        userModel: Model<UserDocument>,
        userService: UsersService,
        configService: ConfigService,
      ): Promise<AdminModuleOptions> | AdminModuleOptions => ({
        adminBroOptions: {
          rootPath: '/admin',
          resources: [{ resource: roomModel }, { resource: userModel }],
        },
        auth: {
          async authenticate(email: string, password: string): Promise<any> {
            const user = await userService.findOne(
              { email },
              { getters: false },
            );
            if (!user) return false;
            const match = await compare(password, user.password);
            if (!match) return false;
            return user.role === Role.ADMIN;
          },
          cookieName: 'admin',
          cookiePassword: configService.get<string>('COOKIE_SECRET'),
        },
        sessionOptions: {
          secret: configService.get<string>('SESSION_SECRET'),
          resave: false,
          saveUninitialized: false,
        },
      }),
    }),
  ],
})
export class AdminPanelModule {}
