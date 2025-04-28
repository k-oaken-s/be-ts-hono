import { AnalysisHistory } from '../models/AnalysisHistory';

export interface IAnalysisHistoryRepository {
  save(analysisHistory: AnalysisHistory): Promise<AnalysisHistory>;
  findById(id: string): Promise<AnalysisHistory | null>;
  findByInputText(text: string, limit?: number): Promise<AnalysisHistory[]>;
  getRecentAnalyses(limit?: number): Promise<AnalysisHistory[]>;
} 