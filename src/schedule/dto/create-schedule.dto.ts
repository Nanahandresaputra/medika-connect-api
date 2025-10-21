import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

class DateDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsArray()
  @ArrayMinSize(1)
  time: string[];
}

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => DateDto)
  schedules: DateDto[];
}
