import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
