import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PingService {
  constructor(private readonly httpService: HttpService) {}

  @Cron('0 */10 * * * *')
  async ping(): Promise<void> {
    try {
      await this.httpService.get('https://smartcampus-backend.onrender.com/');
      console.log('Ping successful!');
    } catch (error) {
      console.log('Ping failed!', error);
    }
  }
}
