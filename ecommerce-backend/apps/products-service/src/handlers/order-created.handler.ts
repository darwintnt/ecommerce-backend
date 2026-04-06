import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import {
  EventHandler,
  EventConsumerService,
  OrderCreatedEvent,
} from 'libs/events';
import {
  PRODUCTS_SERVICE,
  type IProductsService,
} from '../modules/products/interfaces/products.service.interface';

@Injectable()
export class OrderCreatedHandler
  implements EventHandler<OrderCreatedEvent>, OnModuleInit
{
  private readonly logger = new Logger(OrderCreatedHandler.name);

  constructor(
    private readonly eventConsumer: EventConsumerService,
    @Inject(PRODUCTS_SERVICE)
    private readonly productsService: IProductsService,
  ) {}

  onModuleInit() {
    // Registrar este handler para eventos ORDER_CREATED
    this.eventConsumer.registerHandler('ORDER_CREATED', this);
    this.logger.log('OrderCreatedHandler registered');
  }

  async handle(event: OrderCreatedEvent): Promise<void> {
    this.logger.log(`Processing ORDER_CREATED event: ${event.orderId}`);

    try {
      // Decrementar el stock de cada producto en la orden
      for (const item of event.items) {
        this.logger.log(
          `Decrementing stock for product ${item.productId} by ${item.quantity}`,
        );

        try {
          await this.productsService.decrementStock(
            item.productId,
            item.quantity,
          );
          this.logger.log(
            `Stock updated successfully for product ${item.productId}`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to decrement stock for product ${item.productId}:`,
            error,
          );
          // Continuar con los otros productos aunque uno falle
          // En un sistema real, podrías implementar compensación aquí
        }
      }

      this.logger.log(
        `ORDER_CREATED event processed successfully: ${event.orderId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing ORDER_CREATED event: ${event.orderId}`,
        error,
      );
      throw error; // Relanzar para que el mensaje vuelva a la cola
    }
  }
}
