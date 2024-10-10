import { LanguageListEnum } from '../enum';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class DefaultHeadersInterceptor implements NestInterceptor {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers['language']) {
      request.headers['language'] = LanguageListEnum.ENGLISH;
    }

    if (!request.headers['version']) {
      request.headers['version'] = 1;
    }

    return next.handle();
  }
}
