import {
  RedisOptionsFactory,
  RedisModuleOptions,
} from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheConfigService implements RedisOptionsFactory {
  constructor(private configService: ConfigService) {}
  createRedisOptions(): RedisModuleOptions {
    return {
      closeClient: true,
      readyLog: true,
      errorLog: true,
      config: {
        host: this.configService.get<string>('REDIS_HOST'),
        port: 6379,
      },
    };
  }
}
