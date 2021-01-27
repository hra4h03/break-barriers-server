import { User } from './user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema()
export class UserActivation {
  @Prop({ required: true, unique: true })
  activationHash: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: string;
}

export const UserActivationSchema = SchemaFactory.createForClass(
  UserActivation,
);
