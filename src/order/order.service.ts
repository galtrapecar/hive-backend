import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, organizationId: string) {
    return this.prisma.order.create({
      data: {
        ...createOrderDto,
        organizationId,
        pickupTime: new Date(createOrderDto.pickupTime),
        dropoffTime: new Date(createOrderDto.dropoffTime),
      },
    });
  }

  async findAll(organizationId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { organizationId },
        skip,
        take: limit,
        include: { plan: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({
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

  async findOne(id: number, organizationId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        organizationId,
      },
      include: { plan: true },
    });

    if (!order) {
      throw new NotFoundException(
        `Order #${id} not found or does not belong to your organization`,
      );
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto, organizationId: string) {
    await this.findOne(id, organizationId);

    const data: Record<string, unknown> = { ...updateOrderDto };
    if (updateOrderDto.pickupTime) {
      data.pickupTime = new Date(updateOrderDto.pickupTime);
    }
    if (updateOrderDto.dropoffTime) {
      data.dropoffTime = new Date(updateOrderDto.dropoffTime);
    }

    return this.prisma.order.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, organizationId: string) {
    await this.findOne(id, organizationId);

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
