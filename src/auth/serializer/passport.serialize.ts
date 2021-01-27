import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';
import { UserDocument } from '../../users/entities/user.entity';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: UserDocument, done: CallableFunction) {
    console.log(user._id);
    done(null, user._id);
  }

  async deserializeUser(_id: string, done: CallableFunction) {
    return await this.usersService
      .findOne({ _id })
      .then((user) => done(null, user))
      .catch((error) => done(error));
  }
}
