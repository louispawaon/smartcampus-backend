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
import { Roles } from 'src/auth/dto/role.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  /*GET REQUESTS*/

  @Get()
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async getAllReservations(): Promise<Reservation[]> {
    return await this.reservationsService.getAllReservations();
  }

  @Get(':id')
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async findReservation(@Param('id') id: string): Promise<Reservation> {
    return await this.reservationsService.findReservation(id);
  }

  @Get('sortByDate')
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async sortReservationByDate(): Promise<Reservation[]> {
    return await this.reservationsService.sortReservationByDate();
  }

  @Get('facility/:facilityId')
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async getReservationsByFacility(
    @Param('facilityId') facilityId: number,
  ): Promise<Reservation[]> {
    return await this.reservationsService.getReservationsByFacility(facilityId);
  }

  @Get('user/:userId/sortByDate')
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async sortUserReservationsByDate(@Param('userId') userId: string) {
    return await this.reservationsService.sortUserReservationsByDate(userId);
  }

  @Get('user/:userId/facility/:facilityId')
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

  @Post()
  @Roles(Role.STAFF, Role.STUDENT, Role.TEACHER)
  @UseGuards(AuthGuard, RoleGuard)
  async createReservation(
    @Body() reservationDto: ReservationsDto,
  ): Promise<Reservation> {
    return await this.reservationsService.createReservation(reservationDto);
  }

  /*PATCH REQUESTS*/
  @Patch(':id/confirm')
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

  @Patch(':id/cancel')
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

  @Patch(':id/status')
  @Roles(Role.STAFF)
  @UseGuards(AuthGuard, RoleGuard)
  async changeReservationStatus(
    @Param('id') id: string,
    @Body('status') status: Status,
  ): Promise<Reservation | null> {
    return await this.reservationsService.changeReservationStatus(status, id);
  }
}
