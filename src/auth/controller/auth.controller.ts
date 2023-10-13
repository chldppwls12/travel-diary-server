import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignUpRequestDto } from '../dto/signup-request.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { IdResponseDto } from '../../common/dto/id-response.dto';
import { ExceptionInterceptor } from '../../common/interceptor/exception.interceptor';

@UseInterceptors(ExceptionInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiOperation({ summary: '회원가입 API' })
  @ApiCreatedResponse({
    status: 201,
    description: '회원가입 성공',
  })
  @ApiConflictResponse({
    status: 409,
    description: '이미 존재하는 이메일',
  })
  @Post('signup')
  async signup(@Body() requestDto: SignUpRequestDto): Promise<IdResponseDto> {
    return this.authService.signup(requestDto);
  }
}
