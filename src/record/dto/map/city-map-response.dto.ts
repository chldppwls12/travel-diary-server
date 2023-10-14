import { MapResponseDto } from './map-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CityMapResponseDto extends MapResponseDto {
  @ApiProperty({
    description: '구 id',
  })
  cityId: number;
}
