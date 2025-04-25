import { NlpService } from '../../domain/services/NlpService';
import { MorphologicalRequestDto } from '../dtos/MorphologicalRequestDto';
import { MorphologicalResponseDto } from '../dtos/MorphologicalResponseDto';
import { DomainError, EmptyTextError } from '../../domain/errors/DomainError';

export class AnalyzeMorphologyUseCase {
  private nlpService: NlpService;

  constructor(nlpService: NlpService) {
    this.nlpService = nlpService;
  }

  async execute(request: MorphologicalRequestDto): Promise<MorphologicalResponseDto> {
    try {
      const morphologicalAnalysis = await this.nlpService.analyzeMorphology(request.text);
      
      return {
        input: request.text,
        result: morphologicalAnalysis.getTokens()
      };
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