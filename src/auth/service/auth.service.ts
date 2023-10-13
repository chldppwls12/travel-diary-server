import { ConflictException, Injectable } from '@nestjs/common';
import { SignUpRequestDto } from '../dto/signup-request.dto';
import { UserRepository } from '../../user/repository/user.repository';
import * as bcrypt from 'bcrypt';
import { IdResponseDto } from '../../common/dto/id-response.dto';
import { ErrMessage } from '../../common/enum/err-message';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}
  async signup(requestDto: SignUpRequestDto): Promise<IdResponseDto> {
    if (await this.userRepository.isExistEmail(requestDto.email)) {
      throw new ConflictException(ErrMessage.ALREADY_EXISTS_EMAIL);
    }

    requestDto.password = await bcrypt.hash(requestDto.password, 10);
    return {
      id: await this.userRepository.create(requestDto),
    };
  }
}
