import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateRecordRequestDto } from '../dto/create-record-request.dto';
import { RecordService } from '../service/record.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorator/current-user.decorator';
import { TokenPayloadDto } from '../../auth/dto/token-payload.dto';
import { IdResponseDto } from '../../common/dto/id-response.dto';
import { FindRecordResponseDto } from '../dto/find-record-response.dto';

@ApiTags('record')
@Controller('record')
export class RecordController {
  constructor(private recordService: RecordService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '일기 생성 API' })
  @ApiCreatedResponse({
    status: 201,
    description: '일기 생성 성공',
    type: IdResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() user: TokenPayloadDto,
    @Body() requestDto: CreateRecordRequestDto,
  ): Promise<IdResponseDto> {
    return await this.recordService.create(user.userId, requestDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '일기 조회 API' })
  @ApiOkResponse({
    status: 200,
    description: '일기 조회 성공',
    type: FindRecordResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:recordId')
  async findById(
    @Param('recordId') recordId: string,
    @CurrentUser() user: TokenPayloadDto,
  ): Promise<any> {
    return await this.recordService.findById(user.userId, recordId);
  }
}
