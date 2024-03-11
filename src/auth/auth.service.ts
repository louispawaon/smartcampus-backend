import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import { Response as Res } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: AuthDto, res: Res) {
    const currentUser = signInDto;
    const { email, password, role } = await this.usersService.findByEmail(
      currentUser.email,
    );
    if (
      !currentUser ||
      !this.validatePassword(password, currentUser.password)
    ) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const payload = { email: email, role: role };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    console.log('accessToken', accessToken);

    res.set({
      'x-access-token': accessToken,
      'Access-Control-Expose-Headers': 'x-access-token',
    });

    return res.json({ email, role });
  }

  validatePassword(password: string, storedPassword: string): boolean {
    return password == storedPassword;
  }
}
