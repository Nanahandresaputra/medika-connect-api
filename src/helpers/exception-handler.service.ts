import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {} from './helpers.interface';

@Injectable()
export class ExceptionHandlerService {
  getResponse(error: any) {
    console.log('error data --->', error, {
      message: error?.message,
      errInst: error?.name,
    });
    // throw new InternalServerErrorException();

    if (error?.name === 'PrismaClientKnownRequestError') {
      throw new BadRequestException(
        `Unique constraint failed on the fields ${error?.meta?.target?.toString()}`,
      );
    } else if (error?.name === 'PrismaClientValidationError') {
      throw new BadRequestException();
    } else {
      throw new InternalServerErrorException();
    }
  }
}
