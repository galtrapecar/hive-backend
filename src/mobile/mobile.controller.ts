import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrgRoles } from 'src/common/decorators/org-roles.decorator';
import { OrgMemberGuard } from 'src/common/guards/org-member.guard';

@ApiTags('Mobile')
@Controller('mobile')
@UseGuards(OrgMemberGuard)
@OrgRoles(['driver'])
export class MobileController {}
