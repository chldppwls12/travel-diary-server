import { ApiProperty } from '@nestjs/swagger';
import { Feeling, Weather } from '@prisma/client';
import { RecordMediaResponseDto } from '@/record/dto/record-media-response.dto';
import { RecordVoiceResponseDto } from '@/record/dto/record-voice-response.dto';

export class FindRecordResponseDto {
  @ApiProperty({
    description: 'id',
  })
  id: string;

  @ApiProperty({
    description: '기록 일자',
  })
  date: Date;

  @ApiProperty({
    description: '감정',
  })
  feeling: Feeling;

  @ApiProperty({
    description: '날씨',
  })
  weather: Weather;

  @ApiProperty({
    description: '내용',
  })
  content: string;

  @ApiProperty({
    description: '사진 or 비디오 리스트',
    type: [RecordMediaResponseDto],
  })
  medias: RecordMediaResponseDto[] | [];

  @ApiProperty({
    description: '기록 날짜',
  })
  createdAt: Date;

  @ApiProperty({
    description: '지역 id',
  })
  cityId: number;

  @ApiProperty({
    description: '음성',
    type: RecordVoiceResponseDto,
  })
  voice: RecordVoiceResponseDto | null;

  @ApiProperty({
    description: '기타 지역명',
  })
  place: string | null;
}
