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

    const { supabaseId, email, password, role } = signInDto;
    const user = await this.usersService.findByEmail(email);
    const userId = user.id;

    if (!user || !this.validatePassword(password, user.password)) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    if (user.role !== role) {
      throw new UnauthorizedException('Invalid role!');
    }

    const payload = {
      email: user.email,
      role: user.role,
      supabaseId: supabaseId,
      userId: user.id,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    console.log('accessToken', accessToken);

    res.set({
      'x-access-token': accessToken,
      'Access-Control-Expose-Headers': 'x-access-token',
    });
    console.log(userId, email, role, supabaseId);
    return res.json({ userId, email, role, supabaseId });
  }

  validatePassword(password: string, storedPassword: string): boolean {
    return password == storedPassword;
  }
}
