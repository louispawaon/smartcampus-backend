import { Injectable } from '@nestjs/common';
import { Facility } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { FacilityDto } from './dto/facility.dto';

@Injectable()
export class FacilitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async createFacility(facilityDto: FacilityDto) {
    const { roomNum, name, description, capacity } = facilityDto;

    const facility = await this.prisma.facility.create({
      data: {
        roomNum,
        name,
        description,
        capacity,
      },
    });
    return facility;
  }

  async findByRoomNum(roomNum: string): Promise<Facility | null> {
    return await this.prisma.facility.findUnique({
      where: { roomNum },
    });
  }

  async findByFacilName(name: string): Promise<Facility | null> {
    return await this.prisma.facility.findFirst({
      where: { name },
    });
  }

  async getAllFacilities() {
    return await this.prisma.facility.findMany();
  }

  async getFacilityDetails(id: string): Promise<Facility | null> {
    try {
      const facility = await this.prisma.facility.findUnique({
        where: { id },
        include: {
          Reservation: true,
        },
      });
      return facility;
    } catch (error) {
      console.error('Error retrieving facility details', error);
      throw error;
    }
  }

  async updateFacilityDetails(
    id: string,
    updatedFields: Partial<Facility>,
  ): Promise<Facility | null> {
    return await this.prisma.facility.update({
      where: { id },
      data: updatedFields,
    });
  }
}