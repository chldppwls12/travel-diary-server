import { Module } from '@nestjs/common';
import { RecordController } from './controller/record.controller';
import { RecordService } from './service/record.service';
import { PrismaService } from '../prisma/prisma.service';
import { RecordRepository } from './repository/record.repository';
import { FileRepository } from '../file/repository/file.repository';

@Module({
  controllers: [RecordController],
  providers: [RecordService, PrismaService, RecordRepository, FileRepository],
})
export class RecordModule {}
