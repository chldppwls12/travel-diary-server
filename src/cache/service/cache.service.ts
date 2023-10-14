import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.redis.set(key, value, 'EX', ttl);
  }

  async sadd(key: string, value: string, ttl: number): Promise<void> {
    await this.redis.sadd(key, value, 'EX', ttl);
  }

  async sismember(key: string, value: string): Promise<boolean> {
    return !!(await this.redis.sismember(key, value));
  }
}
