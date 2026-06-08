import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export enum roleUser {
  admin = 'admin',
  customer = 'customer',
}

export class WebFilterDto {
  @IsOptional()
  @IsInt()
  limit?: number; //optional

  @IsOptional()
  @IsInt()
  page?: number; //optional

  @IsOptional()
  @IsString()
  search?: string; //optional

  @IsOptional()
  @IsInt()
  specializationId?: number; // for (schedule)

  @IsOptional()
  @IsInt()
  doctorId?: number; // for (schedule | patient | appoitment)

  @IsOptional()
  @IsString()
  date?: string; // for (schedule)

  @IsOptional()
  @IsString()
  startDate?: string; // for filter date range

  @IsOptional()
  @IsString()
  endDate?: string; // for filter date range

  @IsOptional()
  @IsInt()
  patientId?: number; // for (appoitment)

  @IsOptional()
  @IsEnum(roleUser)
  roleUser?: roleUser; // for (user)
}
