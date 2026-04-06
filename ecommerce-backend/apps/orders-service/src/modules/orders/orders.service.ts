import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IOrdersService } from './interfaces/orders.service.interface';
import {
  type IOrdersRepository,
  ORDERS_REPOSITORY,
} from './interfaces/orders.repository.interface';
import { PaginatedResult, PaginationDto } from 'libs/commons/pagination.dto';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { EventPublisherService, OrderCreatedEvent } from 'libs/events';
import { ProductsValidationService } from './products-validation.service';

@Injectable()
export class OrdersService implements IOrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly orderRepository: IOrdersRepository,
    private readonly eventPublisher: EventPublisherService,
    private readonly productsValidationService: ProductsValidationService,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Order>> {
    const { page = 1, limit = 10 } = paginationDto;
    const result = await this.orderRepository.findAll(page, limit);
    if (!result) {
      throw new NotFoundException('Products not found');
    }
    return result;
  }

  async findById(id: string): Promise<Order> {
    const product = await this.orderRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async create(payload: CreateOrderDto): Promise<Order> {
    if (payload.orderItems && payload.orderItems.length > 0) {
      this.logger.log(`Validating ${payload.orderItems.length} products...`);

      try {
        await this.productsValidationService.validateProductsAndStock(
          payload.orderItems,
        );
        this.logger.log('Product validation successful');
      } catch (error) {
        this.logger.error('Product validation failed:', error);
        throw error;
      }
    } else {
      this.logger.warn('Order created without items');
    }

    const order = await this.orderRepository.create(payload);

    if (!order) {
      throw new Error(`Error creating order`);
    }

    if (payload.orderItems && payload.orderItems.length > 0) {
      await this.orderRepository.createOrderItems(order.id, payload.orderItems);
    }

    // Publicar evento de orden creada para descontar del stock
    const event: OrderCreatedEvent = {
      eventType: 'ORDER_CREATED',
      orderId: order.id,
      customerId: order.customerId,
      items: (payload.orderItems || []).map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number.parseFloat(item.unitPrice),
      })),
      totalAmount: Number.parseFloat(order.totalAmount.toString()),
      createdAt: order.createdAt.toISOString(),
    };

    try {
      await this.eventPublisher.publishEvent(event);
    } catch (error) {
      this.logger.error('Failed to publish ORDER_CREATED event', error);
    }

    return order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const product = await this.orderRepository.update(id, dto);
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }
}
