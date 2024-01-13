import { IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CodeType } from '@/common/enum/code-type';

export class SendCodeRequestDto {
  @ApiProperty({
    description: '이메일',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'type',
    enum: CodeType,
  })
  @IsEnum(CodeType)
  type: CodeType;
}
