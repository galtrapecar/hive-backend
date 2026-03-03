import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { ORG_ROLES_KEY } from '../decorators/org-roles.decorator';

@Injectable()
export class OrgMemberGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

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

    // Check org-scoped roles if @OrgRoles is set
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ORG_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles && requiredRoles.length > 0) {
      const memberRoles = member.role.split(',').map((r) => r.trim());
      const hasRole = requiredRoles.some((role) => memberRoles.includes(role));
      if (!hasRole) {
        throw new ForbiddenException(
          'You do not have the required role in this organization',
        );
      }
    }

    return true;
  }
}
