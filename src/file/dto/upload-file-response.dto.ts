import { FileType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({
    description: 'id',
  })
  id: string;

  @ApiProperty({
    description: '파일 타입',
    enum: FileType,
  })
  type: FileType;

  @ApiProperty({
    description: '파일 원본 명',
  })
  originName: string;

  @ApiProperty({
    description: '업로드 링크',
  })
  uploadedLink: string;
}
