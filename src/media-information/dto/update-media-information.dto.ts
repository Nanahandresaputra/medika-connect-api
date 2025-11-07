import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaInformationDto } from './create-media-information.dto';

export class UpdateMediaInformationDto extends PartialType(CreateMediaInformationDto) {}
