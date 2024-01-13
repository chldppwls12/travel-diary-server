import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '기존 비밀번호',
  })
  prevPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '새로운 비밀번호',
  })
  newPassword: string;
}
