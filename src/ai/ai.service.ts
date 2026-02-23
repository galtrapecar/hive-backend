import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { PDFParse } from 'pdf-parse';
import * as XLSX from 'xlsx';
import { ChatMistralAI } from '@langchain/mistralai';
import { RoutingService } from '../routing/routing.service';

const orderSchema = z.object({
  customer: z
    .string()
    .describe('The customer name usually indicated by "from" field'),
  price: z.number().describe('The price in euros'),
  weight: z.number().describe('The weight in kilograms'),
  pickupPoint: z
    .string()
    .describe(
      'The pickup location. If coordinates are available use "lat,lng" format (e.g. "46.0569,14.5058"), otherwise use geocoding-friendly address "Street Number, City, Country"',
    ),
  pickupTime: z
    .string()
    .describe('The pickup date and time in ISO 8601 format'),
  dropoffPoint: z
    .string()
    .describe(
      'The dropoff location. If coordinates are available use "lat,lng" format (e.g. "46.0569,14.5058"), otherwise use geocoding-friendly address "Street Number, City, Country"',
    ),
  dropoffTime: z
    .string()
    .describe('The dropoff date and time in ISO 8601 format'),
  description: z
    .string()
    .optional()
    .describe('Additional description or notes'),
});

@Injectable()
export class AiService {
  private llm: ChatMistralAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly routingService: RoutingService,
  ) {
    this.llm = new ChatMistralAI({
      model: 'mistral-small-latest',
      temperature: 0,
      maxTokens: undefined,
      maxRetries: 2,
      apiKey: this.configService.getOrThrow('MISTRAL_API_KEY'),
    });
  }

  async extractOrderFromFile(file: Express.Multer.File) {
    const text = await this.extractText(file);

    const structured = this.llm.withStructuredOutput(orderSchema);

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        'You are a logistics data extraction assistant. Extract the order details from the provided document. Return all fields accurately.\n\n' +
          'CUSTOMER IDENTIFICATION:\n' +
          '- The customer is the company PLACING the order (the shipper/consignor), NOT the transport/logistics company.\n' +
          '- In documents, the customer is typically indicated by "Od:" (From:) or "From:" field.\n' +
          '- The logistics/transport company is indicated by "Za:" (To:) or "To:" field and should NOT be extracted as the customer.\n' +
          '- The customer is the one sending goods and hiring the logistics company for transport.\n\n' +
          'LOCATION FORMATTING (for pickupPoint and dropoffPoint):\n' +
          '- If the document contains GPS coordinates (latitude/longitude) for a location, use them directly in "lat,lng" format (e.g. "46.0569,14.5058"). Coordinates are always preferred over addresses.\n' +
          '- If no coordinates are available, format the address for geocoding search queries using: "Street Name House Number, City, Country".\n' +
          '- Always include the country name (full name, not abbreviation).\n' +
          '- Always include the city name.\n' +
          '- Remove any postal/ZIP codes, floor numbers, suite numbers, warehouse names, or company names from the address.\n' +
          '- Remove any additional location details like "warehouse", "gate", "dock", "ramp", etc.\n' +
          '- If only a city is provided without a street, use just "City, Country".\n' +
          '- Translate abbreviations to full words (e.g. "ul." -> "ulica", "str." -> "strada").\n' +
          '- Example with coordinates: "46.0569,14.5058"\n' +
          '- Example with address: "Dunajska cesta 1, Ljubljana, Slovenia" or "Munich, Germany".\n\n' +
          'For weight make sure to convert tonnes to kg when applicable.' +
          'For dates, use ISO 8601 format.',
      ],
      ['human', 'Extract the order details from this document:\n\n{text}'],
    ]);

    const chain = prompt.pipe(structured);
    const result = await chain.invoke({ text });

    const [pickupCoords, dropoffCoords] = await Promise.all([
      this.resolveCoordinates(result.pickupPoint),
      this.resolveCoordinates(result.dropoffPoint),
    ]);

    return {
      ...result,
      pickupLat: pickupCoords?.lat ?? undefined,
      pickupLng: pickupCoords?.lng ?? undefined,
      dropoffLat: dropoffCoords?.lat ?? undefined,
      dropoffLng: dropoffCoords?.lng ?? undefined,
    };
  }

  private async resolveCoordinates(
    point: string,
  ): Promise<{ lat: number; lng: number } | null> {
    const coordMatch = point.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
    if (coordMatch) {
      return { lat: parseFloat(coordMatch[1]), lng: parseFloat(coordMatch[2]) };
    }

    const results = await this.routingService.geocode(point, 1);
    return results[0] ? { lat: results[0].lat, lng: results[0].lng } : null;
  }

  private async extractText(file: Express.Multer.File): Promise<string> {
    const mime = file.mimetype;

    if (mime === 'application/pdf') {
      const parser = new PDFParse({ data: new Uint8Array(file.buffer) });
      const result = await parser.getText();
      return result.text;
    }

    if (
      mime ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mime === 'application/vnd.ms-excel'
    ) {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      return XLSX.utils.sheet_to_csv(sheet);
    }

    return file.buffer.toString('utf-8');
  }
}
