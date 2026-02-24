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

    return this.mapHits(data.hits);
  }

  async reverseGeocode(
    lat: number,
    lng: number,
    limit = 5,
  ): Promise<GeocodeResponseItemDto[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/geocode`, {
        params: {
          reverse: true,
          point: `${lat},${lng}`,
          limit,
          key: this.apiKey,
        },
      }),
    );

    return this.mapHits(data.hits);
  }

  private mapHits(hits: Record<string, unknown>[]): GeocodeResponseItemDto[] {
    return hits.map((hit) => ({
      name: hit.name as string,
      lat: hit.point?.['lat'],
      lng: hit.point?.['lng'],
      country: hit.country as string | undefined,
      city: hit.city as string | undefined,
      state: hit.state as string | undefined,
      postcode: hit.postcode as string | undefined,
      street: hit.street as string | undefined,
      housenumber: hit.housenumber as string | undefined,
    }));
  }
}
