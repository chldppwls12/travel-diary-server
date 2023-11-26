import { MapResponseDto } from '@/record/dto/map/map-response.dto';
import { ApiProperty } from '@nestjs/swagger';

class CityResponseDto {
  @ApiProperty({
    description: 'city id',
  })
  id: number;

  @ApiProperty({
    description: 'city 이름',
  })
  name: string;
}

export class GroupCityMapResponseDto extends MapResponseDto {
  @ApiProperty({
    description: 'province id',
  })
  provinceId: number;

  @ApiProperty({
    description: 'city',
    type: CityResponseDto,
  })
  city: CityResponseDto;
}
