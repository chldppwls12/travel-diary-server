import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyCodeRequestDto {
  @ApiProperty({
    description: '이메일',
  })
  @IsNotEmpty()
  // @IsEmail()  TODO: 확인 필요
  email: string;

  @ApiProperty({
    description: '인증번호',
  })
  @IsNotEmpty()
  code: string;
}
