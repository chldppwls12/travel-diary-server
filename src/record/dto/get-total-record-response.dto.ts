import { ApiProperty } from '@nestjs/swagger';

export class GetTotalRecordResponseDto {
  @ApiProperty({
    description: '총 개수',
  })
  total: number;
}
