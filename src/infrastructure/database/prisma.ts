import { PrismaClient } from '@prisma/client';
import logger from '../logging/logger';

// シングルトンパターンでPrismaClientを管理
class PrismaManager {
  private static instance: PrismaManager;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // SQLクエリのログ出力
    this.prisma.$on('query', (e) => {
      logger.debug(`Query: ${e.query}`);
      logger.debug(`Params: ${e.params}`);
      logger.debug(`Duration: ${e.duration}ms`);
    });

    // エラーのログ出力
    this.prisma.$on('error', (e) => {
      logger.error(`Prisma Error: ${e.message}`);
    });
  }

  public static getInstance(): PrismaManager {
    if (!PrismaManager.instance) {
      PrismaManager.instance = new PrismaManager();
    }
    return PrismaManager.instance;
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export const prisma = PrismaManager.getInstance().getClient(); 