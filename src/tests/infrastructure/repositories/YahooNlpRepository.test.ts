import { describe, it, expect, vi, beforeEach } from 'vitest';
import { YahooNlpRepository } from '../../../infrastructure/repositories/YahooNlpRepository';
import { YahooApiClient } from '../../../infrastructure/api/YahooApiClient';
import { MorphologicalAnalysis } from '../../../domain/models/MorphologicalAnalysis';
import { Furigana } from '../../../domain/models/Furigana';

// YahooApiClientのモック
vi.mock('../../../infrastructure/api/YahooApiClient', () => {
  return {
    YahooApiClient: vi.fn().mockImplementation(() => ({
      analyzeMorphology: vi.fn(),
      addFurigana: vi.fn()
    }))
  };
});

describe('YahooNlpRepository', () => {
  let repository: YahooNlpRepository;
  let mockApiClient: YahooApiClient;
  const originalEnv = process.env;

  beforeEach(() => {
    // 環境変数の設定
    process.env.YAHOO_APP_ID = 'test-app-id';
    
    // モックのリセット
    vi.clearAllMocks();
    
    // リポジトリの作成とモックの取得
    repository = new YahooNlpRepository();
    mockApiClient = (repository as any).apiClient;
  });

  afterEach(() => {
    // 環境変数を元に戻す
    process.env = originalEnv;
  });

  describe('analyzeMorphology', () => {
    it('APIキーが設定されている場合はAPIを呼び出す', async () => {
      // モックの戻り値を設定
      const mockResponse = {
        result: {
          tokens: [
            { surface: '形態素', pos: '名詞', reading: 'ケイタイソ' }
          ]
        }
      };
      vi.mocked(mockApiClient.analyzeMorphology).mockResolvedValue(mockResponse);

      // テスト実行
      const result = await repository.analyzeMorphology('テスト');

      // 検証
      expect(mockApiClient.analyzeMorphology).toHaveBeenCalledWith('テスト');
      expect(result).toBeInstanceOf(MorphologicalAnalysis);
      expect(result.getTokens()).toHaveLength(1);
      expect(result.getTokens()[0].surface).toBe('形態素');
    });

    it('APIキーが設定されていない場合はモックデータを返す', async () => {
      // 環境変数を削除
      delete process.env.YAHOO_APP_ID;

      // テスト実行
      const result = await repository.analyzeMorphology('テスト');

      // 検証
      expect(mockApiClient.analyzeMorphology).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(MorphologicalAnalysis);
      expect(result.getTokens()).toHaveLength(2);
      expect(result.getTokens()[0].surface).toBe('形態素');
    });

    it('APIエラーの場合はエラーを伝播する', async () => {
      // モックがエラーをスローするように設定
      const error = new Error('API error');
      vi.mocked(mockApiClient.analyzeMorphology).mockRejectedValue(error);

      // テスト実行と検証
      await expect(repository.analyzeMorphology('テスト')).rejects.toThrow('API error');
    });
  });

  describe('addFurigana', () => {
    it('APIキーが設定されている場合はAPIを呼び出す', async () => {
      // モックの戻り値を設定
      const mockResponse = {
        result: {
          word: [
            { surface: '漢字', furigana: 'かんじ' }
          ]
        }
      };
      vi.mocked(mockApiClient.addFurigana).mockResolvedValue(mockResponse);

      // テスト実行
      const result = await repository.addFurigana('漢字');

      // 検証
      expect(mockApiClient.addFurigana).toHaveBeenCalledWith('漢字');
      expect(result).toBeInstanceOf(Furigana);
      expect(result.getWords()).toHaveLength(1);
      expect(result.getWords()[0].surface).toBe('漢字');
      expect(result.getWords()[0].furigana).toBe('かんじ');
    });

    it('APIキーが設定されていない場合はモックデータを返す', async () => {
      // 環境変数を削除
      delete process.env.YAHOO_APP_ID;

      // テスト実行
      const result = await repository.addFurigana('漢字');

      // 検証
      expect(mockApiClient.addFurigana).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(Furigana);
      expect(result.getWords()).toHaveLength(1);
      expect(result.getWords()[0].surface).toBe('漢字');
      expect(result.getWords()[0].furigana).toBe('かんじ');
    });

    it('APIエラーの場合はエラーを伝播する', async () => {
      // モックがエラーをスローするように設定
      const error = new Error('API error');
      vi.mocked(mockApiClient.addFurigana).mockRejectedValue(error);

      // テスト実行と検証
      await expect(repository.addFurigana('漢字')).rejects.toThrow('API error');
    });
  });
}); 