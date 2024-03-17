import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FacilityDto {
  @ApiProperty({ required: false })
  roomNum: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: false })
  capacity: number;
}
