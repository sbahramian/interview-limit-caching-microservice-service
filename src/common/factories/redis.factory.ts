import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class BaseRedisFactory {
  constructor(protected readonly redisClient: Redis) {}

  /* eslint-disable @typescript-eslint/no-explicit-any */
  public async Upsert(key: string, value: any, expiresIn?: number): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value));

    if (expiresIn) {
      await this.redisClient.expire(key, expiresIn);
    }
  }
}
