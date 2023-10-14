import { Feeling, Weather } from '@prisma/client';

export class CreateRecordDto {
  userId: string;
  recordDate: string;
  feeling: Feeling;
  weather: Weather;
  content: string;
  cityId: number;
  place: string | undefined;
}
