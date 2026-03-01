import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import {
  VehicleResponseDto,
  PaginatedVehicleResponseDto,
} from './dto/vehicle-response.dto';
import { OrgMemberGuard } from '../common/guards/org-member.guard';

@ApiTags('Vehicles')
@Controller('vehicle')
@UseGuards(OrgMemberGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle' })
  @ApiResponse({ status: 201, type: VehicleResponseDto })
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    const { organizationId, ...vehicleData } = createVehicleDto;
    return await this.vehicleService.create(vehicleData, organizationId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles for current organization (paginated)' })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, type: PaginatedVehicleResponseDto })
  async findAll(
    @Query('organizationId') organizationId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.vehicleService.findAll(
      organizationId,
      page ? +page : undefined,
      limit ? +limit : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle by ID' })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiResponse({ status: 200, type: VehicleResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.vehicleService.findOne(organizationId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicle' })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiResponse({ status: 200, type: VehicleResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.vehicleService.update(organizationId, id, updateVehicleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle' })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiResponse({ status: 200, type: VehicleResponseDto })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.vehicleService.remove(organizationId, id);
  }
}
