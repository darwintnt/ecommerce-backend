import {
  Injectable,
  Logger,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, of } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { OrderItemDto } from './dto/order-item.dto';

interface ProductResponse {
  id: string;
  name: string;
  stock: number;
  price: string;
}

@Injectable()
export class ProductsValidationService {
  private readonly logger = new Logger(ProductsValidationService.name);
  private readonly productsServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.productsServiceUrl =
      this.configService.get<string>('PRODUCTS_SERVICE_URL') ||
      'http://products_service:3000';
    this.logger.log(
      `ProductsValidationService initialized with URL: ${this.productsServiceUrl}`,
    );
  }

  /**
   * Valida que todos los productos existan y tengan stock suficiente
   * @param orderItems - Items de la orden a validar
   * @throws BadRequestException si algún producto no existe o no tiene stock
   */
  async validateProductsAndStock(
    orderItems: OrderItemDto[],
  ): Promise<Map<string, ProductResponse>> {
    this.logger.log(
      `Validating ${orderItems.length} products for order creation`,
    );

    const productMap = new Map<string, ProductResponse>();
    const errors: string[] = [];

    // Validar cada producto en paralelo
    const validationPromises = orderItems.map(async (item) => {
      try {
        const product = await this.getProductById(item.productId);

        // Validar existencia
        if (!product) {
          errors.push(`Product with ID "${item.productId}" not found`);
          return;
        }

        // Validar stock suficiente
        if (product.stock < item.quantity) {
          errors.push(
            `Product "${product.name}" (ID: ${item.productId}) has insufficient stock. Available: ${product.stock}, Requested: ${item.quantity}`,
          );
          return;
        }

        productMap.set(item.productId, product);
        this.logger.log(
          `Product ${item.productId} validated successfully. Stock: ${product.stock}, Requested: ${item.quantity}`,
        );
      } catch (error) {
        this.logger.error(`Error validating product ${item.productId}:`, error);
        errors.push(
          `Failed to validate product ${item.productId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    });

    await Promise.all(validationPromises);

    // Si hay errores, lanzar excepción con todos los detalles
    if (errors.length > 0) {
      const errorMessage = `Order validation failed:\n${errors.join('\n')}`;
      this.logger.error(errorMessage);
      throw new BadRequestException({
        message: 'Order validation failed',
        errors: errors,
      });
    }

    this.logger.log('All products validated successfully');
    return productMap;
  }

  /**
   * Obtiene un producto por ID desde el servicio de productos
   * @param productId - ID del producto
   * @returns Datos del producto o null si no existe
   */
  private async getProductById(
    productId: string,
  ): Promise<ProductResponse | null> {
    const url = `${this.productsServiceUrl}/products/${productId}`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<ProductResponse>(url).pipe(
          catchError((error: AxiosError) => {
            if (error.response?.status === 404) {
              this.logger.warn(`Product ${productId} not found (404)`);
              return of({
                data: null,
              } as AxiosResponse<ProductResponse | null>);
            }

            this.logger.error(
              `HTTP error calling Products Service for ${productId}:`,
              {
                status: error.response?.status,
                message: error.message,
                url,
              },
            );

            throw new HttpException(
              `Failed to validate product ${productId}: ${error.message}`,
              error.response?.status || 500,
            );
          }),
        ),
      );

      return data;
    } catch (error) {
      this.logger.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  }
}
