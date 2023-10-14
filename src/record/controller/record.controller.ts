import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import { UpdateRecordRequestDto } from '../dto/update-record-request.dto';

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
  ): Promise<FindRecordResponseDto> {
    return await this.recordService.findById(user.userId, recordId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '일기 수정 API' })
  @ApiOkResponse({
    status: 200,
    description: '일기 수정 성공',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('/:recordId')
  async update(
    @Param('recordId') recordId: string,
    @CurrentUser() user: TokenPayloadDto,
    @Body() updateRecordRequestDto: UpdateRecordRequestDto,
  ): Promise<void> {
    return await this.recordService.update(
      user.userId,
      recordId,
      updateRecordRequestDto,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '일기 삭제 API' })
  @ApiOkResponse({
    status: 204,
    description: '일기 삭제 성공',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete('/:recordId')
  async delete(
    @Param('recordId') recordId: string,
    @CurrentUser() user: TokenPayloadDto,
  ) {
    return await this.recordService.delete(user.userId, recordId);
  }
}
