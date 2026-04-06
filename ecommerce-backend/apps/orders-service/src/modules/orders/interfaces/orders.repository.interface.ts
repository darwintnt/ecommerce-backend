import { PaginatedResult } from 'libs/commons/pagination.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';
import { IOrdersItemRepository } from './order-items.repository.interface';

export interface IOrdersRepository extends IOrdersItemRepository {
  findAll(page: number, limit: number): Promise<PaginatedResult<Order>>;
  findById(id: string): Promise<Order | null>;
  create(dto: CreateOrderDto): Promise<Order>;
  update(id: string, dto: UpdateOrderDto): Promise<Order | null>;
}

export const ORDERS_REPOSITORY = Symbol('ORDERS_REPOSITORY');
