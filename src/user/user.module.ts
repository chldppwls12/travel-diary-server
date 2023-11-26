import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserController } from '@/user/controller/user.controller';
import { UserService } from '@/user/service/user.service';
import { UserRepository } from '@/user/repository/user.repository';

@Module({
  controllers: [UserController],
  providers: [PrismaService, UserService, UserRepository],
})
export class UserModule {}
