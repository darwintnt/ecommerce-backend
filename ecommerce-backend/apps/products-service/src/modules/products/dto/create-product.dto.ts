/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  price!: string;

  @IsNotEmpty()
  @IsNumber()
  stock!: number;
}
