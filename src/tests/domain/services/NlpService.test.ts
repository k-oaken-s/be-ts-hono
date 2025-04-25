import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NlpService } from '../../../domain/services/NlpService';
import { INlpRepository } from '../../../domain/repositories/INlpRepository';
import { MorphologicalAnalysis, MorphemeToken } from '../../../domain/models/MorphologicalAnalysis';
import { Furigana, FuriganaWord } from '../../../domain/models/Furigana';
import { EmptyTextError } from '../../../domain/errors/DomainError';

// モックリポジトリの作成
class MockNlpRepository implements INlpRepository {
  async analyzeMorphology(text: string): Promise<MorphologicalAnalysis> {
    const tokens: MorphemeToken[] = [
      { surface: '形態素', pos: '名詞', reading: 'ケイタイソ' },
      { surface: '解析', pos: '名詞', reading: 'カイセキ' }
    ];
    return new MorphologicalAnalysis(tokens);
  }

  async addFurigana(text: string): Promise<Furigana> {
    const words: FuriganaWord[] = [
      { surface: '漢字', furigana: 'かんじ' }
    ];
    return new Furigana(words);
  }
}

describe('NlpService', () => {
  let nlpService: NlpService;
  let mockRepository: INlpRepository;

  beforeEach(() => {
    mockRepository = new MockNlpRepository();
    nlpService = new NlpService(mockRepository);
  });

  describe('analyzeMorphology', () => {
    it('空のテキストの場合はエラーをスローする', async () => {
      await expect(nlpService.analyzeMorphology('')).rejects.toThrow(EmptyTextError);
      await expect(nlpService.analyzeMorphology('  ')).rejects.toThrow(EmptyTextError);
    });

    it('有効なテキストの場合は形態素解析結果を返す', async () => {
      const spy = vi.spyOn(mockRepository, 'analyzeMorphology');
      const result = await nlpService.analyzeMorphology('テスト');
      
      expect(spy).toHaveBeenCalledWith('テスト');
      expect(result).toBeInstanceOf(MorphologicalAnalysis);
      expect(result.getTokens()).toHaveLength(2);
      expect(result.getTokens()[0].surface).toBe('形態素');
    });
  });

  describe('addFurigana', () => {
    it('空のテキストの場合はエラーをスローする', async () => {
      await expect(nlpService.addFurigana('')).rejects.toThrow(EmptyTextError);
      await expect(nlpService.addFurigana('  ')).rejects.toThrow(EmptyTextError);
    });

    it('有効なテキストの場合はふりがな結果を返す', async () => {
      const spy = vi.spyOn(mockRepository, 'addFurigana');
      const result = await nlpService.addFurigana('漢字');
      
      expect(spy).toHaveBeenCalledWith('漢字');
      expect(result).toBeInstanceOf(Furigana);
      expect(result.getWords()).toHaveLength(1);
      expect(result.getWords()[0].surface).toBe('漢字');
      expect(result.getWords()[0].furigana).toBe('かんじ');
    });
  });
}); 