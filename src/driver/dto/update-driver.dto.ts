import { ApiProperty } from '@nestjs/swagger';

export class UpdateDriverDto {
  @ApiProperty({ example: 'org_123abc' })
  organizationId: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;
}
