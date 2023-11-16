import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadFileResponseDto } from '../dto/upload-file-response.dto';
import { UploadFileRequestDto } from '../dto/upload-file-request.dto';
import { FileService } from '../service/file.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        video: {
          type: 'string',
          format: 'binary',
        },
        voice: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'image',
        maxCount: 1,
      },
      {
        name: 'video',
        maxCount: 1,
      },
      {
        name: 'voice',
        maxCount: 1,
      },
    ]),
  )
  async create(
    @UploadedFiles() files: UploadFileRequestDto,
  ): Promise<{ data: UploadFileResponseDto[] }> {
    return this.fileService.upload(files);
  }
}
