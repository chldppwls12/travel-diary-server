import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '@prisma/client';

export class RecordMediaResponseDto {
  @ApiProperty({
    description: 'id',
  })
  id: string;

  @ApiProperty({
    description: 'id',
  })
  type: FileType;

  @ApiProperty({
    description: '원본 이름',
  })
  originName: string;

  @ApiProperty({
    description: '업로드 링크',
  })
  uploadedLink: string;

  @ApiProperty({
    description: 'short 링크',
  })
  shortLink: string;

  @ApiProperty({
    description: '썸네일 링크',
  })
  thumbnailLink: string;

  @ApiProperty({
    description: '썸네일 short 링크',
  })
  thumbnailShortLink: string;
}
