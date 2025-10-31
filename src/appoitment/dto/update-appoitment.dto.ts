import { PartialType } from '@nestjs/mapped-types';
import { CreateAppoitmentDto } from './create-appoitment.dto';

export class UpdateAppoitmentDto extends PartialType(CreateAppoitmentDto) {}
