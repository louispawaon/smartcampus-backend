import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    FacilitiesModule,
    ReservationsModule,
    ScheduleModule.forRoot(),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
