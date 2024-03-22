import { Module } from '@nestjs/common';
import { PingService } from './ping.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  providers: [PingService],
})
export class PingModule {}
