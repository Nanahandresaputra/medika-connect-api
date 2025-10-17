import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class SuccessResponseService {
  getResponse(data?: any, message?: string) {
    return {
      status: HttpStatus.OK,
      ...(data && { data }),
      message: message ? message : 'Success',
    };
  }
}
