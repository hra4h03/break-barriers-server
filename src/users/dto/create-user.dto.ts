import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  username: string;

  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    minimum: 6,
  })
  password: string;
}
