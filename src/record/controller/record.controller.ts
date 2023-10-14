import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorator/current-user.decorator';
import { TokenPayloadDto } from '../../auth/dto/token-payload.dto';
import { IdResponseDto } from '../../common/dto/id-response.dto';
import { FindRecordResponseDto } from '../dto/find-record-response.dto';
import { UpdateRecordRequestDto } from '../dto/update-record-request.dto';
import { FullMapResponseDto } from '../dto/map/full-map-response.dto';
import { FindMapQueryDto } from '../dto/find-map-query.dto';
import { CityMapResponseDto } from '../dto/map/city-map-response.dto';

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
  @ApiOperation({ summary: '일기 지도 형식 조회 API' })
  @ApiOkResponse({
    status: 200,
    description: '일기 지도 형식 조회 성공',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/map')
  async findAllWithMap(
    @Query() queryDto: FindMapQueryDto,
    @CurrentUser() user: TokenPayloadDto,
  ): Promise<any> {
    // TODO: 변경 필요
    if (queryDto?.groupId) {
      queryDto.groupId = +queryDto.groupId;
    }
    if (queryDto?.provinceId) {
      queryDto.provinceId = +queryDto.provinceId;
    }
    if (queryDto?.cityId) {
      queryDto.cityId = +queryDto.cityId;
    }
    if (queryDto?.offset) {
      queryDto.offset = +queryDto.offset;
    }
    if (queryDto?.page) {
      queryDto.page = +queryDto.page;
    }
    return await this.recordService.findAllWithMap(user.userId, queryDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '일기 상세 조회 API' })
  @ApiOkResponse({
    status: 200,
    description: '일기 상세 조회 성공',
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
  ): Promise<void> {
    return await this.recordService.delete(user.userId, recordId);
  }
}
