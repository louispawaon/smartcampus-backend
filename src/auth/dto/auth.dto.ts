import { IsEmail, IsNotEmpty, IsIn, IsUUID } from 'class-validator';
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
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn([Role.STUDENT, Role.STAFF, Role.TEACHER])
  role: Role;

  @ApiProperty({ required: false })
  username: string;
}
