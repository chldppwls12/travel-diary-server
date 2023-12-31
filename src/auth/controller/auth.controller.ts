import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from '@/auth/service/auth.service';
import { SignUpRequestDto } from '@/auth/dto/signup-request.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IdResponseDto } from '@/common/dto/id-response.dto';
import { LoginRequestDto } from '@/auth/dto/login-request.dto';
import { LocalAuthGuard } from '@/auth/guard/local-auth.guard';
import { TokensResponseDto } from '@/auth/dto/tokens-response.dto';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorator/current-user.decorator';
import { SendCodeRequestDto } from '@/auth/dto/send-code-request.dto';
import { VerifyCodeRequestDto } from '@/auth/dto/verify-code-request.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiOperation({ summary: '회원가입 API' })
  @ApiCreatedResponse({
    status: 201,
    description: '회원가입 성공',
    type: IdResponseDto,
  })
  @ApiConflictResponse({
    status: 409,
    description: '이미 존재하는 이메일',
  })
  @Post('signup')
  async signup(@Body() requestDto: SignUpRequestDto): Promise<IdResponseDto> {
    return this.authService.signup(requestDto);
  }

  @ApiOperation({ summary: '로그인 API' })
  @ApiCreatedResponse({
    status: 201,
    description: '로그인 성공',
    type: TokensResponseDto,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '유효하지 않은 이메일 or 비밀번호',
  })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() requestDto: LoginRequestDto): Promise<TokensResponseDto> {
    return this.authService.login(requestDto);
  }

  @Post('code')
  @ApiOperation({ summary: '인증번호 발송 API' })
  @ApiCreatedResponse({
    status: 201,
    description: '인증번호 발송 성공',
  })
  async sendCode(@Body() requestDto: SendCodeRequestDto): Promise<void> {
    await this.authService.sendCode(requestDto);
  }

  @Get('code')
  @ApiOperation({ summary: '인증번호 확인 API' })
  @ApiOkResponse({
    status: 200,
    description: '인증번호 확인 성공',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: '유효하지 않은 인증번호',
  })
  @ApiConflictResponse({
    status: 409,
    description: '이미 존재하는 이메일',
  })
  async verifyCode(@Query() requestDto: VerifyCodeRequestDto): Promise<void> {
    await this.authService.verifyCode(requestDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '토큰 재발급 API' })
  @ApiCreatedResponse({
    status: 201,
    description: '토큰 재발급 성공',
    type: TokensResponseDto,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '유효하지 않은 토큰',
  })
  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async reissueTokens(@CurrentUser() user): Promise<TokensResponseDto> {
    return this.authService.reissueTokens(user);
  }
}
