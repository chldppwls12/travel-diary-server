import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { TokenPayloadDto } from '../dto/token-payload.dto';
import { CacheService } from '../../cache/service/cache.service';
import { RedisKey } from '../../common/enum/redis-key';
import { ErrMessage } from '../../common/enum/err-message';
import { CurrentUserDto } from '../../common/dto/current-user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private cacheService: CacheService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'jwt-secret',
      passReqToCallback: true,
    });
  }

  // 토큰 유효성 검사 및 payload 반환
  async validate(req: any, payload: TokenPayloadDto): Promise<CurrentUserDto> {
    const token = req.token;

    // jwt blacklist 확인
    if (await this.cacheService.sismember(RedisKey.JWT_BLACKLIST_KEY, token)) {
      throw new UnauthorizedException(ErrMessage.INVALID_TOKEN);
    }

    return {
      userId: payload.userId,
      email: payload.email,
    };
  }
}
