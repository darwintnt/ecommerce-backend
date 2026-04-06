import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ORDERS_REPOSITORY } from './interfaces/orders.repository.interface';
import { OrdersRepository } from './orders.repository';
import { ORDERS_SERVICE } from './interfaces/orders.service.interface';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ProductsValidationService } from './products-validation.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  controllers: [OrdersController],
  providers: [
    {
      provide: ORDERS_SERVICE,
      useClass: OrdersService,
    },
    {
      provide: ORDERS_REPOSITORY,
      useClass: OrdersRepository,
    },
    ProductsValidationService,
  ],
  exports: [ORDERS_SERVICE, ORDERS_REPOSITORY],
})
export class OrdersModule {}
