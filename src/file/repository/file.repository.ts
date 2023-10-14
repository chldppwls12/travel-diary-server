import { PrismaService } from '../../prisma/prisma.service';
import { Status } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileRepository {
  constructor(private prisma: PrismaService) {}

  async isExist(id: string): Promise<boolean> {
    return !!(await this.prisma.file.findFirst({
      where: {
        id,
        status: Status.NORMAL,
      },
    }));
  }
}
