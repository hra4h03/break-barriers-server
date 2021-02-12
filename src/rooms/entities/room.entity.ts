import { User } from './../../users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type RoomDocument = Room & mongoose.Document;

@Schema()
export class Room {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  roomAdmin: string;

  @Prop({ default: '' })
  logo: string;

  @Prop({ default: false, type: Boolean })
  private: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  members: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  waitlist: User[];
}

export const RoomSchema = SchemaFactory.createForClass<RoomDocument>(Room);
