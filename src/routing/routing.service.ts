import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GeocodeResponseItemDto } from './dto/geocode.dto';

@Injectable()
export class RoutingService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://graphhopper.com/api/1';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.getOrThrow('GRAPHOPPER_API_KEY');
  }

  async geocode(query: string, limit = 5): Promise<GeocodeResponseItemDto[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/geocode`, {
        params: {
          q: query,
          limit,
          key: this.apiKey,
        },
      }),
    );

    return data.hits.map((hit: Record<string, unknown>) => ({
      name: hit.name,
      lat: hit.point?.['lat'],
      lng: hit.point?.['lng'],
      country: hit.country,
      city: hit.city,
      state: hit.state,
      postcode: hit.postcode,
      street: hit.street,
      housenumber: hit.housenumber,
    }));
  }
}
