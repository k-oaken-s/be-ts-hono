import { prisma } from './prisma';
import logger from '../logging/logger';
import { PrismaTransactionManager } from './PrismaTransactionManager';
import { setTransactionManager } from '../../common/aop/Transactional';

export const initializeDatabase = async (): Promise<void> => {
  try {
    // データベース接続テスト
    await prisma.$connect();
    logger.info('Database connection initialized');
    
    // トランザクションマネージャーの設定
    const transactionManager = new PrismaTransactionManager();
    setTransactionManager(transactionManager);
    logger.info('Transaction manager initialized');
    
  } catch (error) {
    logger.error('Failed to initialize database', error);
    throw error;
  }
}; 