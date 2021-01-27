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

  @Get('/')
  @Render('pages/index')
  rootPage(@Req() req: Request) {
    return {
      user: req.user,
    };
  }

  @Get('/login/')
  @Render('pages/login')
  loginPage() {
    return;
  }

  @Get('/signin/')
  @Render('pages/signin')
  signInPage(@Session() session: Record<any, string>) {
    return {
      error: session?.error,
    };
  }

  @UseGuards(JwtAuthGuard)
  @UseFilters(UnauthorizeExceptionFilter)
  @Get('/profile/')
  @Render('pages/profile')
  async profile(@Req() req) {
    const userById = await this.usersService
      .findById(req.user._id)
      .populate('rooms');
    const { password: _, ...user } = userById.toObject();
    return { user };
  }
}
