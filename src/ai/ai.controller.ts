import {
  Controller,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
import { ExtractedOrderDto } from './dto/extracted-order.dto';
import { OrgRoles } from 'src/common/decorators/org-roles.decorator';
import { OrgMemberGuard } from 'src/common/guards/org-member.guard';

@ApiTags('AI')
@Controller('ai')
@UseGuards(OrgMemberGuard)
@OrgRoles(['owner'])
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('/extract-order')
  @ApiQuery({ name: 'organizationId', required: true, example: 'org_123abc' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Extract order details from an uploaded file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to extract order details from (txt, pdf, xlsx)',
    required: true,
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Order file (txt, pdf, xlsx)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Extracted order details',
    type: ExtractedOrderDto,
  })
  async extractOrderFromFile(
    @UploadedFile(new ParseFilePipe()) file: Express.Multer.File,
  ) {
    return await this.aiService.extractOrderFromFile(file);
  }
}
