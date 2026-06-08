import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { WebFilterDto } from './web-filter.dto';

export class WebResponseDto<T = {}> {
  @IsInt()
  @IsOptional()
  status?: number;

  @IsOptional()
  data?: T;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => WebFilterDto)
  meta?: WebFilterDto;

  @IsOptional()
  @IsString()
  message?: string;
}
