import { Message, MessageDocument } from './entities/message.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageSchema: Model<MessageDocument>,
  ) {}

  async getMessageChunk({
    roomId,
    chunkSize = 10,
    page = 1,
  }: {
    roomId: string;
    chunkSize?: number;
    page?: number;
  }) {
    return this.messageSchema
      .find({ roomId })
      .limit(chunkSize)
      .skip(chunkSize * page);
  }
}
