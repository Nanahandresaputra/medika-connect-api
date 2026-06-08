import { PartialType } from '@nestjs/mapped-types';
import { RequestCreateAppoitmentDto } from './request-create-appoitment.dto';

export class RequestUpdateAppoitmentDto extends PartialType(
  RequestCreateAppoitmentDto,
) {}
