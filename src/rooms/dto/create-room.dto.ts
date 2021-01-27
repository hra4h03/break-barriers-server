import { IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  logo: string;
}
