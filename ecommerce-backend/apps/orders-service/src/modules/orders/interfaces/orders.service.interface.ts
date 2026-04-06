import { PaginatedResult, PaginationDto } from 'libs/commons/pagination.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';

export interface IOrdersService {
  findAll(query: PaginationDto): Promise<PaginatedResult<Order>>;
  findById(id: string): Promise<Order>;
  create(payload: CreateOrderDto): Promise<Order>;
  update(id: string, dto: UpdateOrderDto): Promise<Order>;
}

export const ORDERS_SERVICE = Symbol('ORDERS_SERVICE');
