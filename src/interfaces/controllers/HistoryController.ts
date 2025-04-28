import { Context } from 'hono';
import { GetAnalysisHistoryUseCase } from '../../application/usecases/GetAnalysisHistoryUseCase';

export class HistoryController {
  private getAnalysisHistoryUseCase: () => GetAnalysisHistoryUseCase;

  constructor(getAnalysisHistoryUseCase: () => GetAnalysisHistoryUseCase) {
    this.getAnalysisHistoryUseCase = getAnalysisHistoryUseCase;
  }

  async getHistory(c: Context): Promise<Response> {
    try {
      const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : 10;
      
      const useCase = this.getAnalysisHistoryUseCase();
      const result = await useCase.execute(limit);
      
      return c.json(result);
    } catch (error) {
      console.error('履歴取得エラー:', error);
      
      if (error instanceof Error) {
        return c.json({ error: error.message }, 500);
      }
      
      return c.json({ error: 'サーバーエラーが発生しました' }, 500);
    }
  }
} 