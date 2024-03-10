import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  extractUsername(email: string): string {
    return email.split('@')[0];
  }

  async createUser(signUpDto: AuthDto) {
    const { email, password, role } = signUpDto;
    const username = this.extractUsername(email);

    const user = await this.prisma.user.create({
      data: {
        email,
        password,
        role,
        username,
      },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
