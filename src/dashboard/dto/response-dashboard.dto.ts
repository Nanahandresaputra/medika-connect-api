import {
  IsNumber,
  IsString,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WebResponseDto } from 'src/common-dto/web-response.dto';
import { PartialType } from '@nestjs/mapped-types';

/**
 * Sub-DTO for individual patients inside the today's appointment list
 */
class PatientListItemDto {
  @IsNumber()
  id!: number;

  @IsString()
  patient!: string;

  @IsString()
  doctor!: string;

  @IsString()
  date_time!: string;
}

/**
 * Sub-DTO for today's appointment metadata and patient breakdown
 */
class TodayAppointmentDto {
  @IsString() // Handles the 'any' type; assuming it maps to a date string representation
  date!: any;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientListItemDto)
  listPatients!: PatientListItemDto[];
}

/**
 * Sub-DTO for individual appointment statistic items
 */
class AppointmentStatisticDto {
  @IsString()
  date!: string;

  @IsString()
  day!: string;

  @IsObject()
  appoitmentStatus!: {
    [x: string]: any;
  };
}

/**
 * Main Dashboard Response DTO matching your exact structure
 */
export class ResponseDashboarddDto {
  @IsNumber()
  totalDoctorActive!: number;

  @IsNumber()
  totalPatientActive!: number;

  @IsNumber()
  totalAppoitmentToday!: number;

  // typed as unknown in your schema; left open for structural flexibility
  doctorTodayAvailable!: unknown;

  @ValidateNested()
  @Type(() => TodayAppointmentDto)
  todayAppoitment!: TodayAppointmentDto;

  @IsArray()
  topThreeDepartement!: any[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppointmentStatisticDto)
  apoitmentStatistic!: AppointmentStatisticDto[];
}


