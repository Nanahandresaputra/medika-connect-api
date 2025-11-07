import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {} from './helpers.interface';

@Injectable()
export class ExceptionHandlerService {
  getResponse(error?: any) {
    console.log('error data --->', error, {
      message: error?.message,
      errInst: error?.name,
    });
    // throw new InternalServerErrorException();

    const prismaError = [
      // 'PrismaClientKnownRequestError',
      'PrismaClientUnknownRequestError',
      'PrismaClientRustPanicError',
      'PrismaClientInitializationError',
      'PrismaClientValidationError',
    ];

    if (error?.name === 'PrismaClientKnownRequestError') {
      throw new BadRequestException(
        `Unique constraint failed on the fields ${error?.meta?.target?.toString()}`,
      );
    } else if (prismaError.includes(error?.name) || error?.message) {
      throw new BadRequestException(error?.message);
    } else {
      throw new InternalServerErrorException();
    }
  }
}
