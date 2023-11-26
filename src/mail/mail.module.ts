import { Module } from '@nestjs/common';
import { MailService } from '@/mail/service/mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
