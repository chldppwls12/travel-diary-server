import { ApiProperty } from '@nestjs/swagger';
import { LastImageResponseDto } from './map/last-image-response.dto';

export class FindCalendarResponseDto {
  @ApiProperty({
    description: 'id',
  })
  id: string;

  @ApiProperty({
    description: '이미지',
  })
  image: LastImageResponseDto;

  @ApiProperty({
    description: '날짜',
  })
  recordDate: Date;
}
