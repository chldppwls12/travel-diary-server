import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorator/current-user.decorator';
import { UserService } from '@/user/service/user.service';
import { TokenPayloadDto } from '@/auth/dto/token-payload.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiBearerAuth()
  @ApiOperation({ summary: '회원 탈퇴 API' })
  @ApiNoContentResponse({
    status: 204,
    description: '회원 탈퇴 성공',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '유효하지 않은 토큰',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  @UseGuards(JwtAuthGuard)
  async delete(@CurrentUser() user: TokenPayloadDto): Promise<void> {
    return this.userService.delete(user);
  }
}
