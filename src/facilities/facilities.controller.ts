import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FacilitiesService } from './facilities.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Facility, Role } from '@prisma/client';
import { Roles } from 'src/auth/dto/role.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { FacilityDto } from './dto/facility.dto';

@ApiTags('Facilities')
@ApiBearerAuth('JWT')
@Controller('facilities')
export class FacilitiesController {
  constructor(private readonly facilityService: FacilitiesService) {}

  /*GET REQUESTS*/
  @ApiOperation({ summary: 'Get All Facilities' })
  @ApiResponse({ status: 200, description: 'Returns all facilities.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async getUsers() {
    try {
      return await this.facilityService.getAllFacilities();
    } catch (error) {
      console.error('Error fetching all facilities:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch all facilities');
    }
  }

  @ApiOperation({ summary: 'Get Facility Details by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Facility ID' })
  @ApiResponse({ status: 200, description: 'Returns the user details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get(':id')
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async getFacilityDetails(@Param('id') id: number) {
    try {
      return await this.facilityService.getFacilityDetails(id);
    } catch (error) {
      console.error('Error fetching facility details:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch facility details',
      );
    }
  }

  /*POST REQUESTS*/
  @ApiOperation({ summary: 'Create Facility' })
  @ApiBody({ type: FacilityDto, description: 'Create Facility Details' })
  @ApiResponse({ status: 200, description: 'Returns the facility details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBearerAuth() // Indicates that the API endpoint requires a bearer token
  @Post()
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async createFacility(@Body() facilityDto: FacilityDto) {
    try {
      return await this.facilityService.createFacility(facilityDto);
    } catch (error) {
      console.error('Error creating facility', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create facility');
    }
  }

  /*PATCH REQUESTS*/
  @ApiOperation({ summary: 'Update Facility Details by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Facility ID' })
  @ApiBody({ type: FacilityDto, description: 'Update facility details' })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated facility details.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Patch(':id')
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async updateFacilityDetails(
    @Param('id') id: number,
    @Body() updatedFields: Partial<Facility>,
  ): Promise<Facility> {
    try {
      return await this.facilityService.updateFacilityDetails(
        id,
        updatedFields,
      );
    } catch (error) {
      console.error('Error updating facility:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update facility details',
      );
    }
  }
}
