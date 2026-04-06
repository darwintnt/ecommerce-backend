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
  ORDERS_SERVICE,
  type IOrdersService,
} from './interfaces/orders.service.interface';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginatedResult, PaginationDto } from 'libs/commons/pagination.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDERS_SERVICE)
    private readonly ordersService: IOrdersService,
  ) {}

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Order>> {
    return await this.ordersService.findAll(paginationDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateOrderDto): Promise<Order> {
    return await this.ordersService.create(payload);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<Order> {
    return await this.ordersService.update(id, dto);
  }
}
