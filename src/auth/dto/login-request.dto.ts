import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: '이메일',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: '비밀번호',
  })
  @IsString()
  password: string;
}
