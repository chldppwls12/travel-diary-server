import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CacheModule } from './cache/cache.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CacheConfigService } from './cache/cache.config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CacheModule,
    RedisModule.forRootAsync({
      useClass: CacheConfigService,
    }),
  ],
})
export class AppModule {}
