import { IsNotEmpty, IsString } from 'class-validator';

export class RequestLoginDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
