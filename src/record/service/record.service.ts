import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRecordRequestDto } from '../dto/create-record-request.dto';
import { RecordRepository } from '../repository/record.repository';
import { FileRepository } from '../../file/repository/file.repository';
import { ErrMessage } from '../../common/enum/err-message';
import { IdResponseDto } from '../../common/dto/id-response.dto';

@Injectable()
export class RecordService {
  constructor(
    private recordRepository: RecordRepository,
    private fileRepository: FileRepository,
  ) {}
  async create(
    userId: string,
    requestDto: CreateRecordRequestDto,
  ): Promise<IdResponseDto> {
    // 파일 id 검증
    for (const mediaId of requestDto?.medias) {
      if (!(await this.fileRepository.isExist(mediaId))) {
        throw new BadRequestException(ErrMessage.INVALID_FILE_ID);
      }
    }

    if (
      requestDto?.voice &&
      !(await this.fileRepository.isExist(requestDto.voice))
    ) {
      throw new BadRequestException(ErrMessage.INVALID_FILE_ID);
    }

    const recordDate = new Date(requestDto.recordDate);
    const { feeling, weather, content, cityId } = requestDto;
    const place = requestDto?.place ? requestDto.place : undefined;

    if (!(await this.recordRepository.isExistCityId(cityId))) {
      throw new BadRequestException(ErrMessage.INVALID_PARAM);
    }

    return {
      id: await this.recordRepository.create({
        userId,
        recordDate,
        feeling,
        weather,
        content,
        cityId,
        place,
      }),
    };
  }
}
