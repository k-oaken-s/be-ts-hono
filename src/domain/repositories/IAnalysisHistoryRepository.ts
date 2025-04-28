import { AnalysisHistory } from '../models/AnalysisHistory';

export interface IAnalysisHistoryRepository {
  save(client: any, analysisHistory: AnalysisHistory): Promise<AnalysisHistory>;

  findById(client: any, id: string): Promise<AnalysisHistory | null>;

  findByInputText(client: any, text: string, limit?: number): Promise<AnalysisHistory[]>;

  getRecentAnalyses(client: any, limit?: number): Promise<AnalysisHistory[]>;
}
