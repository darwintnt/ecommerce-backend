import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Prisma, PrismaClient } from '../../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prismaClient: PrismaClient;
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL as string;
    this.pool = new Pool({
      connectionString,
    });

    const adapter = new PrismaPg(this.pool);

    this.prismaClient = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  get client(): PrismaClient {
    return this.prismaClient;
  }

  // Expose Prisma Client models for the orders-service
  get order() {
    return this.prismaClient.order;
  }

  get orderItem() {
    return this.prismaClient.orderItem;
  }

  $transaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prismaClient.$transaction(fn);
  }

  async onModuleInit(): Promise<void> {
    await this.prismaClient.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.prismaClient.$disconnect();
    await this.pool.end();
  }
}
