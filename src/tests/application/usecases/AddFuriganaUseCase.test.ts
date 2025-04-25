import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddFuriganaUseCase } from '../../../application/usecases/AddFuriganaUseCase';
import { NlpService } from '../../../domain/services/NlpService';
import { Furigana, FuriganaWord } from '../../../domain/models/Furigana';
import { EmptyTextError } from '../../../domain/errors/DomainError';

describe('AddFuriganaUseCase', () => {
  let useCase: AddFuriganaUseCase;
  let mockNlpService: NlpService;

  beforeEach(() => {
    // NlpServiceのモック作成
    mockNlpService = {
      analyzeMorphology: vi.fn(),
      addFurigana: vi.fn()
    } as unknown as NlpService;

    useCase = new AddFuriganaUseCase(mockNlpService);
  });

  it('有効なテキストの場合はふりがな結果を返す', async () => {
    // モックの戻り値を設定
    const mockWords: FuriganaWord[] = [
      { surface: '漢字', furigana: 'かんじ' }
    ];
    const mockFurigana = new Furigana(mockWords);
    vi.mocked(mockNlpService.addFurigana).mockResolvedValue(mockFurigana);

    // テスト実行
    const result = await useCase.execute({ text: '漢字' });

    // 検証
    expect(mockNlpService.addFurigana).toHaveBeenCalledWith('漢字');
    expect(result).toEqual({
      input: '漢字',
      result: {
        word: mockWords
      }
    });
  });

  it('NlpServiceがEmptyTextErrorをスローした場合は適切なエラーメッセージを返す', async () => {
    // モックがエラーをスローするように設定
    vi.mocked(mockNlpService.addFurigana).mockRejectedValue(new EmptyTextError());

    // テスト実行と検証
    await expect(useCase.execute({ text: '' })).rejects.toThrow('テキストが指定されていないか、空です');
  });

  it('その他のエラーの場合は一般的なエラーメッセージを返す', async () => {
    // モックが一般的なエラーをスローするように設定
    vi.mocked(mockNlpService.addFurigana).mockRejectedValue(new Error('一般的なエラー'));

    // テスト実行と検証
    await expect(useCase.execute({ text: '漢字' })).rejects.toThrow('ふりがな付与中にエラーが発生しました: 一般的なエラー');
  });
}); 