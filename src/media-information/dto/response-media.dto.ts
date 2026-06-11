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

export class ResponseMediaDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  ext_img_id: string;

  @Type(() => Date)
  @IsNotEmpty()
  created_at: Date;

  @IsNotEmpty()
  @IsString()
  img_url: string;
}
