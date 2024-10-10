import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class BaseRedisRepository {
  constructor(protected readonly redisClient: Redis) {}

  public async Find<T>(key: string): Promise<T | null> {
    const result = await this.redisClient.get(key);
    return result ? JSON.parse(result) : null;
  }

  public async Destroy(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  public async Increment(key: string, by: number = 1): Promise<number> {
    return await this.redisClient.incrby(key, by);
  }

  public async Decrement(key: string, by: number = 1): Promise<number> {
    return await this.redisClient.decrby(key, by);
  }

  public async IsExist(key: string): Promise<boolean> {
    return (await this.redisClient.exists(key)) === 1;
  }

  public async GetTTL(key: string): Promise<number> {
    return await this.redisClient.ttl(key);
  }

  public async UpdateTTL(key: string, adjustment: number): Promise<number> {
    const ttl = await this.redisClient.ttl(key);

    if (ttl > 0) {
      const new_ttl = Math.max(ttl + adjustment, 0);
      await this.redisClient.expire(key, new_ttl);

      return new_ttl;
    }

    return -1;
  }
}
