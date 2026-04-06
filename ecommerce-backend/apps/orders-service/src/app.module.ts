import { Module } from '@nestjs/common';
import { OrdersModule } from './modules/orders/orders.module';
import { PrismaModule } from './database/prisma.module';
import { EventsModule } from 'libs/events';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OrdersModule,
    PrismaModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class OrdersServiceModule {}
