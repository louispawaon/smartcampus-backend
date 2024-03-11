import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard, JwtService],
})
export class UsersModule {}
