import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { RequestCreateSpecializationDto } from './request-create-specialization.dto';

export class RequestUpdateSpecializationDto extends PartialType(
  RequestCreateSpecializationDto,
) {}
