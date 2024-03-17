import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [ReservationsController],
  providers: [ReservationsService, AuthGuard, JwtService],
})
export class ReservationsModule {}
