import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { WebResponseDto } from 'src/common-dto/web-response.dto';

export class ResultSpecializationDto {
  @IsNotEmpty()
  @IsString()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class ResponseSpecializationDto extends PartialType(WebResponseDto) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResultSpecializationDto)
  data: ResultSpecializationDto[];
}
