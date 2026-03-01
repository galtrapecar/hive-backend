import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleType } from 'src/generated/prisma/client';

export class CreateVehicleDto {
  @ApiProperty({ example: 'org_123abc' })
  organizationId: string;

  @ApiProperty({ example: 'LJ 16-HFM' })
  registrationPlate: string;

  @ApiPropertyOptional({ example: 'V-001' })
  internalNumber?: string;

  @ApiProperty({ enum: VehicleType, example: VehicleType.TARPAULIN })
  type: VehicleType;

  @ApiPropertyOptional({ example: 'MAN' })
  make: string;

  @ApiPropertyOptional({ example: 'TGX 18.470' })
  model: string;

  @ApiPropertyOptional({ example: 2022 })
  year: number;

  @ApiPropertyOptional({ example: 'WMA06XZZ1M1234567' })
  vin?: string;

  @ApiPropertyOptional({
    example: 24000,
    description: 'Payload capacity in kg',
  })
  payloadCapacity?: number;

  @ApiPropertyOptional({ example: 40000, description: 'Gross weight in kg' })
  grossWeight?: number;

  @ApiPropertyOptional({ example: 13.6, description: 'Loading meters' })
  loadingMeters?: number;

  @ApiPropertyOptional({ example: 90, description: 'Volume in m³' })
  volume?: number;
}
