import { Message, MessageSchema } from './../messages/entities/message.entity';
import { User, UserSchema } from './../users/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Room, RoomSchema } from 'src/rooms/entities/room.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class MongooseSchemasModule {}
