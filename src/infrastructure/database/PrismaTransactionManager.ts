import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from './prisma';
import logger from '../logging/logger';
import { TransactionManager, TransactionClient } from '../../common/aop/Transactional';

// Prisma用のトランザクションマネージャー
export class PrismaTransactionManager implements TransactionManager {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = prisma;
  }

  async runInTransaction<T>(
    callback: (client: TransactionClient) => Promise<T>,
    options: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: any;
    } = {},
  ): Promise<T> {
    const defaultOptions = {
      maxWait: 5000,
      timeout: 10000,
      isolationLevel: 'ReadCommitted' as any,
    };

    const txOptions = { ...defaultOptions, ...options };

    try {
      logger.debug('Starting transaction');

      const result = await this.prismaClient.$transaction(async tx => {
        return await callback(tx);
      }, txOptions);

      logger.debug('Transaction completed successfully');
      return result;
    } catch (error) {
      logger.error('Transaction failed', error);
      throw error;
    }
  }
}
