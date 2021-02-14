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
  BadGatewayException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AcceptMemberToPrivateRoomDto } from './dto/accept-member-private-room.dto';
import { User } from 'src/common/decorators/user.decorator';

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
    @Body() body: AcceptMemberToPrivateRoomDto,
    @User('_id') id: string,
  ) {
    try {
      const res = await this.usersService.acceptMemberToPrivateRoom({
        userId: id,
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
  getMe(@User('_id') id: string) {
    return this.usersService.findById(id);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.removePasswordField(
      await this.usersService.findOne(id),
    );
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
