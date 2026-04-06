import { Injectable } from '@nestjs/common';
import { IProductsRepository } from './interfaces/products.repository.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginatedResult } from 'libs/commons/pagination.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ProductsRepository implements IProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Product>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count(),
    ]);

    return {
      data: data as unknown as Product[],
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Product | null> {
    const item = await this.prisma.product.findUnique({
      where: { id },
    });
    return item ? (item as unknown as Product) : null;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const item = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        sku: `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      },
    });
    return item as unknown as Product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product | null> {
    try {
      const item = await this.prisma.product.update({
        where: { id },
        data: { ...dto },
      });
      return item as unknown as Product;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async decrementStock(productId: string, quantity: number): Promise<boolean> {
    try {
      // Actualización atómica del stock usando Prisma
      const result = await this.prisma.product.updateMany({
        where: {
          id: productId,
          stock: {
            gte: quantity, // Solo actualizar si hay suficiente stock
          },
        },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      });

      // result.count será 1 si se actualizó, 0 si no había suficiente stock
      return result.count > 0;
    } catch (error) {
      console.error(
        `Error decrementing stock for product ${productId}:`,
        error,
      );
      return false;
    }
  }
}
