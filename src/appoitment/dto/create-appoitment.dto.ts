import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAppoitmentDto {
  @IsNotEmpty()
  @IsNumber()
  patient_id;
}
