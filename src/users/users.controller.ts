import { JwtPayload } from './../auth/interfaces/payload.jwt';
import { JwtAuthGuard } from './../auth/guards/jwt.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Logger,
  UseGuards,
  Req,
  BadGatewayException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AcceptMemberToPrivateRoomDto } from './dto/accept-member-private-room.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger('UsersController');
  constructor(private readonly usersService: UsersService) {}

  @Post('/create/')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.create(createUserDto);
      return newUser;
    } catch (error) {
      this.logger.error(error.message);
      return error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add-whitelisted-members')
  async acceptMemberToPrivateRoom(
    @Req() req: Request,
    @Body() body: AcceptMemberToPrivateRoomDto,
  ) {
    try {
      const user = req.user as JwtPayload;
      const res = await this.usersService.acceptMemberToPrivateRoom({
        userId: user._id,
        whitelisted: body.whitelisted,
        roomId: body.roomId,
      });
      return res;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  @Get('/me/')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.usersService.findById(user._id);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
