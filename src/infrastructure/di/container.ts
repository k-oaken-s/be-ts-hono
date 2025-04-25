import { YahooNlpRepository } from '../repositories/YahooNlpRepository';
import { NlpService } from '../../domain/services/NlpService';
import { AnalyzeMorphologyUseCase } from '../../application/usecases/AnalyzeMorphologyUseCase';
import { AddFuriganaUseCase } from '../../application/usecases/AddFuriganaUseCase';
import { NlpController } from '../../interfaces/controllers/NlpController';

export class Container {
  private static instance: Container;
  private services: Map<string, any> = new Map();

  private constructor() {
    // リポジトリの登録
    this.services.set('nlpRepository', new YahooNlpRepository());
    
    // ドメインサービスの登録
    this.services.set('nlpService', new NlpService(this.get('nlpRepository')));
    
    // ユースケースの登録
    this.services.set('analyzeMorphologyUseCase', new AnalyzeMorphologyUseCase(this.get('nlpService')));
    this.services.set('addFuriganaUseCase', new AddFuriganaUseCase(this.get('nlpService')));
    
    // コントローラーの登録
    this.services.set('nlpController', new NlpController(
      this.get('analyzeMorphologyUseCase'),
      this.get('addFuriganaUseCase')
    ));
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found in container`);
    }
    return service as T;
  }
}

// 使用例
export const container = Container.getInstance(); 