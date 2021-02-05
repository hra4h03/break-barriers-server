import { User, UserDocument } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AcceptMemberToPrivateRoomDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, required: true })
  roomId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => User)
  @ApiProperty({ type: Array, required: true })
  whitelisted: UserDocument[];
}
