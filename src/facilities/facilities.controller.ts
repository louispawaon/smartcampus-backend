import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FacilitiesService } from './facilities.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Facility, Role, User } from '@prisma/client';
import { Roles } from 'src/auth/dto/role.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { FacilityDto } from './dto/facility.dto';

@ApiTags('Facilities')
@Controller('facilities')
export class FacilitiesController {
  constructor(private readonly facilityService: FacilitiesService) {}

  /*GET REQUESTS*/
  @ApiOperation({ summary: 'Get All Facilities' })
  @ApiResponse({ status: 200, description: 'Returns all facilities.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  @ApiBearerAuth() // Indicates that the API endpoint requires a bearer token
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async getUsers() {
    return await this.facilityService.getAllFacilities();
  }

  @ApiOperation({ summary: 'Get Facility Details by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Facility ID' })
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
  async getFacilityDetails(@Param('id', ParseUUIDPipe) id: string) {
    return await this.facilityService.getFacilityDetails(id);
  }

  /*POST REQUESTS*/
  @ApiOperation({ summary: 'Create Facility' })
  @ApiBody({ type: FacilityDto, description: 'Create Facility Details' })
  @ApiResponse({ status: 200, description: 'Returns the facility details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBearerAuth() // Indicates that the API endpoint requires a bearer token
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Post()
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async createFacility(@Body() facilityDto: FacilityDto) {
    return await this.facilityService.createFacility(facilityDto);
  }

  /*PUT REQUESTS*/
  @ApiOperation({ summary: 'Update Facility Details by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Facility ID' })
  @ApiBody({ type: FacilityDto, description: 'Update user details' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated user details.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBearerAuth() // Indicates that the API endpoint requires a bearer token
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Put(':id')
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async updateFacilityDetails(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedFields: Partial<User>,
  ): Promise<Facility> {
    return await this.facilityService.updateFacilityDetails(id, updatedFields);
  }
}
