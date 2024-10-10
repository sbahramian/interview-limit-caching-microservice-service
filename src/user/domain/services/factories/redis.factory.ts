import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { BaseRedisFactory } from '../../../../common';
import { Redis } from 'ioredis';

@Injectable()
export class UserRedisFactory extends BaseRedisFactory {
  constructor(@InjectRedis() protected readonly redisClient: Redis) {
    super(redisClient);
  }
}
