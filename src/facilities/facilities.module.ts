import { Module } from '@nestjs/common';
import { FacilitiesController } from './facilities.controller';
import { FacilitiesService } from './facilities.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [FacilitiesController],
  providers: [FacilitiesService, AuthGuard, JwtService],
})
export class FacilitiesModule {}
