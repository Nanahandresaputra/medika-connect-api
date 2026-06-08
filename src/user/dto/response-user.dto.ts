import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { roleUser } from 'src/common-dto/web-filter.dto';
import { WebResponseDto } from 'src/common-dto/web-response.dto';

class ResultUserDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(roleUser)
  role: roleUser;

  @IsNotEmpty()
  @IsInt()
  status: number;
}

export class ResponseUserDto extends PartialType(WebResponseDto) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResultUserDto)
  data: ResultUserDto[];
}
