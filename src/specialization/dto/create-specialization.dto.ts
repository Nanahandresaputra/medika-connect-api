import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpecializationDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
