import { PrismaService } from '../../prisma/prisma.service';
import { CreateRecordDto } from '../dto/create-record.dto';
import { Status, Record, FileType, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { UpdateRecordRequestDto } from '../dto/update-record-request.dto';
import { UpdateRecordDto } from '../dto/update-record.dto';

@Injectable()
export class RecordRepository {
  constructor(private prisma: PrismaService) {}

  async isExist(recordId: string): Promise<boolean> {
    return !!(await this.prisma.record.findFirst({
      where: {
        id: recordId,
        status: Status.NORMAL,
      },
    }));
  }

  async create(requestDto: CreateRecordDto): Promise<string> {
    return (
      await this.prisma.record.create({
        data: {
          ...requestDto,
        },
      })
    ).id;
  }

  async createRecordFileWithImage(
    recordId: string,
    imageId: string,
    order: number,
  ) {
    await this.prisma.recordFile.create({
      data: {
        recordId,
        fileId: imageId,
        type: FileType.IMAGE,
        order,
      },
    });
  }

  async createRecordFileWithVideo(recordId: string, videoId: string) {
    await this.prisma.recordFile.create({
      data: {
        recordId,
        fileId: videoId,
        type: FileType.VIDEO,
        order: 1,
      },
    });
  }

  async createRecordFileWithVoice(recordId: string, voiceId: string) {
    await this.prisma.recordFile.create({
      data: {
        recordId,
        fileId: voiceId,
        type: FileType.VOICE,
        order: 1,
      },
    });
  }

  async isExistCityId(cityId: number): Promise<boolean> {
    return !!(await this.prisma.city.findFirst({
      where: {
        id: cityId,
      },
    }));
  }

  async isUserRecord(userId: string, recordId: string): Promise<boolean> {
    return !!(await this.prisma.record.findFirst({
      where: {
        id: recordId,
        userId,
        status: Status.NORMAL,
      },
    }));
  }

  async findById(
    recordId: string,
  ): Promise<Prisma.RecordGetPayload<{ include: { files: true } }>> {
    return this.prisma.record.findFirst({
      include: {
        files: true,
      },
      where: {
        id: recordId,
        status: Status.NORMAL,
      },
    });
  }

  async deleteRecordFile(recordId: string, fileId: string): Promise<void> {
    await this.prisma.recordFile.deleteMany({
      where: {
        recordId,
        fileId,
      },
    });
  }

  async update(recordId: string, requestDto: UpdateRecordDto): Promise<void> {
    await this.prisma.record.update({
      where: {
        id: recordId,
      },
      data: {
        ...requestDto,
      },
    });
  }

  async delete(recordId: string): Promise<void> {
    await this.prisma.record.update({
      where: {
        id: recordId,
      },
      data: {
        status: Status.DELETED,
      },
    });
  }
}
