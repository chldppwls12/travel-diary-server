import { ApiProperty } from '@nestjs/swagger';

export class RecordVoiceResponseDto {
  @ApiProperty({
    description: 'id',
  })
  id: string;

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
}
