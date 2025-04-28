import { prisma } from './prisma';
import logger from '../logging/logger';

export const initializeDatabase = async (): Promise<void> => {
  try {
    // データベース接続テスト
    await prisma.$connect();
    logger.info('Database connection initialized');
    
    // 必要に応じて初期データの投入などを行う
    
  } catch (error) {
    logger.error('Failed to initialize database', error);
    throw error;
  }
}; 