import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
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
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthDto } from 'src/auth/dto/auth.dto';

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
  @ApiBearerAuth() // Indicates that the API endpoint requires a bearer token
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Get()
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async getUsers() {
    return await this.userService.getAll();
  }

  @ApiOperation({ summary: 'Get User Details by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns the user details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get(':id')
  @ApiBearerAuth() // Indicates that the API endpoint requires a bearer token
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async getUserDetails(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.getUserDetails(id);
  }

  @ApiOperation({ summary: 'Get User Details by Supabase User UID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Supabase User UID' })
  @ApiResponse({ status: 200, description: 'Returns the user details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('/supabase/:supabaseId')
  @ApiBearerAuth() // Indicates that the API endpoint requires a bearer token
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async getUserDetailsSupabase(
    @Param('supabaseId', ParseUUIDPipe) supabaseId: string,
  ) {
    return await this.userService.getUserDetailsSupabase(supabaseId);
  }

  /* PUT REQUESTS */
  @ApiOperation({ summary: 'Update User Details by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiBody({ type: AuthDto, description: 'Update user details' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated user details.',
  })
  @ApiBearerAuth() // Indicates that the API endpoint requires a bearer token
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Put(':id')
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async updateUserDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedFields: Partial<User>,
  ): Promise<User> {
    return await this.userService.updateUserDetails(id, updatedFields);
  }
}
