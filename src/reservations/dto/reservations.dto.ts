import {
  IsNotEmpty,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsString,
  Min,
  IsNumber,
} from 'class-validator';
import { Status } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ReservationsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  facilityId: number;

  @ApiProperty({ required: false })
  @IsString()
  department?: string;

  @ApiProperty({ required: false })
  @IsString()
  purpose?: string;

  @ApiProperty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  endDate: Date;

  @ApiProperty()
  @IsEnum(Status)
  status: Status;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  equipments: string[];

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @Min(0, { each: true })
  equipmentQty: number[];
}
