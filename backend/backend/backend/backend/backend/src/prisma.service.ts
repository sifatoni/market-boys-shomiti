import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  public async $connect() {
    return await this.prisma.$connect();
  }

  public async $disconnect() {
    return await this.prisma.$disconnect();
  }

  public prisma = new PrismaClient();
}
