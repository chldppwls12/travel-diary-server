import { ApiProperty } from '@nestjs/swagger';

export class LastImageResponseDto {
  @ApiProperty({
    description: '원본 파일명',
  })
  originName: string;

  @ApiProperty({
    description: 'upload 링크',
  })
  uploadedLink: string;

  @ApiProperty({
    description: 'short 링크',
  })
  shortLink: string;
}
