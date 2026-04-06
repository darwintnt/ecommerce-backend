import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  PRODUCTS_SERVICE,
  type IProductsService,
} from './interfaces/products.service.interface';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedResult, PaginationDto } from 'libs/commons/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCTS_SERVICE)
    private readonly productsService: IProductsService,
  ) {}

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Product>> {
    return await this.productsService.findAll(paginationDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Product> {
    return await this.productsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    return await this.productsService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productsService.update(id, dto);
  }
}
