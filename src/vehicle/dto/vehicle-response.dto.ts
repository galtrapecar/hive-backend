import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleType, VehicleStatus } from 'src/generated/prisma/client';

export class VehicleResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'org_123abc' })
  organizationId: string;

  @ApiProperty({ example: 'LJ 16-HFM' })
  registrationPlate: string;

  @ApiPropertyOptional({ example: 'V-001' })
  internalNumber: string | null;

  @ApiProperty({ enum: VehicleType, example: VehicleType.TARPAULIN })
  type: VehicleType;

  @ApiPropertyOptional({ example: 'MAN' })
  make: string | null;

  @ApiPropertyOptional({ example: 'TGX 18.470' })
  model: string | null;

  @ApiPropertyOptional({ example: 2022 })
  year: number | null;

  @ApiPropertyOptional({ example: 'WMA06XZZ1M1234567' })
  vin: string | null;

  @ApiPropertyOptional({
    example: 24000,
    description: 'Payload capacity in kg',
  })
  payloadCapacity: number | null;

  @ApiPropertyOptional({ example: 40000, description: 'Gross weight in kg' })
  grossWeight: number | null;

  @ApiPropertyOptional({ example: 13.6, description: 'Loading meters' })
  loadingMeters: number | null;

  @ApiPropertyOptional({ example: 90, description: 'Volume in m³' })
  volume: number | null;

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
