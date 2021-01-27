import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserWithEmail {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
