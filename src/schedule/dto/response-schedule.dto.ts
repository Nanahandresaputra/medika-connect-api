import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { WebResponseDto } from 'src/common-dto/web-response.dto';

export class ScheduleTimeDateDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsNotEmpty()
  @IsString()
  date: string;

  @ValidateIf((o) => typeof o.time === 'string' || Array.isArray(o.time))
  @IsString({ message: 'time must be a string or an array of strings' })
  @IsString({
    each: true,
    message: 'Each item in the time array must be a string',
  })
  time: string | string[];
}

export class SpecializationScheduleDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class ResultScheduleByDoctor {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => SpecializationScheduleDto)
  specialization: SpecializationScheduleDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleTimeDateDto)
  schedule: ScheduleTimeDateDto[];
}

export class ResponseScheduleByDoctor extends PartialType(WebResponseDto) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResultScheduleByDoctor)
  data: ResultScheduleByDoctor[];
}

export class ResponseScheduleByDoctorOne extends PartialType(WebResponseDto) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResultScheduleByDoctor)
  data: ResultScheduleByDoctor;
}
