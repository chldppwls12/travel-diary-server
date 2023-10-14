import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendCodeRequestDto {
  @ApiProperty({
    description: '이메일',
  })
  @IsEmail()
  email: string;
}
