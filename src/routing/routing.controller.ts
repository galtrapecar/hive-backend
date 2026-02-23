import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoutingService } from './routing.service';
import { GeocodeResponseItemDto } from './dto/geocode.dto';

@ApiTags('Routing')
@Controller('routing')
export class RoutingController {
  constructor(private readonly routingService: RoutingService) {}

  @Get('geocode')
  @ApiOperation({ summary: 'Geocode an address by name' })
  @ApiQuery({ name: 'q', required: true, example: 'Berlin, Germany' })
  @ApiQuery({ name: 'limit', required: false, example: 5 })
  @ApiResponse({ status: 200, type: [GeocodeResponseItemDto] })
  async geocode(
    @Query('q') query: string,
    @Query('limit') limit?: number,
  ): Promise<GeocodeResponseItemDto[]> {
    return this.routingService.geocode(query, limit ? Number(limit) : undefined);
  }
}
