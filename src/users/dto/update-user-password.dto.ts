import { MinLength, IsNotEmpty } from 'class-validator';

export class UpdateUserPasswordDto {
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
