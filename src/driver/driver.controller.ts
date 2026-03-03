import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';
import { DriverService } from './driver.service';
import {
  DriverResponseDto,
  PaginatedDriverResponseDto,
  DriverRemoveResponseDto,
} from './dto/driver-response.dto';
import { OrgMemberGuard } from '../common/guards/org-member.guard';

@ApiTags('Drivers')
@Controller('driver')
@UseGuards(OrgMemberGuard)
@Roles(['admin', 'manager'])
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  @ApiOperation({ summary: 'Get all drivers in the organization' })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, type: PaginatedDriverResponseDto })
  async findAll(
    @Query('organizationId') organizationId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.driverService.findAll(
      organizationId,
      page ? +page : undefined,
      limit ? +limit : undefined,
    );
  }

  @Get(':memberId')
  @ApiOperation({ summary: 'Get a driver by member ID' })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiResponse({ status: 200, type: DriverResponseDto })
  async findOne(
    @Param('memberId') memberId: string,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.driverService.findOne(organizationId, memberId);
  }

  @Delete(':memberId')
  @ApiOperation({ summary: 'Remove a driver from the organization' })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiResponse({ status: 200, type: DriverRemoveResponseDto })
  async remove(
    @Param('memberId') memberId: string,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.driverService.remove(organizationId, memberId);
  }
}
