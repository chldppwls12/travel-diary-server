import { Injectable } from '@nestjs/common';
import { UploadFileResponseDto } from '@/file/dto/upload-file-response.dto';
import { UploadFileRequestDto } from '@/file/dto/upload-file-request.dto';
import { FileRepository } from '@/file/repository/file.repository';
import { FileType } from '@prisma/client';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';

@Injectable()
export class FileService {
  private s3 = new AWS.S3({ apiVersion: '2006-03-01' });
  constructor(
    private fileRepository: FileRepository,
    private configService: ConfigService,
  ) {
    this.s3.config.update({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }
  async upload(
    requestDto: UploadFileRequestDto,
  ): Promise<{ data: UploadFileResponseDto[] }> {
    const data: UploadFileResponseDto[] = [];

    if (requestDto?.image?.length > 0) {
      const id = v4();
      const uploadParams = {
        Bucket: this.configService.get<string>('S3_BUCKET'),
        Key: id,
        Body: requestDto.image[0].buffer,
      };

      const uploadedLink = (await this.s3.upload(uploadParams).promise())
        .Location;
      // TODO: shortLink
      await this.fileRepository.upload(
        requestDto.image[0].originalname,
        uploadedLink,
        uploadedLink,
        FileType.IMAGE,
      );

      data.push({
        id,
        originName: requestDto.image[0].originalname,
        type: FileType.IMAGE,
        uploadedLink,
      });
    }
    if (requestDto?.video?.length > 0) {
      const id = v4();
      const uploadParams = {
        Bucket: this.configService.get<string>('S3_BUCKET'),
        Key: id,
        Body: requestDto.video[0].buffer,
      };

      const uploadedLink = (await this.s3.upload(uploadParams).promise())
        .Location;
      // TODO: shortLink
      // TODO: add thumbnail
      await this.fileRepository.upload(
        requestDto.video[0].originalname,
        uploadedLink,
        uploadedLink,
        FileType.VIDEO,
        'https://yj-traily.s3.amazonaws.com/2ce64192-0383-4685-ad88-31c5950eb4db',
        'https://yj-traily.s3.amazonaws.com/2ce64192-0383-4685-ad88-31c5950eb4db',
      );

      data.push({
        id,
        originName: requestDto.video[0].originalname,
        type: FileType.VIDEO,
        uploadedLink,
      });
    }
    if (requestDto?.voice?.length > 0) {
      const id = v4();
      const uploadParams = {
        Bucket: this.configService.get<string>('S3_BUCKET'),
        Key: id,
        Body: requestDto.voice[0].buffer,
      };

      const uploadedLink = (await this.s3.upload(uploadParams).promise())
        .Location;
      // TODO: shortLink
      await this.fileRepository.upload(
        requestDto.voice[0].originalname,
        uploadedLink,
        uploadedLink,
        FileType.VOICE,
      );

      data.push({
        id,
        originName: requestDto.voice[0].originalname,
        type: FileType.VOICE,
        uploadedLink,
      });
    }

    return {
      data,
    };
  }
}
