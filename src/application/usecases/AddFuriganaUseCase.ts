import { NlpService } from '../../domain/services/NlpService';
import { FuriganaRequestDto } from '../dtos/FuriganaRequestDto';
import { FuriganaResponseDto } from '../dtos/FuriganaResponseDto';
import { DomainError, EmptyTextError } from '../../domain/errors/DomainError';

export class AddFuriganaUseCase {
  private nlpService: NlpService;

  constructor(nlpService: NlpService) {
    this.nlpService = nlpService;
  }

  async execute(request: FuriganaRequestDto): Promise<FuriganaResponseDto> {
    try {
      const furigana = await this.nlpService.addFurigana(request.text);
      
      return {
        input: request.text,
        result: {
          word: furigana.getWords()
        }
      };
    } catch (error) {
      if (error instanceof EmptyTextError) {
        throw new Error('テキストが指定されていないか、空です');
      }
      if (error instanceof DomainError) {
        throw new Error(`ふりがな付与中にエラーが発生しました: ${error.message}`);
      }
      throw new Error('ふりがな付与中に不明なエラーが発生しました');
    }
  }
} 