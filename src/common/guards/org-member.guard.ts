import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrgMemberGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const organizationId =
      request.query?.organizationId || request.body?.organizationId;

    if (!organizationId) {
      throw new UnauthorizedException('organizationId is required');
    }

    const user = request.user ?? request.session?.user;
    const userId = user?.id;
    if (!userId) {
      throw new UnauthorizedException('User session not found');
    }

    // Admins have global access, bypass org membership check
    if (user?.role === 'admin') {
      return true;
    }

    const member = await this.prisma.member.findFirst({
      where: {
        organizationId,
        userId,
      },
    });

    if (!member) {
      throw new ForbiddenException(
        'You are not a member of this organization',
      );
    }

    return true;
  }
}
