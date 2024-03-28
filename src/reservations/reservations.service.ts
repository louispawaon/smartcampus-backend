import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReservationsDto } from './dto/reservations.dto';
import { Reservation, Status } from '@prisma/client';
@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

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
      professorName,
      classGrade,
      startDate,
      endDate,
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
        professorName,
        classGrade,
        startDate,
        endDate,
        equipments,
        equipmentQty,
      },
    });
  }

  async updateReservationDetails(
    id: string,
    updatedFields: Partial<Reservation>,
  ): Promise<Reservation | null> {
    return await this.prisma.reservation.update({
      where: { id },
      data: updatedFields,
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
