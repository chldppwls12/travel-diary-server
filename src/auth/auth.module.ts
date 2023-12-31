import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserRepository } from '../user/repository/user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from '../cache/service/cache.service';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MailService } from '../mail/service/mail.service';

@Module({
  imports: [
    CacheModule.register(),
    PassportModule,
    JwtModule.register({
      secret: 'jwt-secret',
      signOptions: { expiresIn: 7200000 },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailService,
    UserRepository,
    PrismaService,
    CacheService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
