import { Controller, Post, Body, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: AuthDto) {
    return this.userService.createUser(signUpDto);
  }

  @Post('sign-in')
  async signIn(@Body() loginDto: AuthDto, @Res() res: Response) {
    console.log(loginDto);
    const result = await this.authService.signIn(loginDto, res);
    return result;
  }
}
