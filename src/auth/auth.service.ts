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
    console.log(signInDto);

    const { email, password, role } = signInDto;
    const user = await this.usersService.findByEmail(email);

    if (!user || !this.validatePassword(password, user.password)) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const payload = { email: user.email, role: user.role };
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
