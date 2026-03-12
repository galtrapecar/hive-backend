import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { DriverService } from './driver.service';
import {
  DriverResponseDto,
  PaginatedDriverResponseDto,
  DriverRemoveResponseDto,
  MessageResponseDto,
  DriverScheduleResponseDto,
  CalendarEventResponseDto,
  CalendarEventListResponseDto,
  VehicleListResponseDto,
  PlanListResponseDto,
} from './dto/driver-response.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { AssignVehicleDto } from './dto/assign-vehicle.dto';
import { AssignPlanDto } from './dto/assign-plan.dto';
import { SetScheduleDto } from './dto/set-schedule.dto';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { OrgMemberGuard } from '../common/guards/org-member.guard';
import { OrgRoles } from 'src/common/decorators/org-roles.decorator';

@ApiTags('Drivers')
@Controller('driver')
@UseGuards(OrgMemberGuard)
@OrgRoles(['owner'])
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  @ApiOperation({ summary: 'Get all drivers in the organization' })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, full name, or email' })
  @ApiResponse({ status: 200, type: PaginatedDriverResponseDto })
  async findAll(
    @Query('organizationId') organizationId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return await this.driverService.findAll(
      organizationId,
      page ? +page : undefined,
      limit ? +limit : undefined,
      search,
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

  @Patch(':memberId')
  @ApiOperation({ summary: 'Update a driver profile' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async update(
    @Param('memberId') memberId: string,
    @Body() dto: UpdateDriverDto,
  ) {
    return await this.driverService.update(
      dto.organizationId,
      memberId,
      dto.fullName,
    );
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

  @Post(':memberId/vehicles')
  @ApiOperation({ summary: 'Assign a vehicle to a driver (max 2)' })
  @ApiResponse({ status: 201, type: MessageResponseDto })
  async assignVehicle(
    @Param('memberId') memberId: string,
    @Body() dto: AssignVehicleDto,
  ) {
    return await this.driverService.assignVehicle(
      dto.organizationId,
      memberId,
      dto.vehicleId,
    );
  }

  @Delete(':memberId/vehicles/:vehicleId')
  @ApiOperation({ summary: 'Unassign a vehicle from a driver' })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async unassignVehicle(
    @Param('memberId') memberId: string,
    @Param('vehicleId', ParseIntPipe) vehicleId: number,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.driverService.unassignVehicle(
      organizationId,
      memberId,
      vehicleId,
    );
  }

  @Get(':memberId/vehicles')
  @ApiOperation({ summary: "Get a driver's assigned vehicles" })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiResponse({ status: 200, type: VehicleListResponseDto })
  async findVehicles(
    @Param('memberId') memberId: string,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.driverService.findVehicles(organizationId, memberId);
  }

  @Post(':memberId/plans')
  @ApiOperation({ summary: 'Assign a plan to a driver' })
  @ApiResponse({ status: 201, type: MessageResponseDto })
  async assignPlan(
    @Param('memberId') memberId: string,
    @Body() dto: AssignPlanDto,
  ) {
    return await this.driverService.assignPlan(
      dto.organizationId,
      memberId,
      dto.planId,
    );
  }

  @Delete(':memberId/plans/:planId')
  @ApiOperation({ summary: 'Unassign a plan from a driver' })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async unassignPlan(
    @Param('memberId') memberId: string,
    @Param('planId', ParseIntPipe) planId: number,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.driverService.unassignPlan(
      organizationId,
      memberId,
      planId,
    );
  }

  @Get(':memberId/plans')
  @ApiOperation({ summary: "Get a driver's assigned plans" })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiResponse({ status: 200, type: PlanListResponseDto })
  async findPlans(
    @Param('memberId') memberId: string,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.driverService.findPlans(organizationId, memberId);
  }

  // --- Schedule ---

  @Post(':memberId/schedule')
  @ApiOperation({ summary: 'Set or update a driver schedule (e.g. 5 days on, 2 days off)' })
  @ApiResponse({ status: 201, type: MessageResponseDto })
  async setSchedule(
    @Param('memberId') memberId: string,
    @Body() dto: SetScheduleDto,
  ) {
    return await this.driverService.setSchedule(
      dto.organizationId,
      memberId,
      dto.workDays,
      dto.offDays,
      dto.startDate,
    );
  }

  @Get(':memberId/schedule')
  @ApiOperation({ summary: "Get a driver's schedule" })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiResponse({ status: 200, type: DriverScheduleResponseDto })
  async getSchedule(
    @Param('memberId') memberId: string,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.driverService.getSchedule(organizationId, memberId);
  }

  @Delete(':memberId/schedule')
  @ApiOperation({ summary: "Remove a driver's schedule" })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async removeSchedule(
    @Param('memberId') memberId: string,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.driverService.removeSchedule(organizationId, memberId);
  }

  // --- Calendar Events ---

  @Post(':memberId/calendar')
  @ApiOperation({ summary: 'Add a calendar event (sick leave or vacation)' })
  @ApiResponse({ status: 201, type: CalendarEventResponseDto })
  async createCalendarEvent(
    @Param('memberId') memberId: string,
    @Body() dto: CreateCalendarEventDto,
  ) {
    return await this.driverService.createCalendarEvent(
      dto.organizationId,
      memberId,
      dto.type,
      dto.startDate,
      dto.endDate,
      dto.note,
    );
  }

  @Get(':memberId/calendar')
  @ApiOperation({ summary: "Get a driver's calendar events" })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiQuery({ name: 'from', required: false, description: 'Filter events starting from this date' })
  @ApiQuery({ name: 'to', required: false, description: 'Filter events starting up to this date' })
  @ApiResponse({ status: 200, type: CalendarEventListResponseDto })
  async findCalendarEvents(
    @Param('memberId') memberId: string,
    @Query('organizationId') organizationId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return await this.driverService.findCalendarEvents(
      organizationId,
      memberId,
      from,
      to,
    );
  }

  @Delete(':memberId/calendar/:eventId')
  @ApiOperation({ summary: 'Remove a calendar event' })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async removeCalendarEvent(
    @Param('memberId') memberId: string,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.driverService.removeCalendarEvent(
      organizationId,
      memberId,
      eventId,
    );
  }
}
