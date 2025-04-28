import { AnalysisHistoryRepository } from '../../infrastructure/repositories/AnalysisHistoryRepository';
import { AnalysisHistoryResponseDto } from '../dtos/AnalysisHistoryResponseDto';
import { Transactional } from '../../common/aop/Transactional';

export class GetAnalysisHistoryUseCase {
  private historyRepository: AnalysisHistoryRepository;

  constructor() {
    this.historyRepository = new AnalysisHistoryRepository();
  }

  @Transactional()
  async execute(
    tx: any, // 型を抽象化
    limit: number = 10,
  ): Promise<AnalysisHistoryResponseDto> {
    try {
      const histories = await this.historyRepository.getRecentAnalyses(tx, limit);

      return {
        count: histories.length,
        histories: histories.map(history => ({
          id: history.id!,
          inputText: history.inputText,
          analysisType: history.analysisType,
          result: history.result,
          createdAt: history.createdAt.toISOString(),
        })),
      };
    } catch (error) {
      console.error('履歴取得エラー:', error);
      throw new Error('分析履歴の取得中にエラーが発生しました');
    }
  }
}
