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
  Res,
  HttpStatus,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { User } from 'src/common/decorators/user.decorator';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  private readonly logger = new Logger('RoomController');
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create/')
  async create(@User('_id') id: string, @Body() createRoomDto: CreateRoomDto) {
    try {
      return await this.roomsService.create(createRoomDto, id);
    } catch (error) {
      this.logger.error(error.message);
      return error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/join/:id/')
  async joinToRoom(
    @Res() res: Response,
    @Param('id') id: string,
    @User('_id') userId: string
  ) {
    try {
      const info = await this.roomsService.requestJoinRoom({
        roomId: id,
        userId
      });
      return res.status(HttpStatus.OK).json({ info });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.roomsService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    try {
      return await this.roomsService.update(id, updateRoomDto);
    } catch (error) {
      this.logger.error(error.message);
      return error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
