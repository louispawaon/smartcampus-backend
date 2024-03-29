import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  ValidationPipe,
  HttpException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UsersDto } from 'src/users/dto/users.dto';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Signs in Existing Users',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful sign-in' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials or role',
  })
  @Post('/sign-in')
  async signIn(@Body(ValidationPipe) authDto: AuthDto, @Res() res: Response) {
    try {
      const result = await this.authService.signIn(authDto, res);
      return result;
    } catch (error) {
      console.log(error);
      if (error.message === 'Invalid email or password!') {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Invalid email or password!',
          error: 'Unauthorized',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      } else if (error.message === 'Invalid role!') {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Invalid Role!',
          error: 'Unauthorized',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Internal Server Error',
          error: 'InternalServerError',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  @ApiOperation({
    summary: 'Signs Up User',
  })
  @ApiBody({ type: CreateUserDto, description: 'Create User Details' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful sign-up' })
  @Post('/sign-up')
  async signUp(@Body(ValidationPipe) userDto: UsersDto) {
    try {
      return await this.userService.createUser(userDto);
    } catch (error) {
      console.error('Error during user sign-up:', error);
      if (error instanceof HttpException) {
        throw error; // Rethrow HTTP exceptions
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
