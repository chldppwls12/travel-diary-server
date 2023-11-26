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
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateRecordRequestDto } from '@/record/dto/create-record-request.dto';
import { RecordService } from '@/record/service/record.service';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorator/current-user.decorator';
import { TokenPayloadDto } from '@/auth/dto/token-payload.dto';
import { IdResponseDto } from '@/common/dto/id-response.dto';
import { FindRecordResponseDto } from '@/record/dto/find-record-response.dto';
import { UpdateRecordRequestDto } from '@/record/dto/update-record-request.dto';
import { FindMapQueryDto } from '@/record/dto/find-map-query.dto';
import { IsExistDateQueryDto } from '@/record/dto/is-exist-date-query.dto';
import { FindCalanderQueryDto } from '@/record/dto/find-calander-query.dto';
import { FindCalendarResponseDto } from '@/record/dto/find-calendar-response.dto';
import { FullMapResponseDto } from '@/record/dto/map/full-map-response.dto';
import { GroupCityMapResponseDto } from '@/record/dto/map/group-city-map-response.dto';
import { ProvinceMapResponseDto } from '@/record/dto/map/province-map-response.dto';

@ApiTags('records')
@Controller('records')
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
  @ApiOperation({ summary: 'recordDate 유효 여부 API' })
  @ApiOkResponse({
    status: 200,
    description: 'recordDate 유효 여부 성공',
  })
  @ApiConflictResponse({
    status: 409,
    description: '이미 일기 존재',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/exists')
  async isExistRecordDate(
    @Query() queryDto: IsExistDateQueryDto,
    @CurrentUser() user: TokenPayloadDto,
  ): Promise<void> {
    return await this.recordService.isExistRecordDate(
      user.userId,
      queryDto.recordDate,
    );
  }

  @ApiExtraModels(
    FullMapResponseDto,
    ProvinceMapResponseDto,
    GroupCityMapResponseDto,
  )
  @ApiBearerAuth()
  @ApiOperation({ summary: '일기 지도 형식 조회 API' })
  @ApiOkResponse({
    status: 200,
    description: '일기 지도 형식 조회 성공',
    schema: {
      type: 'object',
      properties: {
        data: {
          oneOf: [
            {
              $ref: getSchemaPath(FullMapResponseDto),
            },
            {
              $ref: getSchemaPath(ProvinceMapResponseDto),
            },
            {
              $ref: getSchemaPath(GroupCityMapResponseDto),
            },
          ],
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('/map')
  async findAllWithMap(
    @Query() queryDto: FindMapQueryDto,
    @CurrentUser() user: TokenPayloadDto,
  ): Promise<{
    data:
      | FullMapResponseDto[]
      | ProvinceMapResponseDto[]
      | GroupCityMapResponseDto[];
  }> {
    // TODO: 변경 필요
    if (queryDto?.provinceId) {
      queryDto.provinceId = +queryDto.provinceId;
    }
    if (queryDto?.groupId) {
      queryDto.groupId = +queryDto.groupId;
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
  @ApiOperation({ summary: '일기 캘린더 형식 조회 API' })
  @ApiOkResponse({
    status: 200,
    description: '일기 캘린더 형식 조회 성공',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/calendar')
  async findCalendar(
    @Query() queryDto: FindCalanderQueryDto,
    @CurrentUser() user: TokenPayloadDto,
  ): Promise<{ data: FindCalendarResponseDto[] }> {
    return this.recordService.findCalendar(user.userId, queryDto);
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
