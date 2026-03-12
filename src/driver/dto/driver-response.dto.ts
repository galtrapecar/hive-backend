import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CalendarEventType } from 'src/generated/prisma/client';

export class MessageResponseDto {
  @ApiProperty({ example: 'Driver updated' })
  message: string;
}

export class DriverScheduleDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  driverProfileId: number;

  @ApiProperty({ example: 5 })
  workDays: number;

  @ApiProperty({ example: 2 })
  offDays: number;

  @ApiProperty({ example: '2026-03-10T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ example: '2026-03-10T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-03-10T00:00:00.000Z' })
  updatedAt: Date;
}

export class DriverScheduleResponseDto {
  @ApiProperty({ type: DriverScheduleDto, nullable: true })
  data: DriverScheduleDto | null;
}

export class CalendarEventDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  driverProfileId: number;

  @ApiProperty({ enum: CalendarEventType, example: CalendarEventType.VACATION })
  type: CalendarEventType;

  @ApiProperty({ example: '2026-03-15T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ example: '2026-03-20T00:00:00.000Z' })
  endDate: Date;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'Annual leave' })
  note: string | null;

  @ApiProperty({ example: '2026-03-10T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-03-10T00:00:00.000Z' })
  updatedAt: Date;
}

export class CalendarEventResponseDto {
  @ApiProperty({ type: CalendarEventDto })
  data: CalendarEventDto;
}

export class CalendarEventListResponseDto {
  @ApiProperty({ type: [CalendarEventDto] })
  data: CalendarEventDto[];
}

export class VehicleListResponseDto {
  @ApiProperty({
    type: 'array',
    items: { $ref: '#/components/schemas/VehicleResponseDto' },
  })
  data: any[];
}

export class PlanListResponseDto {
  @ApiProperty({
    type: 'array',
    items: { $ref: '#/components/schemas/PlanDto' },
  })
  data: any[];
}

export class DriverProfileDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'mem_abc123' })
  memberId: string;

  @ApiProperty({ example: 'org_123abc' })
  organizationId: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: '2025-06-01T09:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-01T09:00:00.000Z' })
  updatedAt: Date;
}

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
