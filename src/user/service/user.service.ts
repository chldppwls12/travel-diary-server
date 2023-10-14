import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { TokenPayloadDto } from '../../auth/dto/token-payload.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async delete(user: TokenPayloadDto): Promise<void> {
    await this.userRepository.delete(user.userId);
  }
}
