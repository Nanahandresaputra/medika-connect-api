import {  IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class ResponseSpecializationDto {
  @IsNotEmpty()
  @IsString()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
