import { NlpService } from '../../domain/services/NlpService';
import { MorphologicalRequestDto } from '../dtos/MorphologicalRequestDto';
import { MorphologicalResponseDto } from '../dtos/MorphologicalResponseDto';
import { DomainError, EmptyTextError } from '../../domain/errors/DomainError';
import { IUnitOfWork } from '../../infrastructure/database/UnitOfWork';
import { AnalysisHistoryRepository } from '../../infrastructure/repositories/AnalysisHistoryRepository';
import { AnalysisHistory } from '../../domain/models/AnalysisHistory';

export class AnalyzeMorphologyWithHistoryUseCase {
  private nlpService: NlpService;
  private unitOfWork: IUnitOfWork;

  constructor(nlpService: NlpService, unitOfWork: IUnitOfWork) {
    this.nlpService = nlpService;
    this.unitOfWork = unitOfWork;
  }

  async execute(request: MorphologicalRequestDto): Promise<MorphologicalResponseDto> {
    try {
      // 1. 形態素解析を実行
      const morphologicalAnalysis = await this.nlpService.analyzeMorphology(request.text);
      const tokens = morphologicalAnalysis.getTokens();
      
      // 2. 結果をDTOに変換
      const responseDto: MorphologicalResponseDto = {
        input: request.text,
        result: tokens
      };
      
      // 3. 履歴を保存
      const historyRepository = new AnalysisHistoryRepository(this.unitOfWork);
      const analysisHistory = AnalysisHistory.createMorphologyAnalysis(request.text, tokens);
      await historyRepository.save(analysisHistory);
      
      return responseDto;
    } catch (error) {
      if (error instanceof EmptyTextError) {
        throw new Error('テキストが指定されていないか、空です');
      }
      if (error instanceof DomainError) {
        throw new Error(`形態素解析の実行中にエラーが発生しました: ${error.message}`);
      }
      throw new Error('形態素解析の実行中に不明なエラーが発生しました');
    }
  }
} 