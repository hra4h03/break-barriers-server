import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketsGateway } from './sockets.gateway';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { MongooseSchemasModule } from './mongoose-schema/mongoose-schema.module';
import { AuthModule } from './auth/auth.module';
import { AdminPanelModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }),
    CacheModule.register(),
    AdminPanelModule,
    RoomsModule,
    UsersModule,
    MongooseSchemasModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketsGateway],
})
export class AppModule {}
