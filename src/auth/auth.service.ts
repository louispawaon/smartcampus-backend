import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  //   async signIn(signInDto: AuthDto) {
  //     const currentUser = signInDto;
  //     const { email, password, role } = await this.usersService.findByEmail(
  //       currentUser.email,
  //     );
  //     if (
  //       !currentUser ||
  //       !this.validatePassword(password, currentUser.password)
  //     ) {
  //       throw new UnauthorizedException('Invalid email or password!');
  //     }

  //     // //Testing
  //     // switch (user.role) {
  //     //   case Role.STUDENT:
  //     //     return 'Welcome Student!';
  //     //   case Role.TEACHER:
  //     //     return 'Welcome Teacher';
  //     //   case Role.STAFF:
  //     //     return 'Welcome Staff';
  //     //   default:
  //     //     return 'Why are you here?';
  //     // }
  //   }

  //   validatePassword(password: string, storedPassword: string): boolean {
  //     return password == storedPassword;
  //   }
}
