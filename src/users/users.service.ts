import { RoomsService } from './../rooms/rooms.service';
import { RoomDocument } from './../rooms/entities/room.entity';
import { MailService } from 'src/mail/mail.service';
import { UserDocument, User } from './entities/user.entity';
import {
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userSchema: Model<UserDocument>,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => RoomsService))
    private readonly roomsService: RoomsService,
  ) {}
  async isExist(query = {}) {
    return !!(await this.userSchema.findOne(query));
  }

  async create(createUserDto: CreateUserDto, validEmailAndUsername = false) {
    if (!validEmailAndUsername) {
      const existUsername = await this.isExist({
        username: createUserDto.username,
      });
      if (existUsername)
        throw new NotAcceptableException('Username is already taken');

      const existEmail = await this.isExist({
        email: createUserDto.email,
      });
      if (existEmail)
        throw new NotAcceptableException('Email is already taken');
    }
    const hashedPassword = await hash(
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
    return this.userSchema.find({});
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

  async notifyAdmin({
    adminId,
    room,
  }: {
    adminId: string;
    room: RoomDocument;
  }) {
    const admin = await this.userSchema.findById(adminId);
    try {
      return await this.mailService.sendNotifyAdminMail({
        room,
        email: admin.email,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async acceptMemberToPrivateRoom({
    roomId,
    userId,
    whitelisted,
  }: {
    roomId: string;
    userId: string;
    whitelisted: UserDocument[];
  }) {
    try {
      const room = await this.roomsService.findById(roomId);

      if (room.roomAdmin.toString() !== userId)
        throw new UnauthorizedException(
          'You do not have premissions in this room',
        );
      return await this.roomsService.whitelistMembers({ roomId, whitelisted });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
