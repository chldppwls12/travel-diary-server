import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { CodeType } from '@/common/enum/code-type';

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

  @ApiProperty({
    description: 'type',
    enum: CodeType,
  })
  @IsEnum(CodeType)
  type: CodeType;
}
