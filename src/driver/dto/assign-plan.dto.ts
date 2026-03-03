import { ApiProperty } from '@nestjs/swagger';

export class AssignPlanDto {
  @ApiProperty({ example: 1 })
  planId: number;

  @ApiProperty({ example: 'org_123abc' })
  organizationId: string;
}
