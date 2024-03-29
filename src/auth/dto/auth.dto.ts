import { IsEmail, IsNotEmpty, IsIn, IsUUID } from 'class-validator';
import { IsMCMEmail } from 'src/validators/isMCMEmail';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  supabaseId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsMCMEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn([Role.STUDENT, Role.STAFF, Role.TEACHER])
  role: Role;
}
