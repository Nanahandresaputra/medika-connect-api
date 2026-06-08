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
import { WebResponseDto } from 'src/common-dto/web-response.dto';
import { ResultSpecializationDto } from 'src/specialization/dto/response-specialization.dto';

class ResultDoctorDto {
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
  @Type(() => ResultSpecializationDto)
  specialization: ResultSpecializationDto;

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

export class ResponseDoctorDto extends PartialType(WebResponseDto) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResultDoctorDto)
  data: ResultDoctorDto[];
}
