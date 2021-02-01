import { UserDocument } from 'src/users/entities/user.entity';
import { RoomDocument } from './../entities/room.entity';
import { IsNotEmpty } from 'class-validator';

export class AddMemberDto {
  @IsNotEmpty()
  room: RoomDocument;

  @IsNotEmpty()
  user: UserDocument;
}

export class AddMemberByIdDto {
  @IsNotEmpty()
  roomId: string;

  @IsNotEmpty()
  userId: string;
}
