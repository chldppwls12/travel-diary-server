import { PartialType } from '@nestjs/swagger';
import { CreateRecordRequestDto } from '@/record/dto/create-record-request.dto';

export class UpdateRecordRequestDto extends PartialType(
  CreateRecordRequestDto,
) {}
