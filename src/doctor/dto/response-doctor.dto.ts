import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ResponseSpecializationDto } from 'src/specialization/dto/response-specialization.dto';

export class ResponseDoctorDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code_doctor: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ResponseSpecializationDto)
  specialization: ResponseSpecializationDto;

  @IsNotEmpty()
  @IsInt()
  status: number;

  @IsNotEmpty()
  @IsString()
  ext_img_id: string;

  @IsNotEmpty()
  @IsString()
  img_profile: string;
}