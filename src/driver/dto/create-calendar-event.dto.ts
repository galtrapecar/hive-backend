import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCalendarEventDto {
  @ApiProperty({ example: 'org_123abc' })
  organizationId: string;

  @ApiProperty({ enum: ['SICK_LEAVE', 'VACATION'], example: 'VACATION' })
  type: 'SICK_LEAVE' | 'VACATION';

  @ApiProperty({ example: '2026-03-15T00:00:00.000Z' })
  startDate: string;

  @ApiProperty({ example: '2026-03-20T00:00:00.000Z' })
  endDate: string;

  @ApiPropertyOptional({ example: 'Annual leave' })
  note?: string;
}
