import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DriverService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [drivers, total] = await Promise.all([
      this.prisma.member.findMany({
        where: { organizationId, role: 'driver' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.member.count({
        where: { organizationId, role: 'driver' },
      }),
    ]);

    return {
      data: drivers.map((m) => ({
        memberId: m.id,
        role: m.role,
        joinedAt: m.createdAt,
        ...m.user,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(organizationId: string, memberId: string) {
    const member = await this.prisma.member.findFirst({
      where: { id: memberId, organizationId, role: 'driver' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Driver not found in this organization');
    }

    return {
      memberId: member.id,
      role: member.role,
      joinedAt: member.createdAt,
      ...member.user,
    };
  }

  async remove(organizationId: string, memberId: string) {
    const member = await this.prisma.member.findFirst({
      where: { id: memberId, organizationId, role: 'driver' },
    });

    if (!member) {
      throw new NotFoundException('Driver not found in this organization');
    }

    await this.prisma.member.delete({ where: { id: memberId } });

    return { message: 'Driver removed from organization' };
  }
}
