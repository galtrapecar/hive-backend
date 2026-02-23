import { ApiProperty } from '@nestjs/swagger';

export enum PlanStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class PlanDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ enum: PlanStatus, example: PlanStatus.PENDING })
  status: PlanStatus;

  @ApiProperty({ example: 1 })
  orderId: number;

  @ApiProperty({ example: '2025-06-01T09:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-06-01T09:00:00.000Z' })
  updatedAt: Date;
}
