import { Module } from '@nestjs/common';
import { FileController } from './controller/file.controller';
import { FileService } from './service/file.service';
import { PrismaService } from '../prisma/prisma.service';
import { FileRepository } from './repository/file.repository';

@Module({
  controllers: [FileController],
  providers: [FileService, PrismaService, FileRepository],
})
export class FileModule {}
