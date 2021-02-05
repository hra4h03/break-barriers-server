import { IsNotEmpty, IsUrl, IsString, IsBoolean } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsUrl()
  logo: string;

  @IsBoolean()
  private: boolean;
}
