import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProductsService } from './interfaces/products.service.interface';
import {
  type IProductsRepository,
  PRODUCTS_REPOSITORY,
} from './interfaces/products.repository.interface';
import { PaginatedResult, PaginationDto } from 'libs/commons/pagination.dto';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService implements IProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productRepository: IProductsRepository,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Product>> {
    const { page = 1, limit = 10 } = paginationDto;
    const result = await this.productRepository.findAll(page, limit);
    if (!result) {
      throw new NotFoundException('Products not found');
    }
    return result;
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async create(payload: CreateProductDto): Promise<Product> {
    return await this.productRepository.create(payload);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.update(id, dto);
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async decrementStock(productId: string, quantity: number): Promise<boolean> {
    const success = await this.productRepository.decrementStock(
      productId,
      quantity,
    );
    if (!success) {
      throw new Error(
        `Failed to decrement stock for product ${productId}. Insufficient stock or product not found.`,
      );
    }
    return success;
  }
}
