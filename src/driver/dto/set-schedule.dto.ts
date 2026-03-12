import { ApiProperty } from '@nestjs/swagger';

export class SetScheduleDto {
  @ApiProperty({ example: 'org_123abc' })
  organizationId: string;

  @ApiProperty({ example: 5, description: 'Number of consecutive work days' })
  workDays: number;

  @ApiProperty({ example: 2, description: 'Number of consecutive off days' })
  offDays: number;

  @ApiProperty({ example: '2026-03-10T00:00:00.000Z', description: 'Start date of the schedule cycle' })
  startDate: string;
}
