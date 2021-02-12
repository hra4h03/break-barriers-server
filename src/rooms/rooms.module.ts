import { MessagesModule } from './../messages/messages.module';
import { UsersModule } from './../users/users.module';
import { Room, RoomSchema } from './entities/room.entity';
import { forwardRef, Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { RoomsGateway } from './rooms.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    forwardRef(() => UsersModule),
    AuthModule,
    MessagesModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsGateway],
  exports: [RoomsService],
})
export class RoomsModule {}
