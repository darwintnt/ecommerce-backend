export interface OrderCreatedEvent {
  eventType: 'ORDER_CREATED';
  orderId: string;
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  createdAt: string;
}

export type DomainEvent = OrderCreatedEvent;
