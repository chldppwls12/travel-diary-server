import { Injectable } from '@nestjs/common';
import { UploadFileResponseDto } from '../dto/upload-file-response.dto';
import { UploadFileRequestDto } from '../dto/upload-file-request.dto';
import { FileRepository } from '../repository/file.repository';
import { FileType } from '@prisma/client';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { uuid } from 'uuidv4';

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

    const fileTypes = ['image', 'video', 'voice'];

    for (const fileType of fileTypes) {
      if (requestDto?.[fileType]?.length > 0) {
        const id = uuid();
        const uploadParams = {
          Bucket: this.configService.get<string>('S3_BUCKET'),
          Key: id,
          Body: requestDto[fileType][0].buffer,
        };
        await this.fileRepository.upload(
          requestDto[fileType][0],
          FileType[fileType.toUpperCase()],
        );

        data.push({
          id,
          originName: requestDto[fileType][0].originalname,
          type: FileType[fileType.toUpperCase()],
          uploadedLink: (await this.s3.upload(uploadParams).promise()).Location,
        });
      }
    }

    return {
      data,
    };
  }
}
