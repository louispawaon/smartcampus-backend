import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/dto/role.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersDto } from './dto/users.dto';

@ApiBearerAuth('JWT')
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /* TEST REQUESTS */
  @Get('staff')
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async staffOnlyEndpoint() {
    return 'Welcome staff!';
  }

  @Get('student')
  @Roles(Role.STUDENT, Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async studentOnlyEndpoint() {
    return 'Welcome student!';
  }

  @Get('teacher')
  @Roles(Role.TEACHER, Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async teacherOnlyEndpoint() {
    return 'Welcome teacher!';
  }

  /* GET REQUESTS */
  @ApiOperation({ summary: 'Get All Users' })
  @ApiResponse({ status: 200, description: 'Returns all users.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async getUsers() {
    try {
      return await this.userService.getAll();
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  @ApiOperation({ summary: 'Get User Details by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns the user details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get(':id')
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async getUserDetails(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.userService.getUserDetails(id);
    } catch (error) {
      console.error('Error fetching user details:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user details');
    }
  }

  @ApiOperation({ summary: 'Get User Details by Supabase User UID' })
  @ApiParam({
    name: 'supabaseId',
    type: 'string',
    description: 'Supabase User UID',
  })
  @ApiResponse({ status: 200, description: 'Returns the user details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('/supabase/:supabaseId')
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async getUserDetailsSupabase(
    @Param('supabaseId', ParseUUIDPipe) supabaseId: string,
  ) {
    try {
      return await this.userService.getUserDetailsSupabase(supabaseId);
    } catch (error) {
      console.error('Error fetching user details:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user details');
    }
  }

  /* PATCH REQUESTS */
  @ApiOperation({ summary: 'Update User Details by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiBody({ type: UsersDto, description: 'Update user details' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated user details.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Patch(':id')
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async updateUserDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedFields: Partial<User>,
  ): Promise<User> {
    try {
      return await this.userService.updateUserDetails(id, updatedFields);
    } catch (error) {
      console.error('Error updating user details:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user details');
    }
  }
}
