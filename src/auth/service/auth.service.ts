import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpRequestDto } from '../dto/signup-request.dto';
import { UserRepository } from '../../user/repository/user.repository';
import * as bcrypt from 'bcrypt';
import { IdResponseDto } from '../../common/dto/id-response.dto';
import { ErrMessage } from '../../common/enum/err-message';
import { LoginRequestDto } from '../dto/login-request.dto';
import { TokensRequestDto } from '../dto/tokens-request.dto';
import { TokensResponseDto } from '../dto/tokens-response.dto';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../../cache/service/cache.service';
import { RedisKey } from '../../common/enum/redis-key';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private cacheService: CacheService,
  ) {}
  async signup(requestDto: SignUpRequestDto): Promise<IdResponseDto> {
    if (await this.userRepository.isExistEmail(requestDto.email)) {
      throw new ConflictException(ErrMessage.ALREADY_EXISTS_EMAIL);
    }

    requestDto.password = await bcrypt.hash(requestDto.password, 10);
    return {
      id: await this.userRepository.create(requestDto),
    };
  }

  async validateUser(email: string, password: string): Promise<void> {
    // email 검증
    if (!(await this.userRepository.isExistEmail(email))) {
      throw new ConflictException(ErrMessage.INVALID_EMAIL);
    }

    // password 검증
    const user = await this.userRepository.findUserByEmail(email);
    const hashedPw = user?.password;
    if (!hashedPw) {
      throw new UnauthorizedException(ErrMessage.INVALID_PASSWORD);
    }
    if (!(await bcrypt.compare(password, hashedPw))) {
      throw new UnauthorizedException(ErrMessage.INVALID_PASSWORD);
    }
  }

  async login(requestDto: LoginRequestDto): Promise<TokensResponseDto> {
    const { email } = requestDto;
    const user = await this.userRepository.findUserByEmail(email);
    const userId = user?.id;

    if (!userId) {
      throw new UnauthorizedException(ErrMessage.INVALID_EMAIL);
    }

    const tokens = await this.signTokens({ userId, email });

    // redis에 refreshtoken 등록
    await this.cacheService.set(
      `${RedisKey.REFRESH_TOKEN_KEY}:${userId}`,
      tokens.refreshToken,
      1209600000,
    );

    return tokens;
  }

  async signTokens(payload: TokensRequestDto): Promise<TokensResponseDto> {
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: 'jwt-secret',
        expiresIn: 1209600000,
      }),
    };
  }
}
