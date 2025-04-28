import { PrismaClient, Prisma } from '@prisma/client';
import { prisma } from './prisma';
import logger from '../logging/logger';

export interface IUnitOfWork {
  startTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
  getPrisma(): PrismaClient | Prisma.TransactionClient;
}

export class UnitOfWork implements IUnitOfWork {
  private prismaClient: PrismaClient;
  private txClient: Prisma.TransactionClient | null = null;

  constructor() {
    this.prismaClient = prisma;
  }

  async startTransaction(): Promise<void> {
    if (!this.txClient) {
      this.txClient = await this.prismaClient.$transaction(
        async (tx) => {
          // トランザクションを開始し、クライアントを保持
          return tx;
        },
        {
          maxWait: 5000, // 5秒間の最大待機時間
          timeout: 10000, // 10秒間のタイムアウト
          isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        }
      );
      logger.debug('Transaction started');
    }
  }

  async commitTransaction(): Promise<void> {
    // Prismaでは明示的なコミットはなく、トランザクションブロックの終了時に自動的にコミットされる
    this.txClient = null;
    logger.debug('Transaction committed');
  }

  async rollbackTransaction(): Promise<void> {
    // Prismaでは明示的なロールバックはなく、例外が発生するとロールバックされる
    this.txClient = null;
    logger.debug('Transaction rolled back');
  }

  getPrisma(): PrismaClient | Prisma.TransactionClient {
    return this.txClient || this.prismaClient;
  }
} 