import { PartialType } from '@nestjs/mapped-types';
import { RequestCreateUserDto } from './request-create-user.dto';

export class RequestUpdateUserDto extends PartialType(RequestCreateUserDto) {}
