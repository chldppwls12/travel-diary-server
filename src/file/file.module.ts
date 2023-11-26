import { Module } from '@nestjs/common';
import { FileController } from '@/file/controller/file.controller';
import { FileService } from '@/file/service/file.service';
import { PrismaService } from '@/prisma/prisma.service';
import { FileRepository } from '@/file/repository/file.repository';

@Module({
  controllers: [FileController],
  providers: [FileService, PrismaService, FileRepository],
})
export class FileModule {}
