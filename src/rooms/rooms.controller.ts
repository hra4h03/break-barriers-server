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
  Res,
  HttpStatus,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  private readonly logger = new Logger('RoomController');
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create/')
  async create(@Body() createRoomDto: CreateRoomDto, @Req() req: Request) {
    try {
      const user = req.user as JwtPayload;
      return await this.roomsService.create(createRoomDto, user._id);
    } catch (error) {
      this.logger.error(error.message);
      return error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/join/:id/')
  async joinToRoom(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      const user = req.user as JwtPayload;
      const info = await this.roomsService.requestJoinRoom({
        roomId: id,
        userId: user._id,
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
