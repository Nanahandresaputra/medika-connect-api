import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WebResponseDto } from 'src/common-dto/web-response.dto';

@Injectable()
export class GlobalResponseInterceptor<T>
  implements NestInterceptor<T, WebResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<WebResponseDto<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((results: T) => {
        const returnResp: WebResponseDto<T> = {
          status: response.statusCode,
          message: (results as any)?.message
            ? (results as any).message
            : 'Success',
          ...((results as any)?.data && { data: (results as any).data }),
          ...((results as any)?.token && { token: (results as any).token }),
          ...((results as any)?.meta && { meta: (results as any).meta }),
        };

        return returnResp;
      }),
    );
  }
}
