import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CalendarEventType } from '../generated/prisma/client';

@Injectable()
export class DriverService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string, page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = { organizationId, role: 'driver' as const };

    if (search) {
      const profileMatches = await this.prisma.driverProfile.findMany({
        where: {
          organizationId,
          fullName: { contains: search, mode: 'insensitive' },
        },
        select: { memberId: true },
      });
      const profileMemberIds = profileMatches.map((p) => p.memberId);

      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        ...(profileMemberIds.length > 0
          ? [{ id: { in: profileMemberIds } }]
          : []),
      ];
    }

    const [drivers, total] = await Promise.all([
      this.prisma.member.findMany({
        where,
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
      this.prisma.member.count({ where }),
    ]);

    const memberIds = drivers.map((m) => m.id);
    const profiles = await this.prisma.driverProfile.findMany({
      where: { memberId: { in: memberIds } },
      select: { memberId: true, fullName: true },
    });
    const profileMap = new Map(profiles.map((p) => [p.memberId, p.fullName]));

    return {
      data: drivers.map((m) => ({
        memberId: m.id,
        role: m.role,
        fullName: profileMap.get(m.id) ?? null,
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

    const profile = await this.prisma.driverProfile.findUnique({
      where: { memberId },
      select: { fullName: true },
    });

    return {
      memberId: member.id,
      role: member.role,
      fullName: profile?.fullName ?? null,
      joinedAt: member.createdAt,
      ...member.user,
    };
  }

  async update(organizationId: string, memberId: string, fullName: string) {
    const member = await this.prisma.member.findFirst({
      where: { id: memberId, organizationId, role: 'driver' },
    });

    if (!member) {
      throw new NotFoundException('Driver not found in this organization');
    }

    await this.prisma.driverProfile.upsert({
      where: { memberId },
      create: { memberId, organizationId, fullName },
      update: { fullName },
    });

    return { message: 'Driver updated' };
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

  private async getOrCreateProfile(
    memberId: string,
    organizationId: string,
    fullName?: string,
  ) {
    const member = await this.prisma.member.findFirst({
      where: { id: memberId, organizationId, role: 'driver' },
      include: { user: { select: { name: true } } },
    });

    if (!member) {
      throw new NotFoundException('Driver not found in this organization');
    }

    const name = fullName ?? member.user.name;

    return this.prisma.driverProfile.upsert({
      where: { memberId },
      create: { memberId, organizationId, fullName: name },
      update: fullName ? { fullName } : {},
    });
  }

  async assignVehicle(
    organizationId: string,
    memberId: string,
    vehicleId: number,
  ) {
    const profile = await this.getOrCreateProfile(memberId, organizationId);

    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: vehicleId, organizationId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found in this organization');
    }

    const assignedCount = await this.prisma.vehicle.count({
      where: { driverProfileId: profile.id },
    });

    if (assignedCount >= 2) {
      throw new BadRequestException(
        'Driver already has the maximum of 2 vehicles assigned',
      );
    }

    await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { driverProfileId: profile.id },
    });

    return { message: 'Vehicle assigned to driver' };
  }

  async unassignVehicle(
    organizationId: string,
    memberId: string,
    vehicleId: number,
  ) {
    const profile = await this.prisma.driverProfile.findFirst({
      where: { memberId, organizationId },
    });

    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }

    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: vehicleId, driverProfileId: profile.id },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not assigned to this driver');
    }

    await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { driverProfileId: null },
    });

    return { message: 'Vehicle unassigned from driver' };
  }

  async findVehicles(organizationId: string, memberId: string) {
    const profile = await this.prisma.driverProfile.findFirst({
      where: { memberId, organizationId },
      include: { vehicles: true },
    });

    if (!profile) {
      return { data: [] };
    }

    return { data: profile.vehicles };
  }

  async assignPlan(organizationId: string, memberId: string, planId: number) {
    const profile = await this.getOrCreateProfile(memberId, organizationId);

    const plan = await this.prisma.plan.findFirst({
      where: { id: planId, order: { organizationId } },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found in this organization');
    }

    await this.prisma.plan.update({
      where: { id: planId },
      data: { driverProfileId: profile.id },
    });

    return { message: 'Plan assigned to driver' };
  }

  async unassignPlan(organizationId: string, memberId: string, planId: number) {
    const profile = await this.prisma.driverProfile.findFirst({
      where: { memberId, organizationId },
    });

    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }

    const plan = await this.prisma.plan.findFirst({
      where: { id: planId, driverProfileId: profile.id },
    });

    if (!plan) {
      throw new NotFoundException('Plan not assigned to this driver');
    }

    await this.prisma.plan.update({
      where: { id: planId },
      data: { driverProfileId: null },
    });

    return { message: 'Plan unassigned from driver' };
  }

  async findPlans(organizationId: string, memberId: string) {
    const profile = await this.prisma.driverProfile.findFirst({
      where: { memberId, organizationId },
      include: { plans: { include: { order: true } } },
    });

    if (!profile) {
      return { data: [] };
    }

    return { data: profile.plans };
  }

  // --- Schedule ---

  async setSchedule(
    organizationId: string,
    memberId: string,
    workDays: number,
    offDays: number,
    startDate: string,
  ) {
    const profile = await this.getOrCreateProfile(memberId, organizationId);

    await this.prisma.driverSchedule.upsert({
      where: { driverProfileId: profile.id },
      create: {
        driverProfileId: profile.id,
        workDays,
        offDays,
        startDate: new Date(startDate),
      },
      update: {
        workDays,
        offDays,
        startDate: new Date(startDate),
      },
    });

    return { message: 'Schedule updated' };
  }

  async getSchedule(organizationId: string, memberId: string) {
    const profile = await this.prisma.driverProfile.findFirst({
      where: { memberId, organizationId },
      include: { schedule: true },
    });

    if (!profile) {
      return { data: null };
    }

    return { data: profile.schedule };
  }

  async removeSchedule(organizationId: string, memberId: string) {
    const profile = await this.prisma.driverProfile.findFirst({
      where: { memberId, organizationId },
      include: { schedule: true },
    });

    if (!profile || !profile.schedule) {
      throw new NotFoundException('Schedule not found for this driver');
    }

    await this.prisma.driverSchedule.delete({
      where: { id: profile.schedule.id },
    });

    return { message: 'Schedule removed' };
  }

  // --- Calendar Events ---

  async createCalendarEvent(
    organizationId: string,
    memberId: string,
    type: CalendarEventType,
    startDate: string,
    endDate: string,
    note?: string,
  ) {
    const profile = await this.getOrCreateProfile(memberId, organizationId);

    const event = await this.prisma.driverCalendarEvent.create({
      data: {
        driverProfileId: profile.id,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        note,
      },
    });

    return { data: event };
  }

  async findCalendarEvents(
    organizationId: string,
    memberId: string,
    from?: string,
    to?: string,
  ) {
    const profile = await this.prisma.driverProfile.findFirst({
      where: { memberId, organizationId },
    });

    if (!profile) {
      return { data: [] };
    }

    const where: any = { driverProfileId: profile.id };

    if (from || to) {
      where.startDate = {};
      if (from) where.startDate.gte = new Date(from);
      if (to) where.startDate.lte = new Date(to);
    }

    const events = await this.prisma.driverCalendarEvent.findMany({
      where,
      orderBy: { startDate: 'asc' },
    });

    return { data: events };
  }

  async removeCalendarEvent(
    organizationId: string,
    memberId: string,
    eventId: number,
  ) {
    const profile = await this.prisma.driverProfile.findFirst({
      where: { memberId, organizationId },
    });

    if (!profile) {
      throw new NotFoundException('Driver profile not found');
    }

    const event = await this.prisma.driverCalendarEvent.findFirst({
      where: { id: eventId, driverProfileId: profile.id },
    });

    if (!event) {
      throw new NotFoundException('Calendar event not found');
    }

    await this.prisma.driverCalendarEvent.delete({
      where: { id: eventId },
    });

    return { message: 'Calendar event removed' };
  }
}
