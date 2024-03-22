import {
  Body,
  Controller,
  Get,
  Param,
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
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/dto/role.dto';
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
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async getAllReservations(): Promise<Reservation[]> {
    return await this.reservationsService.getAllReservations();
  }

  @ApiOperation({ summary: 'Get Specific Reservation based on ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Reservation ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns reservation based on Reservation ID.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get(':id')
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async findReservation(@Param('id') id: string): Promise<Reservation> {
    return await this.reservationsService.findReservation(id);
  }

  @ApiOperation({ summary: 'Sort Reseravtions by Date' })
  @ApiResponse({
    status: 200,
    description: 'Returns sorted Reservations by Date.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('sortByDate')
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async sortReservationByDate(): Promise<Reservation[]> {
    return await this.reservationsService.sortReservationByDate();
  }

  @ApiOperation({ summary: 'Sort Reservations based on Facility' })
  @ApiParam({ name: 'id', type: 'number', description: 'Facility ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns sorted reservations based on facility',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('facility/:facilityId')
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async getReservationsByFacility(
    @Param('facilityId') facilityId: number,
  ): Promise<Reservation[]> {
    return await this.reservationsService.getReservationsByFacility(facilityId);
  }

  @ApiOperation({ summary: 'Sort User Reservations by Date' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns sorted reservations by date to the specific user',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('user/:userId/sortByDate')
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async sortUserReservationsByDate(@Param('userId') userId: string) {
    return await this.reservationsService.sortUserReservationsByDate(userId);
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
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async sortUserReservationsByFacility(
    @Param('userId') userId: string,
    @Param('facilityId') facilityId: number,
  ) {
    return await this.reservationsService.sortUserReservationsByFacility(
      userId,
      facilityId,
    );
  }

  /*POST REQUESTS*/
  @ApiOperation({ summary: 'Sort User Reservations by Facility' })
  @ApiBody({ type: ReservationsDto, description: 'Create Facility Details' })
  @ApiResponse({
    status: 200,
    description:
      'Returns sorted reservations based on facility to the specific user',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post()
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async createReservation(
    @Body() reservationDto: ReservationsDto,
  ): Promise<Reservation> {
    return await this.reservationsService.createReservation(reservationDto);
  }

  /*PATCH REQUESTS*/
  @ApiOperation({ summary: 'Confirm Reservation' })
  @ApiParam({ name: 'id', type: 'string', description: 'Reservation ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns confirmed reservation',
  })
  @Patch(':id/confirm')
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async confirmReservation(@Param('id') id: string) {
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
  }

  @ApiOperation({ summary: 'Cancel Reservation' })
  @ApiParam({ name: 'id', type: 'string', description: 'Reservation ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns cancelled reservation',
  })
  @Patch(':id/cancel')
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async cancelReservation(@Param('id') id: string) {
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
  }

  @ApiOperation({ summary: 'Change Reservation Status' })
  @ApiParam({ name: 'id', type: 'string', description: 'Reservation ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns new status of reservation',
  })
  @Patch(':id/status')
  @ApiHeader({
    name: 'x-access-token',
    description: 'Bearer token to authorize the request',
  })
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async changeReservationStatus(
    @Param('id') id: string,
    @Body('status') status: Status,
  ): Promise<Reservation | null> {
    return await this.reservationsService.changeReservationStatus(status, id);
  }
}
