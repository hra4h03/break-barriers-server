import { IsNotEmpty } from 'class-validator';

export class AddMemberDto {
  @IsNotEmpty()
  roomId: string;

  @IsNotEmpty()
  userId: string;
}
