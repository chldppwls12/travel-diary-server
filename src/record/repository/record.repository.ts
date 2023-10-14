import { PrismaService } from '../../prisma/prisma.service';
import { CreateRecordDto } from '../dto/create-record.dto';

export class RecordRepository {
  constructor(private prisma: PrismaService) {}

  async create(requestDto: CreateRecordDto): Promise<string> {
    return (
      await this.prisma.record.create({
        data: {
          ...requestDto,
        },
      })
    ).id;
  }
}
