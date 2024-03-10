import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';
import { Role } from '@prisma/client';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsIn([Role.STUDENT, Role.STAFF, Role.TEACHER])
  role: Role;

  @IsNotEmpty()
  username: string;
}
