import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
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

  @Post()
  async signIn(@Body() authDto: AuthDto, @Res() res: Response) {
    try {
      const result = await this.authService.signIn(authDto, res);
      return result;
    } catch (error) {
      if (error.message === 'Invalid email or password!') {
        await this.userService.createUser(authDto);
        return this.signIn(authDto, res);
      } else if (error.message === 'Invalid role!') {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Invalid Role!',
          error: 'Unauthorized',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Invalid email or password!',
          error: 'Unauthorized',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }
    }
  }
}
