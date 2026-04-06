import { Injectable } from '@nestjs/common';
import { IOrdersRepository } from './interfaces/orders.repository.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { PaginatedResult } from 'libs/commons/pagination.dto';
import { PrismaService } from '../../database/prisma.service';
import { OrderItemDto } from './dto/order-item.dto';

@Injectable()
export class OrdersRepository implements IOrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number, limit: number): Promise<PaginatedResult<Order>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count(),
    ]);

    return {
      data: data as unknown as Order[],
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Order | null> {
    const item = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });
    return item ? (item as unknown as Order) : null;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const item = await this.prisma.order.create({
      data: {
        totalAmount: Number(dto.totalAmount || 0),
        customerId: '00000000-0000-0000-0000-000000000000',
      },
    });
    return item as unknown as Order;
  }

  async createOrderItems(
    orderId: string,
    orderItems: OrderItemDto[],
  ): Promise<Order> {
    await this.prisma.orderItem.createMany({
      data: orderItems.map((item) => ({
        orderId: orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });

    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    }) as Promise<Order>;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order | null> {
    try {
      const item = await this.prisma.order.update({
        where: { id },
        data: { totalAmount: Number(dto.totalAmount || 0) },
      });
      return item as unknown as Order;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
