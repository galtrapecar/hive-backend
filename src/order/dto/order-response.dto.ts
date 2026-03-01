import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlanDto } from './plan.dto';

export class OrderResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'abc...' })
  organizationId: string;

  @ApiProperty({ example: 'Acme Corp' })
  customer: string;

  @ApiProperty({ example: 150 })
  price: number;

  @ApiProperty({ example: 25 })
  weight: number;

  @ApiProperty({ example: '123 Main St, New York' })
  pickupPoint: string;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 40.7128 })
  pickupLat: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: -74.006 })
  pickupLng: number | null;

  @ApiProperty({ example: '2025-06-01T09:00:00.000Z' })
  pickupTime: Date;

  @ApiProperty({ example: '456 Oak Ave, Boston' })
  dropoffPoint: string;

  @ApiPropertyOptional({ type: Number, nullable: true, example: 42.3601 })
  dropoffLat: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true, example: -71.0589 })
  dropoffLng: number | null;

  @ApiProperty({ example: '2025-06-01T17:00:00.000Z' })
  dropoffTime: Date;

  @ApiPropertyOptional({ example: 'Fragile electronics shipment' })
  description?: string;

  @ApiPropertyOptional({ type: PlanDto, nullable: true })
  plan: PlanDto | null;

  @ApiProperty({ example: '2025-06-01T09:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-01T09:00:00.000Z' })
  updatedAt: Date;
}

export class PaginatedOrderMetaDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class PaginatedOrderResponseDto {
  @ApiProperty({ type: [OrderResponseDto] })
  data: OrderResponseDto[];

  @ApiProperty({ type: PaginatedOrderMetaDto })
  meta: PaginatedOrderMetaDto;
}
