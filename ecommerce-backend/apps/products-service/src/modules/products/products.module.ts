import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PRODUCTS_REPOSITORY } from './interfaces/products.repository.interface';
import { ProductsRepository } from './products.repository';
import { PRODUCTS_SERVICE } from './interfaces/products.service.interface';

@Module({
  controllers: [ProductsController],
  providers: [
    {
      provide: PRODUCTS_SERVICE,
      useClass: ProductsService,
    },
    {
      provide: PRODUCTS_REPOSITORY,
      useClass: ProductsRepository,
    },
  ],
  exports: [PRODUCTS_SERVICE, PRODUCTS_REPOSITORY],
})
export class ProductsModule {}
