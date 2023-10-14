import { PrismaService } from '../../prisma/prisma.service';
import { File, FileType, Status } from '@prisma/client';
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

  async checkFileTypeById(id: string): Promise<FileType | null> {
    return (
      await this.prisma.file.findFirst({
        select: {
          type: true,
        },
        where: {
          id,
          status: Status.NORMAL,
        },
      })
    )?.type;
  }

  async findById(id: string): Promise<File | null> {
    return this.prisma.file.findFirst({
      where: {
        id,
        status: Status.NORMAL,
      },
    });
  }
}
