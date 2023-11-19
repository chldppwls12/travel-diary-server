import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601 } from 'class-validator';
export class IsExistDateQueryDto {
  @ApiProperty({
    description: '날짜',
  })
  @IsISO8601()
  recordDate?: string;
}
