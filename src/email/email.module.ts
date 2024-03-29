import { Module } from '@nestjs/common';
import { EmailSender } from './emailSender';

@Module({
  exports: [EmailSender],
  providers: [EmailSender],
})
export class EmailModule {}
