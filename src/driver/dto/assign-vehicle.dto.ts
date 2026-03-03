import { ApiProperty } from '@nestjs/swagger';

export class AssignVehicleDto {
  @ApiProperty({ example: 1 })
  vehicleId: number;

  @ApiProperty({ example: 'org_123abc' })
  organizationId: string;
}
