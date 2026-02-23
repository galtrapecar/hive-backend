import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExtractedOrderDto {
  @ApiProperty({ example: 'Acme Corp' })
  customer: string;

  @ApiProperty({ example: 150 })
  price: number;

  @ApiProperty({ example: 25 })
  weight: number;

  @ApiProperty({ example: '123 Main St, New York' })
  pickupPoint: string;

  @ApiPropertyOptional({ example: 40.7128 })
  pickupLat: number;

  @ApiPropertyOptional({ example: -74.006 })
  pickupLng: number;

  @ApiProperty({ example: '2025-06-01T09:00:00Z' })
  pickupTime: string;

  @ApiProperty({ example: '456 Oak Ave, Boston' })
  dropoffPoint: string;

  @ApiPropertyOptional({ example: 42.3601 })
  dropoffLat: number;

  @ApiPropertyOptional({ example: -71.0589 })
  dropoffLng: number;

  @ApiProperty({ example: '2025-06-01T17:00:00Z' })
  dropoffTime: string;

  @ApiPropertyOptional({ example: 'Fragile electronics shipment' })
  description?: string;
}
