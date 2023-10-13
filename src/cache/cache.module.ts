import { Module } from '@nestjs/common';
import { CacheService } from './service/cache.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [RedisModule],
  providers: [CacheService],
})
export class CacheModule {}
