import { ApiProperty } from '@nestjs/swagger';

export class DriverResponseDto {
  @ApiProperty({ example: 'mem_abc123' })
  memberId: string;

  @ApiProperty({ example: 'driver' })
  role: string;

  @ApiProperty({ type: String, example: 'John Doe', nullable: true })
  fullName: string | null;

  @ApiProperty({ example: '2025-06-01T09:00:00.000Z' })
  joinedAt: Date;

  @ApiProperty({ example: 'usr_xyz789' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: '2025-06-01T09:00:00.000Z' })
  createdAt: Date;
}

export class PaginatedDriverResponseDto {
  @ApiProperty({ type: [DriverResponseDto] })
  data: DriverResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class DriverRemoveResponseDto {
  @ApiProperty({ example: 'Driver removed from organization' })
  message: string;
}
