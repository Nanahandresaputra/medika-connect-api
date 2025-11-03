import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAppoitmentDto {
  @IsNotEmpty()
  @IsNumber()
  patient_id: number;

  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

  @IsNotEmpty()
  @IsString()
  date_time: string;
}
