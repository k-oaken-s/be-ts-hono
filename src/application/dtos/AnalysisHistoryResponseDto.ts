import { AnalysisType } from '../../domain/models/AnalysisHistory';

export interface AnalysisHistoryItemDto {
  id: string;
  inputText: string;
  analysisType: AnalysisType;
  result: any;
  createdAt: string;
}

export interface AnalysisHistoryResponseDto {
  count: number;
  histories: AnalysisHistoryItemDto[];
} 