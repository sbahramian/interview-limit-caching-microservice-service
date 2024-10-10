import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { localization } from '../helper';
import { LocalizationMessage } from '../../user/infrastructure/localization/enum';
import { LanguageListEnum } from '../enum';
import Redis from 'ioredis';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private readonly redisClient: Redis;

  constructor(private readonly reflector: Reflector) {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost', 
      port: +process.env.REDIS_POST || 6379,       
    });
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['userid'];

    if (!userId) {
      throw new HttpException(
        localization.message(LocalizationMessage.USER_NOT_FOUND, { lang: LanguageListEnum.ENGLISH }),
        HttpStatus.NOT_FOUND,
      );
    }

    const maxRequests = this.reflector.get<number>('rateLimitMaxRequests', context.getHandler());
    const windowInSeconds = this.reflector.get<number>('rateLimitWindowInSeconds', context.getHandler());
    const key = `user:rate-limit:${userId}`;
    
    const requests = await this.redisClient.get(key);
    
    console.log("RateLimitInterceptor", {maxRequests, windowInSeconds, key, requests});

    if (requests === null) {
      await this.redisClient.set(key, '1', 'EX', windowInSeconds);
    } else if (parseInt(requests) <= maxRequests) {
      await this.redisClient.incr(key);
    } else {
      throw new HttpException(
        localization.message(LocalizationMessage.TOO_MANY_REQUEST_ERROR, { lang: LanguageListEnum.ENGLISH }),
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }     

    return next.handle();
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }
}
