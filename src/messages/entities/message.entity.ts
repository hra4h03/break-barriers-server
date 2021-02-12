import { Room } from 'src/rooms/entities/room.entity';
import { User } from '../../users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type MessageDocument = Message & mongoose.Document;

@Schema()
export class Message {
  @Prop({ required: true })
  message: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  from: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Room.name,
  })
  roomId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass<MessageDocument>(
  Message,
);
