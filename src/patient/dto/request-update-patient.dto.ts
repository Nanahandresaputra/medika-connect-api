import { PartialType } from '@nestjs/mapped-types';
import { RequestCreatePatientDto } from './request-create-patient.dto';

export class RequestUpdatePatientDto extends PartialType(
  RequestCreatePatientDto,
) {}
