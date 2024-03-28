import {
  IsNotEmpty,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsString,
  Min,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReservationDto {
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

  @ApiProperty({ required: false })
  @IsString()
  professorName?: string;

  @ApiProperty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  endDate: Date;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  equipments: string[];

  @ApiProperty({ type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  @Min(0, { each: true })
  equipmentQty: number[];
}
