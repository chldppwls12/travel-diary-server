import { Module } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { CacheModule } from '@/cache/cache.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CacheConfigService } from '@/cache/cache.config';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { RecordModule } from '@/record/record.module';
import { FileModule } from '@/file/file.module';

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
    RecordModule,
    FileModule,
  ],
})
export class AppModule {}
