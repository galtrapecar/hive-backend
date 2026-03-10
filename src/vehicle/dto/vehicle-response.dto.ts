import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  VehicleType,
  VehicleStatus,
  AdrClass,
} from 'src/generated/prisma/client';
import { DriverProfileDto } from 'src/driver/dto/driver-response.dto';

export class VehicleResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'org_123abc' })
  organizationId: string;

  @ApiProperty({ example: 'LJ 16-HFM' })
  registrationPlate: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'V-001' })
  internalNumber: string | null;

  @ApiProperty({ enum: VehicleType, example: VehicleType.TARPAULIN })
  type: VehicleType;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'MAN' })
  make: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'TGX 18.470' })
  model: string | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 2022 })
  year: number | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'WMA06XZZ1M1234567',
  })
  vin: string | null;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 24000,
    description: 'Payload capacity in kg',
  })
  payloadCapacity: number | null;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 40000,
    description: 'Gross weight in kg',
  })
  grossWeight: number | null;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 13.6,
    description: 'Loading meters',
  })
  loadingMeters: number | null;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 4.0,
    description: 'Height in meters',
  })
  height: number | null;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 2.55,
    description: 'Width in meters',
  })
  width: number | null;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 16.5,
    description: 'Length in meters',
  })
  length: number | null;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 90,
    description: 'Volume in m³',
  })
  volume: number | null;

  @ApiPropertyOptional({
    type: Number,
    nullable: true,
    example: 5,
    description: 'Number of axles',
  })
  axles: number | null;

  @ApiPropertyOptional({
    enum: AdrClass,
    nullable: true,
    example: AdrClass.CLASS_3,
    description: 'ADR dangerous goods class',
  })
  adrClass: AdrClass | null;

  @ApiPropertyOptional({
    type: DriverProfileDto,
    nullable: true,
    description: 'Driver profile if assigned',
  })
  driverProfile: DriverProfileDto | null;

  @ApiProperty({ enum: VehicleStatus, example: VehicleStatus.ACTIVE })
  status: VehicleStatus;

  @ApiProperty({ example: '2025-06-01T09:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-01T09:00:00.000Z' })
  updatedAt: Date;
}

export class PaginatedVehicleMetaDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class PaginatedVehicleResponseDto {
  @ApiProperty({ type: [VehicleResponseDto] })
  data: VehicleResponseDto[];

  @ApiProperty({ type: PaginatedVehicleMetaDto })
  meta: PaginatedVehicleMetaDto;
}
