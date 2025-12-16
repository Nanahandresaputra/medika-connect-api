import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum user_role {
  customer = 'customer',
  admin = 'admin',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: any;

  @IsOptional()
  @IsEnum(user_role)
  role: user_role;

  @IsOptional()
  @IsNumber()
  status: number;
}
