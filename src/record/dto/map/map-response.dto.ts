import { ApiProperty } from '@nestjs/swagger';
import { LastImageResponseDto } from '@/record/dto/map/last-image-response.dto';

export class MapResponseDto {
  @ApiProperty({
    description: 'id',
  })
  id: string;

  @ApiProperty({
    description: '이미지',
  })
  image: LastImageResponseDto;
}
