import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignUpRequestDto } from '../dto/signup-request.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IdResponseDto } from '../../common/dto/id-response.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { TokensResponseDto } from '../dto/tokens-response.dto';

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
}
