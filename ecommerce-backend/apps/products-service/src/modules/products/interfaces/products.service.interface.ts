import { PaginatedResult, PaginationDto } from 'libs/commons/pagination.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

export interface IProductsService {
  findAll(query: PaginationDto): Promise<PaginatedResult<Product>>;
  findById(id: string): Promise<Product>;
  create(payload: CreateProductDto): Promise<Product>;
  update(id: string, dto: UpdateProductDto): Promise<Product>;
  decrementStock(productId: string, quantity: number): Promise<boolean>;
}

export const PRODUCTS_SERVICE = Symbol('PRODUCTS_SERVICE');
