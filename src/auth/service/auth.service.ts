import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpRequestDto } from '@/auth/dto/signup-request.dto';
import { UserRepository } from '@/user/repository/user.repository';
import * as bcrypt from 'bcrypt';
import { IdResponseDto } from '@/common/dto/id-response.dto';
import { ErrMessage } from '@/common/enum/err-message';
import { LoginRequestDto } from '@/auth/dto/login-request.dto';
import { TokensRequestDto } from '@/auth/dto/tokens-request.dto';
import { TokensResponseDto } from '@/auth/dto/tokens-response.dto';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '@/cache/service/cache.service';
import { RedisKey } from '@/common/enum/redis-key';
import { CurrentUserDto } from '@/common/dto/current-user.dto';
import { SendCodeRequestDto } from '../dto/send-code-request.dto';
import { MailService } from '@/mail/service/mail.service';
import { VerifyCodeRequestDto } from '../dto/verify-code-request.dto';
import { CodeType } from '@/common/enum/code-type';
import { UpdatePasswordRequestDto } from '@/auth/dto/update-password-request.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private cacheService: CacheService,
    private mailService: MailService,
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

  async sendCode(requestDto: SendCodeRequestDto): Promise<void> {
    const { email, type } = requestDto;

    if (type === CodeType.REGISTER) {
      if (await this.userRepository.isExistEmail(email)) {
        throw new ConflictException(ErrMessage.INVALID_EMAIL);
      }
    }

    const randomCode = await this.mailService.sendCode(email);
    await this.cacheService.set(
      `${RedisKey.EMAIL_CODE_KEY}:${email}`,
      randomCode.toString(),
      60 * 3,
    );
  }

  async verifyCode(requestDto: VerifyCodeRequestDto): Promise<void> {
    const { email, code, type } = requestDto;

    if (type === CodeType.REGISTER) {
      if (await this.userRepository.isExistEmail(email)) {
        throw new ConflictException(ErrMessage.ALREADY_EXISTS_EMAIL);
      }
    }

    if (
      code !==
      (await this.cacheService.get(`${RedisKey.EMAIL_CODE_KEY}:${email}`))
    ) {
      throw new BadRequestException(ErrMessage.INVALID_CODE);
    }
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

  async reissueTokens(user: CurrentUserDto): Promise<any> {
    const { userId } = user;

    if (!userId) {
      throw new UnauthorizedException(ErrMessage.INVALID_TOKEN);
    }

    // 해당 refresh token이 redis에 존재하는지 확인
    if (
      !(await this.cacheService.get(`${RedisKey.REFRESH_TOKEN_KEY}:${userId}`))
    ) {
      throw new UnauthorizedException(ErrMessage.INVALID_TOKEN);
    }

    return this.signTokens({
      userId,
      email: user.email,
    });
  }

  async resetPassword(
    user: CurrentUserDto,
    requestDto: UpdatePasswordRequestDto,
  ): Promise<void> {
    const { prevPassword, newPassword } = requestDto;

    const { password } = await this.userRepository.findUserById(user.userId);
    if (!(await bcrypt.compare(prevPassword, password))) {
      throw new BadRequestException(ErrMessage.INVALID_PASSWORD);
    }

    await this.userRepository.resetPassword(
      user.userId,
      await bcrypt.hash(newPassword, 10),
    );
  }
}
