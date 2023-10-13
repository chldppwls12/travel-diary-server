import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { SignUpRequestDto } from '../../auth/dto/signup-request.dto';
import { Status } from '@prisma/client';

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
}
