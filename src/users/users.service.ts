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
import { Document } from 'mongoose';
import * as randomColor from 'randomcolor';
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

  private generateUserAvatar({name, id}: {name: string, id: string}) {
    const color = randomColor({ hue: "blue", luminosity: "dark", seed: id }).slice(1)
    return `https://ui-avatars.com/api/?name=${name}&background=${color}&color=fff&bold=true&uppercase=true`
  }

  removePasswordField(doc: Document) {
    return doc.toObject({ transform(doc, ret) { delete ret.password; return ret; } });
  }

  async isExist(query = {}) {
    return !!(await this.userSchema.findOne(query));
  }

  private async checkUserInfo(
    user: UpdateUserDto | CreateUserDto,
  ): Promise<UpdateUserDto | CreateUserDto> {
    if (user.username) {
      const existUsername = await this.isExist({
        username: user.username,
      });
      if (existUsername)
        throw new NotAcceptableException('Username is already taken');
    }

    if (user.email) {
      const existEmail = await this.isExist({
        email: user.email,
      });
      if (existEmail)
        throw new NotAcceptableException('Email is already taken');
    }

    const hashedPassword =
      user.password && (await hash(user.password, +process.env.SALT_RANGE));

    return {
      ...user,
      password: hashedPassword,
    };
  }

  async create(createUserDto: CreateUserDto) {
    let user: CreateUserDto;
    try {
      user = (await this.checkUserInfo(createUserDto)) as CreateUserDto;
    } catch (error) {
      throw error;
    }


    const newUser = new this.userSchema({
      username: user.username,
      email: user.email,
      password: user.password,
    });
    newUser.avatar = this.generateUserAvatar({ name: user.username, id: newUser._id.toString() })
    return this.removePasswordField(await newUser.save())
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
    let user: UpdateUserDto;
    try {
      user = (await this.checkUserInfo(updateUserDto)) as UpdateUserDto;
    } catch (error) {
      throw error;
    }

    try {
      const updatingUser = {
        ...user,
        updatedAt: new Date(),
      }
      const updatedUser = await this.userSchema.findByIdAndUpdate(id, updatingUser, {
        new: true,
      });
      return this.removePasswordField(updatedUser);
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
