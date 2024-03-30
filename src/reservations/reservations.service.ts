import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReservationsDto } from './dto/reservations.dto';
import { Reservation, Role, Status } from '@prisma/client';
import { EmailSender } from 'src/email/emailSender';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailSender: EmailSender,
  ) {}

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

    const staffUsers = await this.prisma.user.findMany({
      where: { role: Role.STAFF },
      select: {
        email: true,
      },
    });

    const staffEmails = staffUsers.map((user) => user.email);

    const userEmail = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    const facilityName = await this.prisma.facility.findUnique({
      where: { id: facilityId },
      select: { name: true },
    });

    const createReservation = await this.prisma.reservation.create({
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

    this.emailSender.sendStaffEmail(
      staffEmails, //Replace with staffEmails
      'Reservation Created',
      createReservation.id,
      facilityName.name,
      userEmail.email,
      createReservation.startDate.toLocaleString(),
      createReservation.endDate.toLocaleString(),
      createReservation.status,
    );

    return createReservation;
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
    const confirmedReservation = await this.prisma.reservation.update({
      where: { id },
      data: { status: Status.CONFIRMED },
    });

    const userEmail = await this.prisma.reservation.findUnique({
      where: { id },
      select: {
        user: {
          select: { email: true },
        },
      },
    });

    const facilityName = await this.prisma.reservation.findUnique({
      where: { id },
      select: {
        facility: {
          select: { name: true },
        },
      },
    });

    this.emailSender.sendUserEmail(
      userEmail.user.email, //Replace with userEmail.user.email
      'Reservation Confirmation',
      confirmedReservation.id,
      facilityName.facility.name,
      confirmedReservation.startDate.toLocaleString(),
      confirmedReservation.endDate.toLocaleString(),
      confirmedReservation.status,
    );

    return confirmedReservation;
  }

  async cancelReservation(id: string): Promise<Reservation | null> {
    const cancelledReservation = await this.prisma.reservation.update({
      where: { id },
      data: { status: Status.CANCELLED },
    });

    const userEmail = await this.prisma.reservation.findUnique({
      where: { id },
      select: {
        user: {
          select: { email: true },
        },
      },
    });

    const facilityName = await this.prisma.reservation.findUnique({
      where: { id },
      select: {
        facility: {
          select: { name: true },
        },
      },
    });

    this.emailSender.sendUserEmail(
      userEmail.user.email, //Replace with userEmail.user.email
      'Reservation Confirmation',
      cancelledReservation.id,
      facilityName.facility.name,
      cancelledReservation.startDate.toLocaleString(),
      cancelledReservation.endDate.toLocaleString(),
      cancelledReservation.status,
    );

    return cancelledReservation;
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
