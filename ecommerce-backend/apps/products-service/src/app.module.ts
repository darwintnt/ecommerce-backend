import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { PrismaModule } from './database/prisma.module';
import { EventsModule } from 'libs/events';
import { OrderCreatedHandler } from './handlers/order-created.handler';

@Module({
  imports: [ProductsModule, PrismaModule, EventsModule],
  controllers: [],
  providers: [OrderCreatedHandler],
})
export class ProductsServiceModule {}
