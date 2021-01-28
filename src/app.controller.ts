import { JwtAuthGuard } from './auth/guards/jwt.guard';
import {
  Controller,
  Get,
  Req,
  Render,
  UseGuards,
  UseFilters,
  Session,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { UnauthorizeExceptionFilter } from './exeption-filters/unauthorize-exeption.filter';
import { UsersService } from './users/users.service';
import { RoomsService } from './rooms/rooms.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
    private readonly roomsService: RoomsService,
  ) {}
}
