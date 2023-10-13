import {
  RedisOptionsFactory,
  RedisModuleOptions,
} from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheConfigService implements RedisOptionsFactory {
  createRedisOptions(): RedisModuleOptions {
    return {
      closeClient: true,
      readyLog: true,
      errorLog: true,
      config: {
        host: 'localhost',
        port: 6379,
      },
    };
  }
}
