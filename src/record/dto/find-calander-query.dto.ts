import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindCalanderQueryDto {
  @ApiProperty({
    description: '년도',
  })
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    description: '월',
  })
  @IsNotEmpty()
  month: number;
}
