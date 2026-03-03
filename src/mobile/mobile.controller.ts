import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '@thallesp/nestjs-better-auth';
import { OrgMemberGuard } from 'src/common/guards/org-member.guard';

@ApiTags('Mobile')
@Controller('mobile')
@UseGuards(OrgMemberGuard)
@Roles(['driver'])
export class MobileController {}
