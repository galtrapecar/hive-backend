import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { PDFParse } from 'pdf-parse';
import * as XLSX from 'xlsx';
import { ChatMistralAI } from '@langchain/mistralai';

const orderSchema = z.object({
  customer: z
    .string()
    .describe('The customer name usually indicated by "from" field'),
  price: z.number().describe('The price in euros'),
  weight: z.number().describe('The weight in kilograms'),
  pickupPoint: z.string().describe('The pickup location/address'),
  pickupTime: z
    .string()
    .describe('The pickup date and time in ISO 8601 format'),
  dropoffPoint: z.string().describe('The dropoff location/address'),
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

  constructor(private readonly configService: ConfigService) {
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
          'For dates, use ISO 8601 format.',
      ],
      ['human', 'Extract the order details from this document:\n\n{text}'],
    ]);

    const chain = prompt.pipe(structured);
    const result = await chain.invoke({ text });

    return result;
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
