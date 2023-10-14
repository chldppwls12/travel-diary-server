import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../service/auth.service';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<boolean> {
    try {
      await this.authService.validateUser(email, password);
    } catch (err: any) {
      throw new HttpException(
        {
          status: err.getStatus(),
          message: err.message,
        },
        err.getStatus(),
      );
    }
    return true;
  }
}
