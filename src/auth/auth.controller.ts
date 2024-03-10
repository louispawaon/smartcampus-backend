import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: AuthDto) {
    return this.userService.createUser(signUpDto);
  }

  //   @Post('sign-in')
  //   async signIn(@Body() signInDto: AuthDto) {
  //     return

  //   }
}
