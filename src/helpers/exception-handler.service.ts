import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {} from './helpers.interface';

@Injectable()
export class ExceptionHandlerService {
  getResponse(error: any) {
    const prismaError = [...new Array(6)].map((_, index) => `P${index + 1}`);
    console.log('error data --->', error);
    // throw new InternalServerErrorException();

    if (prismaError.includes(`${error?.code}`.slice(0, 2))) {
      if (error?.code === 'P2002') {
        throw new BadRequestException(
          `Unique constraint failed on the fields ${error?.meta?.target?.toString()}`,
        );
      } else {
        throw new BadRequestException();
      }
    } else {
      throw new InternalServerErrorException();
    }
  }
}
