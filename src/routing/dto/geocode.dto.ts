import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GeocodeResponseItemDto {
  @ApiProperty({ example: 'Berlin, Germany' })
  name: string;

  @ApiProperty({ example: 52.5170365 })
  lat: number;

  @ApiProperty({ example: 13.3888599 })
  lng: number;

  @ApiPropertyOptional({ example: 'Germany' })
  country?: string;

  @ApiPropertyOptional({ example: 'Berlin' })
  city?: string;

  @ApiPropertyOptional({ example: 'Berlin' })
  state?: string;

  @ApiPropertyOptional({ example: '10117' })
  postcode?: string;

  @ApiPropertyOptional({ example: 'Unter den Linden' })
  street?: string;

  @ApiPropertyOptional({ example: '1' })
  housenumber?: string;
}
