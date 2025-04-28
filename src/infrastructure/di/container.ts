import { YahooNlpRepository } from '../repositories/YahooNlpRepository';
import { NlpService } from '../../domain/services/NlpService';
import { AnalyzeMorphologyUseCase } from '../../application/usecases/AnalyzeMorphologyUseCase';
import { AnalyzeMorphologyWithHistoryUseCase } from '../../application/usecases/AnalyzeMorphologyWithHistoryUseCase';
import { AddFuriganaUseCase } from '../../application/usecases/AddFuriganaUseCase';
import { GetAnalysisHistoryUseCase } from '../../application/usecases/GetAnalysisHistoryUseCase';
import { NlpController } from '../../interfaces/controllers/NlpController';
import { HistoryController } from '../../interfaces/controllers/HistoryController';
import { UnitOfWork } from '../database/UnitOfWork';
import { initializeDatabase } from '../database/initialize';

export class Container {
  private static instance: Container;
  private services: Map<string, any> = new Map();
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // データベース接続の初期化
    await initializeDatabase();
    
    // リポジトリの登録
    this.services.set('nlpRepository', new YahooNlpRepository());
    
    // ドメインサービスの登録
    this.services.set('nlpService', new NlpService(this.get('nlpRepository')));
    
    // Unit of Workの登録
    this.services.set('unitOfWork', () => new UnitOfWork());
    
    // ユースケースの登録
    this.services.set('analyzeMorphologyUseCase', new AnalyzeMorphologyUseCase(this.get('nlpService')));
    this.services.set('analyzeMorphologyWithHistoryUseCase', 
      () => new AnalyzeMorphologyWithHistoryUseCase(this.get('nlpService'), this.get('unitOfWork')()));
    this.services.set('addFuriganaUseCase', new AddFuriganaUseCase(this.get('nlpService')));
    this.services.set('getAnalysisHistoryUseCase', 
      () => new GetAnalysisHistoryUseCase(this.get('unitOfWork')()));
    
    // コントローラーの登録
    this.services.set('nlpController', new NlpController(
      this.get('analyzeMorphologyWithHistoryUseCase'),
      this.get('addFuriganaUseCase')
    ));
    this.services.set('historyController', new HistoryController(
      this.get('getAnalysisHistoryUseCase')
    ));

    this.initialized = true;
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found in container`);
    }
    
    // ファクトリ関数の場合は実行して新しいインスタンスを返す
    if (typeof service === 'function') {
      return service();
    }
    
    return service as T;
  }
}

// 使用例
export const container = Container.getInstance(); 