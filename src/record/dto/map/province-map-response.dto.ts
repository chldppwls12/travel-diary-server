import { MapResponseDto } from '@/record/dto/map/map-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProvinceMapResponseDto extends MapResponseDto {
  @ApiProperty({
    description: '그룹 id',
  })
  groupId: number;
}
