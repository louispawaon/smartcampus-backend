import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReservationsDto } from './dto/reservations.dto';
import { Reservation, Status } from '@prisma/client';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  /* STATUS CHECKER SERVICE */
  @Cron('0 */5 * * * *')
  async checkReservationStatus() {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
    });

    const now = new Date().getTime();
    const phOffset = 8 * 60 * 60 * 1000;
    const nowWithPHTime = new Date(now + phOffset);

    const expiredReservations = reservations.filter(
      (reservation) => reservation.endDate <= nowWithPHTime,
    );

    for (const reservation of expiredReservations) {
      await this.prisma.reservation.update({
        where: { id: reservation.id },
        data: { status: 'FINISHED' },
      });
    }

    console.log('FINISHED EVENTS: ', expiredReservations);
  }

  async createReservation(
    reservationDto: ReservationsDto,
  ): Promise<Reservation> {
    const {
      fullName,
      idNum,
      userId,
      facilityId,
      department,
      purpose,
      startDate,
      endDate,
      status,
      equipments,
      equipmentQty,
    } = reservationDto;

    const userWithNull = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { fullName: true, idNum: true },
    });

    if (!userWithNull.fullName && !userWithNull.idNum) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          fullName: fullName,
          idNum: idNum,
        },
      });
    }

    return await this.prisma.reservation.create({
      data: {
        userId,
        facilityId,
        department,
        purpose,
        startDate,
        endDate,
        status,
        equipments,
        equipmentQty,
      },
    });
  }

  async getAllReservations() {
    return await this.prisma.reservation.findMany();
  }

  async findReservation(id: string): Promise<Reservation> {
    return await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        facility: true,
        user: true,
      },
    });
  }

  async changeReservationStatus(
    status: Status,
    id: string,
  ): Promise<Reservation | null> {
    return await this.prisma.reservation.update({
      where: { id },
      data: {
        status: status,
      },
    });
  }

  async sortReservationByDate() {
    return await this.prisma.reservation.findMany({
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async getReservationsByFacility(facilityId: number) {
    return await this.prisma.reservation.findMany({
      where: {
        facilityId: facilityId,
      },
    });
  }

  async confirmReservation(id: string): Promise<Reservation | null> {
    return await this.prisma.reservation.update({
      where: { id },
      data: { status: Status.CONFIRMED },
    });
  }

  async cancelReservation(id: string): Promise<Reservation | null> {
    return await this.prisma.reservation.update({
      where: { id },
      data: { status: Status.CANCELLED },
    });
  }

  async sortUserReservationsByDate(userId: string) {
    return await this.prisma.reservation.findMany({
      where: { userId },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async sortUserReservationsByFacility(userId: string, facilityId: number) {
    return await this.prisma.reservation.findMany({
      where: { userId: userId, facilityId: facilityId },
    });
  }
}
