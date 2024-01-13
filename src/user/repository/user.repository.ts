import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { SignUpRequestDto } from '@/auth/dto/signup-request.dto';
import { Status, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async isExistEmail(email: string): Promise<boolean> {
    return !!(await this.prisma.user.findFirst({
      where: {
        email,
        status: Status.NORMAL,
      },
    }));
  }

  async create(requestDto: SignUpRequestDto): Promise<string> {
    return (
      await this.prisma.user.create({
        data: {
          ...requestDto,
        },
      })
    ).id;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
        status: Status.NORMAL,
      },
    });
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: Status.DELETED,
      },
    });
  }

  async resetPassword(userId: string, password: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password,
      },
    });
  }

  async findUserById(userId: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        status: Status.NORMAL,
      },
    });
  }
}
