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
    const { supabaseId, email, password, role } = signUpDto;
    const username = this.extractUsername(email);

    const user = await this.prisma.user.create({
      data: {
        supabaseId,
        email,
        password,
        role,
        username,
      },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getAll() {
    return await this.prisma.user.findMany();
  }

  async getUserDetails(id: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          Feedback: true,
          Reservation: true,
        },
      });
      return user;
    } catch (error) {
      console.error('Error retrieving user details:', error);
      throw error;
    }
  }

  async updateUserDetails(
    id: string,
    updatedFields: Partial<User>,
  ): Promise<User | null> {
    return await this.prisma.user.update({
      where: { id },
      data: updatedFields,
    });
  }
}
