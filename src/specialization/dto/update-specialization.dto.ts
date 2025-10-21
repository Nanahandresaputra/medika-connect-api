import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecializationDto } from './create-specialization.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateSpecializationDto extends PartialType(
  CreateSpecializationDto,
) {}
