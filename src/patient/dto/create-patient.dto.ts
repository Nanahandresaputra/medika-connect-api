import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  id_card_number: number;

  @IsNotEmpty()
  @IsString()
  birth_date: string;

  @IsNotEmpty()
  @IsString()
  birth_location: string;

  @IsNotEmpty()
  @IsNumber()
  phone_number: number;

  @IsNotEmpty()
  @IsString()
  address: string;
}
