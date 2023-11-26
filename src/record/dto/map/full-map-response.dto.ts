import { ApiProperty } from '@nestjs/swagger';
import { MapResponseDto } from '@/record/dto/map/map-response.dto';

export class FullMapResponseDto extends MapResponseDto {
  @ApiProperty({
    description: '도 id',
  })
  provinceId: number;
}
