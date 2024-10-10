import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { BaseRedisRepository } from '../../../../common';
import { Redis } from 'ioredis';

@Injectable()
export class UserRedisRepository extends BaseRedisRepository {
  constructor(@InjectRedis() protected readonly redisClient: Redis) {
    super(redisClient);
  }
}
