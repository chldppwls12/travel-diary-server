import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRecordRequestDto } from '../dto/create-record-request.dto';
import { RecordRepository } from '../repository/record.repository';
import { FileRepository } from '../../file/repository/file.repository';
import { ErrMessage } from '../../common/enum/err-message';
import { IdResponseDto } from '../../common/dto/id-response.dto';
import { FindRecordResponseDto } from '../dto/find-record-response.dto';
import { City, FileType, Record } from '@prisma/client';
import { RecordMediaResponseDto } from '../dto/record-media-response.dto';
import { RecordVoiceResponseDto } from '../dto/record-voice-response.dto';
import { UpdateRecordRequestDto } from '../dto/update-record-request.dto';
import { FullMapResponseDto } from '../dto/map/full-map-response.dto';
import { FindMapQueryDto } from '../dto/find-map-query.dto';
import { CityMapResponseDto } from '../dto/map/city-map-response.dto';
import { LastImageResponseDto } from '../dto/map/last-image-response.dto';

@Injectable()
export class RecordService {
  constructor(
    private recordRepository: RecordRepository,
    private fileRepository: FileRepository,
  ) {}

  // medias(image, video file) 검증
  async validateMediaFiles(mediaIds: string[]): Promise<void> {
    for (const mediaId of mediaIds) {
      if (!(await this.fileRepository.isExist(mediaId))) {
        throw new BadRequestException(ErrMessage.INVALID_FILE_ID);
      }
    }
  }

  // voice file 검증
  async validateVoiceFile(fileId: string): Promise<void> {
    if (!(await this.fileRepository.isExist(fileId))) {
      throw new BadRequestException(ErrMessage.INVALID_FILE_ID);
    }
  }

  async validateCityId(cityId: number): Promise<void> {
    if (!(await this.recordRepository.isExistCityId(cityId))) {
      throw new BadRequestException(ErrMessage.INVALID_CITY_ID);
    }
  }

  async isExist(recordId: string): Promise<void> {
    if (!(await this.recordRepository.isExist(recordId))) {
      throw new BadRequestException(ErrMessage.INVALID_RECORD_ID);
    }
  }

  async isAuthor(userId: string, recordId: string): Promise<void> {
    if (!(await this.recordRepository.isUserRecord(userId, recordId))) {
      throw new UnauthorizedException(ErrMessage.UNAUTHORIZED);
    }
  }

  async findProvinceIdByCityId(cityId: number): Promise<number> {
    const provinceId = await this.recordRepository.findProvinceIdByCityId(
      cityId,
    );
    if (!provinceId) {
      throw new BadRequestException(ErrMessage.INVALID_PARAM);
    }

    return provinceId;
  }

  async create(
    userId: string,
    requestDto: CreateRecordRequestDto,
  ): Promise<IdResponseDto> {
    if (requestDto?.medias) {
      await this.validateMediaFiles(requestDto.medias);
    }

    if (requestDto?.voice) {
      await this.validateVoiceFile(requestDto.voice);
    }

    const recordDate = new Date(requestDto.recordDate);
    const { feeling, weather, content, cityId } = requestDto;
    const place = requestDto?.place ? requestDto.place : undefined;

    const provinceId = await this.findProvinceIdByCityId(cityId);

    const createdRecordId = await this.recordRepository.create({
      userId,
      recordDate,
      feeling,
      weather,
      content,
      cityId,
      place,
      provinceId,
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
    await this.isExist(recordId);
    await this.isAuthor(userId, recordId);

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

  async update(
    userId: string,
    recordId: string,
    requestDto: UpdateRecordRequestDto,
  ): Promise<void> {
    await this.isExist(recordId);
    await this.isAuthor(userId, recordId);

    let provinceId = undefined;

    if (requestDto?.medias) {
      await this.validateMediaFiles(requestDto.medias);
      for (const mediaId of requestDto.medias) {
        await this.recordRepository.deleteRecordFile(recordId, mediaId);
      }
      delete requestDto.medias;
    }
    if (requestDto?.voice) {
      await this.validateVoiceFile(requestDto.voice);
      await this.recordRepository.deleteRecordFile(recordId, requestDto.voice);
      delete requestDto.voice;
    }
    if (requestDto?.cityId) {
      provinceId = await this.findProvinceIdByCityId(requestDto.cityId);
    }

    await this.recordRepository.update(recordId, requestDto, provinceId);
  }

  async delete(userId: string, recordId: string): Promise<void> {
    await this.isExist(recordId);
    await this.isAuthor(userId, recordId);

    await this.recordRepository.delete(recordId);
  }

  async findAllWithMap(
    userId: string,
    queryDto: FindMapQueryDto,
  ): Promise<any> {
    // 전체 지도 조회 -> 각각의 province마다 최근 작성 글 1개 씩
    if (!queryDto?.provinceId && !queryDto?.groupId && !queryDto?.cityId) {
      return await this.findFullMap(userId);
    }

    // TODO: provinceId 넣었을 때 특정 위치 조회 -> 각각의 group마다 최근 작성 글 1개 씩
    if (queryDto.provinceId) {
      const groupIds = (
        await this.recordRepository.findGroupsByProvinceId(queryDto.provinceId)
      ).map((group) => group.groupId);

      for (const groupId of groupIds) {
        // TODO: 각각의 group마다 실행하기
        await this.findMapByProvince(userId, groupId);
      }
    }

    // groupId 넣었을 때 특정 위치 조회 -> 각각의 city마다 최근 작성 글 1개 씩
    if (queryDto.groupId) {
      // groupId에 해당하는 cityId 가져오기
      const cities = await this.recordRepository.findCitiesByGroupId(
        queryDto.groupId,
      );
      return await this.findMapByGroup(
        userId,
        cities.map((city) => city.id),
      );
    }

    // TODO: cityId 넣었을 때 특정 위치 조회 -> 해당 city의 모든 게시글 (페이지네이션)
    if (queryDto.cityId) {
      if (!queryDto?.page || !queryDto?.offset) {
        throw new BadRequestException(ErrMessage.INVALID_PARAM);
      }
      return await this.findMapByCity(
        userId,
        queryDto.cityId,
        queryDto.page,
        queryDto.offset,
      );
    }
  }

  async findFullMap(userId: string): Promise<{ data: FullMapResponseDto[] }> {
    const records = await this.recordRepository.findFullMap(userId);

    const data: FullMapResponseDto[] = [];
    for (const record of records) {
      data.push({
        id: record.id,
        image: await this.findRecordThumbnail(record.id),
        provinceId: record.provinceId,
      });
    }

    return {
      data,
    };
  }

  async findMapByProvince(userId: string, provinceId: number) {
    const records = await this.recordRepository.findMapByProvince(
      userId,
      provinceId,
    );
  }

  async findMapByGroup(
    userId: string,
    cityIds: number[],
  ): Promise<{ data: CityMapResponseDto[] }> {
    const records = await this.recordRepository.findAllByCityIds(
      userId,
      cityIds,
    );

    const data: CityMapResponseDto[] = [];
    for (const record of records) {
      data.push({
        id: record.id,
        image: await this.findRecordThumbnail(record.id),
        cityId: record.cityId,
      });
    }

    return {
      data,
    };
  }

  // TODO: 동영상일 때 생각 필요
  async findRecordThumbnail(
    recordId: string,
  ): Promise<LastImageResponseDto | null> {
    const firstImageId = await this.recordRepository.findFirstImageId(recordId);

    let image = null;
    if (firstImageId) {
      const imageInfo = await this.fileRepository.findById(firstImageId);
      if (imageInfo) {
        image = {
          originName: imageInfo?.originalName,
          uploadedLink: imageInfo?.uploadedLink,
          shortLink: imageInfo?.shortLink,
        };
      }
    }

    return image;
  }

  async findMapByCity(
    userId: string,
    cityId: number,
    page: number,
    offset: number,
  ): Promise<{ data: CityMapResponseDto[] }> {
    const records = await this.recordRepository.findAllbyCityId(
      userId,
      cityId,
      page,
      offset,
    );

    const data: CityMapResponseDto[] = [];
    for (const record of records) {
      data.push({
        id: record.id,
        image: await this.findRecordThumbnail(record.id),
        cityId: record.cityId,
      });
    }

    return {
      data,
    };
  }

  async isExistRecordDate(userId: string, recordDate: string): Promise<void> {
    if (await this.recordRepository.isExistRecordDate(userId, recordDate)) {
      throw new ConflictException(ErrMessage.ALREADY_EXISTS_DATE);
    }
  }
}
