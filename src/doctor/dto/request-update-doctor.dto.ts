import { PartialType } from '@nestjs/mapped-types';
import { RequestCreateDoctorDto } from './request-create-doctor.dto';

export class RequestUpdateDoctorDto extends PartialType(
  RequestCreateDoctorDto,
) {}
