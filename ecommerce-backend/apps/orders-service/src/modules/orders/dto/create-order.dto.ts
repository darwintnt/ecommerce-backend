import { Type } from 'class-transformer';
import {
  IsArray,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  customerId!: string;

  @IsNotEmpty()
  @IsDecimal()
  totalAmount!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems?: OrderItemDto[];
}
