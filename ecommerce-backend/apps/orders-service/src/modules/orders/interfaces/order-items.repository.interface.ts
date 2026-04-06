import { OrderItemDto } from '../dto/order-item.dto';
import { Order } from '../entities/order.entity';

export interface IOrdersItemRepository {
  createOrderItems(orderId: string, orderItems: OrderItemDto[]): Promise<Order>;
}
