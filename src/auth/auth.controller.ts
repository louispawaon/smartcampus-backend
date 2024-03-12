import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary:
      'Signs in existing users, creates an account and signs in if no existing account',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful sign-in' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials or role',
  })
  @Post()
  async signIn(@Body() authDto: AuthDto, @Res() res: Response) {
    try {
      const result = await this.authService.signIn(authDto, res);
      return result;
    } catch (error) {
      console.log(error);
      if (error.message === 'Invalid email or password!') {
        await this.userService.createUser(authDto);
        return this.authService.signIn(authDto, res);
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
