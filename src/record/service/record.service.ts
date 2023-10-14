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
import { FindRecordResponseDto } from '../dto/find-record-response.dto';
import { FileType } from '@prisma/client';
import { RecordMediaResponseDto } from '../dto/record-media-response.dto';
import { RecordVoiceResponseDto } from '../dto/record-voice-response.dto';

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

    const createdRecordId = await this.recordRepository.create({
      userId,
      recordDate,
      feeling,
      weather,
      content,
      cityId,
      place,
    });

    // medias -> 사진, 비디오 추가
    for (const [order, mediaId] of requestDto?.medias.entries()) {
      const fileType = await this.fileRepository.checkFileTypeById(mediaId);
      // TODO: transaction 필요
      if (!fileType) {
        throw new BadRequestException(ErrMessage.INVALID_PARAM);
      }

      if (fileType === FileType.IMAGE) {
        await this.recordRepository.createRecordFileWithImage(
          createdRecordId,
          mediaId,
          order + 1,
        );
      } else if (fileType === FileType.VIDEO) {
        await this.recordRepository.createRecordFileWithVideo(
          createdRecordId,
          mediaId,
        );
      } else if (fileType === FileType.VOICE) {
        throw new BadRequestException(ErrMessage.INVALID_PARAM);
      }
    }

    // voice -> 음성 추가
    await this.recordRepository.createRecordFileWithVoice(
      createdRecordId,
      requestDto.voice,
    );

    return {
      id: createdRecordId,
    };
  }
  async findById(
    userId: string,
    recordId: string,
  ): Promise<FindRecordResponseDto> {
    if (!(await this.recordRepository.isUserRecord(userId, recordId))) {
      throw new UnauthorizedException(ErrMessage.UNAUTHORIZED);
    }
    const record = await this.recordRepository.findById(recordId);

    let voice: RecordVoiceResponseDto = null;
    let medias: RecordMediaResponseDto[] = [];
    const mediaOrders: number[] = [];

    for (const file of record.files) {
      const fileInfo = await this.fileRepository.findById(file.fileId);
      if (file.type === FileType.VOICE) {
        voice = {
          id: file.fileId,
          originName: fileInfo.originalName,
          uploadedLink: fileInfo.uploadedLink,
          shortLink: fileInfo.shortLink,
        };
      } else {
        medias.push({
          id: file.fileId,
          type: file.type,
          originName: fileInfo.originalName,
          uploadedLink: fileInfo.uploadedLink,
          shortLink: fileInfo.shortLink,
          // TODO: 변경 필요
          // thumbnailLink: fileInfo.thumbnailLink,
          // thumbnailShortLink: fileInfo.thumbnailShortLink,
          thumbnailLink: 'temp',
          thumbnailShortLink: 'temp',
        });

        mediaOrders.push(file.order);
      }
    }

    medias = mediaOrders
      .map((order, index) => ({ order, index }))
      .sort((a, b) => a.order - b.order)
      .map(({ index }) => medias[index]);

    return {
      id: record.id,
      date: record.recordDate,
      feeling: record.feeling,
      weather: record.weather,
      content: record.content,
      medias,
      createdAt: record.createdAt,
      cityId: record.cityId,
      voice,
      place: record?.place,
    };
  }
}
