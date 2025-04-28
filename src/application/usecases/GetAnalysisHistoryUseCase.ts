import { IUnitOfWork } from '../../infrastructure/database/UnitOfWork';
import { AnalysisHistoryRepository } from '../../infrastructure/repositories/AnalysisHistoryRepository';
import { AnalysisHistoryResponseDto } from '../dtos/AnalysisHistoryResponseDto';

export class GetAnalysisHistoryUseCase {
  private unitOfWork: IUnitOfWork;

  constructor(unitOfWork: IUnitOfWork) {
    this.unitOfWork = unitOfWork;
  }

  async execute(limit: number = 10): Promise<AnalysisHistoryResponseDto> {
    try {
      const historyRepository = new AnalysisHistoryRepository(this.unitOfWork);
      const histories = await historyRepository.getRecentAnalyses(limit);
      
      return {
        count: histories.length,
        histories: histories.map(history => ({
          id: history.id!,
          inputText: history.inputText,
          analysisType: history.analysisType,
          result: history.result,
          createdAt: history.createdAt.toISOString()
        }))
      };
    } catch (error) {
      console.error('履歴取得エラー:', error);
      throw new Error('分析履歴の取得中にエラーが発生しました');
    }
  }
} 