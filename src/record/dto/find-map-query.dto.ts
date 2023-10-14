import { IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// TODO: IsNumber() err
export class FindMapQueryDto {
  @ApiProperty({
    description: '도 id',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  provinceId?: number;

  @ApiProperty({
    description: '그룹 id',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  groupId?: number;

  @ApiProperty({
    description: '도시 id',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  cityId?: number;

  @ApiProperty({
    description: '페이지',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiProperty({
    description: '오프셋',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  offset?: number;
}
