import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyzeMorphologyUseCase } from '../../../application/usecases/AnalyzeMorphologyUseCase';
import { NlpService } from '../../../domain/services/NlpService';
import { MorphologicalAnalysis, MorphemeToken } from '../../../domain/models/MorphologicalAnalysis';
import { EmptyTextError } from '../../../domain/errors/DomainError';

describe('AnalyzeMorphologyUseCase', () => {
  let useCase: AnalyzeMorphologyUseCase;
  let mockNlpService: NlpService;

  beforeEach(() => {
    // NlpServiceのモック作成
    mockNlpService = {
      analyzeMorphology: vi.fn(),
      addFurigana: vi.fn()
    } as unknown as NlpService;

    useCase = new AnalyzeMorphologyUseCase(mockNlpService);
  });

  it('有効なテキストの場合は形態素解析結果を返す', async () => {
    // モックの戻り値を設定
    const mockTokens: MorphemeToken[] = [
      { surface: '形態素', pos: '名詞', reading: 'ケイタイソ' },
      { surface: '解析', pos: '名詞', reading: 'カイセキ' }
    ];
    const mockAnalysis = new MorphologicalAnalysis(mockTokens);
    vi.mocked(mockNlpService.analyzeMorphology).mockResolvedValue(mockAnalysis);

    // テスト実行
    const result = await useCase.execute({ text: 'テスト' });

    // 検証
    expect(mockNlpService.analyzeMorphology).toHaveBeenCalledWith('テスト');
    expect(result).toEqual({
      input: 'テスト',
      result: mockTokens
    });
  });

  it('NlpServiceがEmptyTextErrorをスローした場合は適切なエラーメッセージを返す', async () => {
    // モックがエラーをスローするように設定
    vi.mocked(mockNlpService.analyzeMorphology).mockRejectedValue(new EmptyTextError());

    // テスト実行と検証
    await expect(useCase.execute({ text: '' })).rejects.toThrow('テキストが指定されていないか、空です');
  });

  it('その他のエラーの場合は一般的なエラーメッセージを返す', async () => {
    // モックが一般的なエラーをスローするように設定
    vi.mocked(mockNlpService.analyzeMorphology).mockRejectedValue(new Error('一般的なエラー'));

    // テスト実行と検証
    await expect(useCase.execute({ text: 'テスト' })).rejects.toThrow('形態素解析の実行中にエラーが発生しました: 一般的なエラー');
  });
}); 