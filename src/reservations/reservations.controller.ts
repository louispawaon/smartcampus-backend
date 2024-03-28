import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsDto } from './dto/reservations.dto';
import { Status, Reservation, Role } from '@prisma/client';
import { RoleGuard } from 'src/auth/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/dto/role.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
@ApiTags('Reservations')
@ApiBearerAuth('JWT')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  /*GET REQUESTS*/
  @ApiOperation({ summary: 'Get All Reservations' })
  @ApiResponse({ status: 200, description: 'Returns all reservations.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async getAllReservations(): Promise<Reservation[]> {
    try {
      return await this.reservationsService.getAllReservations();
    } catch (error) {
      console.error('Error fetching all reseravtions:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch all reseravtions',
      );
    }
  }

  @ApiOperation({ summary: 'Get Specific Reservation based on ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Reservation ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns reservation based on Reservation ID.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get(':id')
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async findReservation(@Param('id') id: string): Promise<Reservation> {
    try {
      return await this.reservationsService.findReservation(id);
    } catch (error) {
      console.error('Error fetching reservation details:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch reservation details',
      );
    }
  }

  @ApiOperation({ summary: 'Sort Reseravtions by Date' })
  @ApiResponse({
    status: 200,
    description: 'Returns sorted Reservations by Date.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('sortByDate')
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async sortReservationByDate(): Promise<Reservation[]> {
    try {
      return await this.reservationsService.sortReservationByDate();
    } catch (error) {
      console.error('Error fetching sorted facilities by date:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch sorted facilities by date',
      );
    }
  }

  @ApiOperation({ summary: 'Sort Reservations based on Facility' })
  @ApiParam({ name: 'id', type: 'number', description: 'Facility ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns sorted reservations based on facility',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('facility/:facilityId')
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async getReservationsByFacility(
    @Param('facilityId') facilityId: number,
  ): Promise<Reservation[]> {
    try {
      return await this.reservationsService.getReservationsByFacility(
        facilityId,
      );
    } catch (error) {
      console.error('Error fetching sorted reserations by facility:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch sorted reservations by facility',
      );
    }
  }

  @ApiOperation({ summary: 'Sort User Reservations by Date' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns sorted reservations by date to the specific user',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('user/:userId/sortByDate')
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async sortUserReservationsByDate(@Param('userId') userId: string) {
    try {
      return await this.reservationsService.sortUserReservationsByDate(userId);
    } catch (error) {
      console.error('Error fetching user reservations by date:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch user reservations by date',
      );
    }
  }

  @ApiOperation({ summary: 'Sort User Reservations by Facility' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Facility ID' })
  @ApiResponse({
    status: 200,
    description:
      'Returns sorted reservations based on facility to the specific user',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('user/:userId/facility/:facilityId')
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async sortUserReservationsByFacility(
    @Param('userId') userId: string,
    @Param('facilityId') facilityId: number,
  ) {
    try {
      return await this.reservationsService.sortUserReservationsByFacility(
        userId,
        facilityId,
      );
    } catch (error) {
      console.error('Error fetching user reservations by facility:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch user reservations by facility',
      );
    }
  }

  /*POST REQUESTS*/
  @ApiOperation({ summary: 'Create Reservation' })
  @ApiBody({ type: ReservationsDto, description: 'Create Facility Details' })
  @ApiResponse({
    status: 200,
    description: 'Returns created reservation',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post()
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async createReservation(
    @Body() reservationDto: ReservationsDto,
  ): Promise<Reservation> {
    try {
      return await this.reservationsService.createReservation(reservationDto);
    } catch (error) {
      console.error('Error creating reservation:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create reservation');
    }
  }

  /*PATCH REQUESTS*/

  @ApiOperation({ summary: 'Update Reservation' })
  @ApiBody({
    type: UpdateReservationDto,
    description: 'Edit Reservation Details',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns updated reservation',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Patch(':id')
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async updateReservation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() reservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    try {
      return await this.reservationsService.updateReservationDetails(
        id,
        reservationDto,
      );
    } catch (error) {
      console.error('Error updating reservation:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update reservation');
    }
  }

  @ApiOperation({ summary: 'Confirm Reservation' })
  @ApiParam({ name: 'id', type: 'string', description: 'Reservation ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns confirmed reservation',
  })
  @Patch(':id/confirm')
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async confirmReservation(@Param('id') id: string) {
    try {
      const confirmedReservation =
        await this.reservationsService.confirmReservation(id);
      if (confirmedReservation) {
        return {
          message: 'Reservation confirmed successfully',
          reservation: confirmedReservation,
        };
      } else {
        return { message: 'Reservation not found' };
      }
    } catch (error) {
      console.error('Error confirming reservation:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to confirm reservation');
    }
  }

  @ApiOperation({ summary: 'Cancel Reservation' })
  @ApiParam({ name: 'id', type: 'string', description: 'Reservation ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns cancelled reservation',
  })
  @Patch(':id/cancel')
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async cancelReservation(@Param('id') id: string) {
    try {
      const cancelledReservation =
        await this.reservationsService.cancelReservation(id);
      if (cancelledReservation) {
        return {
          message: 'Reservation cancelled successfully',
          reservation: cancelledReservation,
        };
      } else {
        return { message: 'Reservation not found' };
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to cancel reservation');
    }
  }

  @ApiOperation({ summary: 'Change Reservation Status' })
  @ApiParam({ name: 'id', type: 'string', description: 'Reservation ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns new status of reservation',
  })
  @Patch(':id/status')
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async changeReservationStatus(
    @Param('id') id: string,
    @Body('status') status: Status,
  ): Promise<Reservation | null> {
    try {
      return await this.reservationsService.changeReservationStatus(status, id);
    } catch (error) {
      console.error('Error changing reservation status:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to change reservation status',
      );
    }
  }
}
