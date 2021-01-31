import { RoomsService } from './../rooms/rooms.service';
import { MailService } from 'src/mail/mail.service';
import { UserDocument, User } from './entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userSchema: Model<UserDocument>,
    private readonly mailService: MailService,
    private readonly roomService: RoomsService,
  ) {}
  async isExist(query = {}) {
    return !!(await this.userSchema.findOne(query));
  }

  async create(createUserDto: CreateUserDto, validEmailAndUsername = false) {
    if (!validEmailAndUsername) {
      const existUsername = await this.isExist({
        username: createUserDto.username,
      });
      if (existUsername) throw new NotAcceptableException();

      const existEmail = await this.isExist({
        email: createUserDto.email,
      });
      if (existEmail) throw new NotAcceptableException();
    }
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      +process.env.SALT_RANGE,
    );
    const newUser = new this.userSchema({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
    });
    return await newUser.save();
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(query: any, options?: any) {
    return this.userSchema.findOne(query, options);
  }

  findById(id: string) {
    return this.userSchema.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userSchema.findByIdAndUpdate(id, updateUserDto, {
        new: true,
      });
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async joinRoom(userId: string, roomId: string) {
    const room = await this.roomService.findById(roomId);
    if (!room) throw new BadRequestException();
    const user = await this.userSchema.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          rooms: room,
        },
      },
      { new: true },
    );
    return { rooms: user.rooms };
  }
}
