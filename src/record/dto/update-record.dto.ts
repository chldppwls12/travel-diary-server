import { Feeling, Weather } from '@prisma/client';

export class UpdateRecordDto {
  recordDate?: string;
  feeling?: Feeling;
  weather?: Weather;
  content?: string;
  cityId?: number;
  place?: string | null;
}
