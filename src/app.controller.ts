import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
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
