import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { PDFParse } from 'pdf-parse';
import * as XLSX from 'xlsx';
import { PrismaService } from 'src/prisma/prisma.service';

const planSchema = z.object({
  customer: z.string().describe('The customer name'),
  price: z.number().describe('The price in numeric value'),
  weight: z.number().describe('The weight in numeric value'),
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
  private llm: ChatOpenAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.llm = new ChatOpenAI({
      model: 'gpt-4.1-nano',
      temperature: 0,
      apiKey: this.configService.get<string>('OPEN_AI_KEY'),
    });
  }

  async extractPlanFromFile(file: Express.Multer.File) {
    const text = await this.extractText(file);

    const structured = this.llm.withStructuredOutput(planSchema);

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        'You are a logistics data extraction assistant. Extract the plan details from the provided document. Return all fields accurately. For dates, use ISO 8601 format.',
      ],
      ['human', 'Extract the plan details from this document:\n\n{text}'],
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
