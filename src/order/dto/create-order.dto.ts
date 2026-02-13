import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  organizationId: number;

  @ApiProperty({ example: 'Acme Corp' })
  customer: string;

  @ApiProperty({ example: 150 })
  price: number;

  @ApiProperty({ example: 25 })
  weight: number;

  @ApiProperty({ example: '123 Main St, New York' })
  pickupPoint: string;

  @ApiProperty({ example: '2025-06-01T09:00:00Z' })
  pickupTime: string;

  @ApiProperty({ example: '456 Oak Ave, Boston' })
  dropoffPoint: string;

  @ApiProperty({ example: '2025-06-01T17:00:00Z' })
  dropoffTime: string;

  @ApiPropertyOptional({ example: 'Fragile electronics shipment' })
  description?: string;
}
