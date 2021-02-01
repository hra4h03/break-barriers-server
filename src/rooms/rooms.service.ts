import { UsersService } from 'src/users/users.service';
import { Room, RoomDocument } from './entities/room.entity';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Model } from 'mongoose';
import { AddMemberByIdDto, AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomSchema: Model<RoomDocument>,
    private readonly usersService: UsersService,
  ) {}

  async isExist(name: string) {
    return !!(await this.roomSchema.findOne({ name }));
  }

  async create(createRoomDto: CreateRoomDto) {
    const exist = await this.isExist(createRoomDto.title);
    if (exist) throw new NotAcceptableException();

    const newRoom = new this.roomSchema({
      name: createRoomDto.title,
      logo: createRoomDto.logo,
    });
    return await newRoom.save();
  }

  findAll() {
    return this.roomSchema.find().limit(6);
  }

  findById(id: string) {
    return this.roomSchema.findById(id);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const exist = await this.isExist(updateRoomDto.title);
    if (exist) throw new NotAcceptableException();

    const updatedRoom = await this.roomSchema.findByIdAndUpdate(
      id,
      {
        name: updateRoomDto.title,
        logo: updateRoomDto.logo,
        updatedAt: Date.now,
      },
      { new: true },
    );
    return updatedRoom;
  }

  private async addMember({ room, user }: AddMemberDto) {
    room.update(
      {
        $addToSet: {
          members: user,
        },
      },
      { new: true },
    );
    await room.save();
    return { members: room.members.length };
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }

  async requestJoinRoom({ roomId, userId }: AddMemberByIdDto) {
    const room = await this.findById(roomId);
    const user = await this.usersService.findById(userId);
    if (!user || !room) throw new BadRequestException();
    if (!room.private || room.whitelisted.includes(user)) {
      return await this.addMember({ room, user });
    }

    room.update({
      $addToSet: {
        whitelisted: user,
      },
    });
    await room.save();
    return { whitelisted: room.whitelisted.length };
  }
}
