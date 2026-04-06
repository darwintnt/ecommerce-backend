import {
  IsArray,
  IsDecimal,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { OrderItemDto } from './order-item.dto';
import { Type } from 'class-transformer';

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsDecimal()
  totalAmount!: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems?: OrderItemDto[];
}
