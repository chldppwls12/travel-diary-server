import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CacheModule } from './cache/cache.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CacheConfigService } from './cache/cache.config';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    CacheModule,
    RedisModule.forRootAsync({
      useClass: CacheConfigService,
    }),
    MailModule,
  ],
})
export class AppModule {}
