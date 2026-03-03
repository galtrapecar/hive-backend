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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  OrderResponseDto,
  PaginatedOrderResponseDto,
} from './dto/order-response.dto';
import { Roles } from '@thallesp/nestjs-better-auth';
import { OrgMemberGuard } from '../common/guards/org-member.guard';

@ApiTags('Orders')
@Controller('order')
@UseGuards(OrgMemberGuard)
@Roles(['admin', 'manager'])
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, type: OrderResponseDto })
  async create(@Body() createOrderDto: CreateOrderDto) {
    const { organizationId, ...orderData } = createOrderDto;
    return await this.orderService.create(orderData as CreateOrderDto, organizationId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all orders for current organization (paginated)',
  })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, type: PaginatedOrderResponseDto })
  async findAll(
    @Query('organizationId') organizationId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.orderService.findAll(
      organizationId,
      page ? +page : undefined,
      limit ? +limit : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.orderService.findOne(id, organizationId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order' })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.orderService.update(id, updateOrderDto, organizationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('organizationId') organizationId: string,
  ) {
    return await this.orderService.remove(id, organizationId);
  }
}
