import { DataSource } from 'typeorm';
import { AnalysisHistoryEntity } from './entities/AnalysisHistoryEntity';
import path from 'path';

// 環境に応じたデータベース設定
const isDevelopment = process.env.NODE_ENV !== 'production';
const dbPath = isDevelopment 
  ? path.join(process.cwd(), 'database.sqlite') 
  : '/tmp/database.sqlite';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbPath,
  synchronize: isDevelopment, // 開発環境のみスキーマを自動同期
  logging: isDevelopment,
  entities: [AnalysisHistoryEntity],
  migrations: [path.join(__dirname, 'migrations', '*.{ts,js}')],
});

// データベース接続の初期化
export const initializeDatabase = async (): Promise<DataSource> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('Database connection initialized');
  }
  return AppDataSource;
}; 