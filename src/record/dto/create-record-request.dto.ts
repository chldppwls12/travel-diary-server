import { Feeling, Weather } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRecordRequestDto {
  @ApiProperty({
    description: '기록 일자',
  })
  @IsISO8601()
  recordDate: string;

  @ApiProperty({
    description: '감정',
    enum: Feeling,
  })
  @IsEnum(Feeling)
  feeling: Feeling;

  @ApiProperty({
    description: '날씨',
    enum: Weather,
  })
  @IsEnum(Weather)
  weather: Weather;

  @ApiProperty({
    description: '내용',
  })
  @IsString()
  content: string;

  @ApiProperty({
    required: false,
    description: '업로드한 이미지 or 비디오 id',
  })
  @IsArray()
  medias: string[] | [];

  @ApiProperty({
    required: false,
    description: '업로드한 음성 id',
  })
  @IsString()
  @IsOptional()
  voice: string | null;

  @ApiProperty({
    description: '지역 id',
  })
  @IsNumber()
  cityId: number;

  @ApiProperty({
    required: false,
    description: '기타 지역명',
  })
  @IsString()
  @IsOptional()
  place: string | null;
}
