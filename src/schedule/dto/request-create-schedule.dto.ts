import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class DateDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  time: string[];
}

export class RequestCreateScheduleDto {
  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => DateDto)
  schedules: DateDto[];
}
