import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WebResponseDto } from 'src/common-dto/web-response.dto';

class ResultPatientDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  id_card_number: string;

  @IsNotEmpty()
  @IsString()
  birth_date: string;

  @IsNotEmpty()
  @IsString()
  birth_location: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsInt()
  user_id: number;
}

export class ResponsePatientDto extends PartialType(WebResponseDto) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResultPatientDto)
  data: ResultPatientDto[];
}
