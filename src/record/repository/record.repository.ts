import { PrismaService } from '../../prisma/prisma.service';
import { CreateRecordDto } from '../dto/create-record.dto';
import { Status, Record, FileType, Prisma, RecordFile } from '@prisma/client';
import { Injectable } from '@nestjs/common';
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

  async findProvinceIdByCityId(cityId: number): Promise<number | null> {
    return (
      await this.prisma.city.findFirst({
        where: {
          id: cityId,
        },
      })
    )?.provinceId;
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

  async update(
    recordId: string,
    requestDto: UpdateRecordDto,
    provinceId?: number,
  ): Promise<void> {
    await this.prisma.record.update({
      where: {
        id: recordId,
      },
      data: {
        ...requestDto,
        provinceId,
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

  async deleteRecordGroup(recordId: string): Promise<void> {
    await this.prisma.recordGroup.deleteMany({
      where: {
        recordId,
      },
    });
  }

  async findFullMap(userId: string): Promise<Record[]> {
    // record에서 provinceId 별로 createdAt이 가장 최근 것인 일기 가져오기
    return this.prisma.$queryRaw`
      SELECT id, province_id AS provinceId, MAX(created_at) AS maxCreatedAt
      FROM Record
      WHERE status = ${Status.NORMAL} AND userId = ${userId}
      GROUP BY province_id
  `;
  }

  async findFirstImageId(recordId: string): Promise<string | null> {
    return (
      await this.prisma.recordFile.findFirst({
        where: {
          recordId,
          type: FileType.IMAGE,
          order: 1,
        },
      })
    )?.fileId;
  }

  async findMapByProvince(userId: string, provinceId: number) {
    // 각각의 group마다 최근 작성 글 1개 씩
    await this.prisma.record.findMany({
      where: {
        userId,
        provinceId,
        status: Status.NORMAL,
      },
    });
  }

  async findGroupsByProvinceId(provinceId: number) {
    return this.prisma.provinceGroup.findMany({
      select: {
        groupId: true,
      },
      where: {
        provinceId,
      },
    });
  }

  async findCitiesByGroupId(groupId: number) {
    return this.prisma.city.findMany({
      where: {
        groupId,
      },
    });
  }

  async findAllByCityIds(userId: string, cityIds: number[]): Promise<Record[]> {
    return this.prisma.record.findMany({
      where: {
        userId,
        cityId: {
          in: cityIds,
        },
        status: Status.NORMAL,
      },
    });
  }

  async findAllbyCityId(
    userId: string,
    cityId: number,
    page: number,
    offset: number,
  ) {
    return this.prisma.record.findMany({
      where: {
        userId,
        cityId,
        status: Status.NORMAL,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * offset,
      take: offset,
    });
  }

  async isExistRecordDate(
    userId: string,
    recordDate: string,
  ): Promise<boolean> {
    return !!(await this.prisma.record.findFirst({
      where: {
        userId,
        recordDate: {
          equals: new Date(recordDate),
        },
      },
    }));
  }

  async findGroupByCityId(cityId: number): Promise<number | null> {
    return (
      await this.prisma.city.findFirst({
        select: {
          groupId: true,
        },
        where: {
          id: cityId,
        },
      })
    )?.groupId;
  }

  async createRecordGroup(recordId: string, groupId: number): Promise<void> {
    await this.prisma.recordGroup.create({
      data: {
        recordId,
        groupId,
      },
    });
  }
}
