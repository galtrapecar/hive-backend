import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVehicleDto: Omit<CreateVehicleDto, 'organizationId'>, organizationId: string) {
    return this.prisma.vehicle.create({
      data: {
        ...createVehicleDto,
        organizationId,
      },
    });
  }

  async findAll(organizationId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where: { organizationId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vehicle.count({
        where: { organizationId },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(organizationId: string, id: number) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id, organizationId },
    });

    if (!vehicle) {
      throw new NotFoundException(
        `Vehicle #${id} not found or does not belong to your organization`,
      );
    }

    return vehicle;
  }

  async update(organizationId: string, id: number, updateVehicleDto: UpdateVehicleDto) {
    await this.findOne(organizationId, id);

    return this.prisma.vehicle.update({
      where: { id },
      data: updateVehicleDto,
    });
  }

  async remove(organizationId: string, id: number) {
    await this.findOne(organizationId, id);

    return this.prisma.vehicle.delete({
      where: { id },
    });
  }
}
