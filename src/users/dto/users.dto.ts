import { IsEmail, IsNotEmpty, IsIn, IsUUID } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UsersDto {
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

  @ApiProperty({ required: false })
  fullName: string;

  @ApiProperty({ required: false })
  idNum: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn([Role.STUDENT, Role.STAFF, Role.TEACHER])
  role: Role;

  @ApiProperty()
  @IsNotEmpty()
  username: string;
}
