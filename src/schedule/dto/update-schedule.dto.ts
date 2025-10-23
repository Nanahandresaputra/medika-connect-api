import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateScheduleDto {
  @IsString()
  @IsNotEmpty()
  oldDate: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  time: string[];
}
