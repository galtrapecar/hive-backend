import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
import { ExtractedPlanDto } from './dto/extracted-plan.dto';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('/extract-plan')
  @AllowAnonymous()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Extract plan details from an uploaded file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to extract plan details from (txt, pdf, xlsx)',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Extracted plan details',
    type: ExtractedPlanDto,
  })
  async extractPlanFromFile(@UploadedFile() file: Express.Multer.File) {
    return await this.aiService.extractPlanFromFile(file);
  }
}
