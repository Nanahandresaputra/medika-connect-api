import { IsNotEmpty, IsString } from 'class-validator';

export class RequestCreateSpecializationDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
