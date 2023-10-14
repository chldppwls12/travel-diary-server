import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ErrMessage } from '../../common/enum/err-message';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    try {
      if (err || !user) {
        throw err || new UnauthorizedException(ErrMessage.INVALID_TOKEN);
      }
    } catch (err) {
      throw new HttpException(
        {
          status: err.getStatus(),
          message: err.message,
        },
        err.getStatus(),
      );
    }
    return user;
  }
}
