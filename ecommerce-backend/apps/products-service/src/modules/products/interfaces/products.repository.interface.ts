import { PaginatedResult } from 'libs/commons/pagination.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

export interface IProductsRepository {
  findAll(page: number, limit: number): Promise<PaginatedResult<Product>>;
  findById(id: string): Promise<Product | null>;
  create(dto: CreateProductDto): Promise<Product>;
  update(id: string, dto: UpdateProductDto): Promise<Product | null>;
  decrementStock(productId: string, quantity: number): Promise<boolean>;
}

export const PRODUCTS_REPOSITORY = Symbol('PRODUCTS_REPOSITORY');
