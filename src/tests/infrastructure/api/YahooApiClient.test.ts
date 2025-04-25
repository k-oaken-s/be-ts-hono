import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { YahooApiClient } from '../../../infrastructure/api/YahooApiClient';
import fetch from 'node-fetch';

// node-fetchのモック
vi.mock('node-fetch', () => {
  return {
    default: vi.fn()
  };
});

describe('YahooApiClient', () => {
  let client: YahooApiClient;
  const originalEnv = process.env;

  beforeEach(() => {
    // 環境変数の設定
    process.env.YAHOO_APP_ID = 'test-app-id';
    client = new YahooApiClient();
    
    // fetchのモックリセット
    vi.mocked(fetch).mockReset();
  });

  afterEach(() => {
    // 環境変数を元に戻す
    process.env = originalEnv;
  });

  describe('analyzeMorphology', () => {
    it('正しいパラメータでAPIを呼び出す', async () => {
      // fetchのモック応答を設定
      const mockResponse = {
        json: vi.fn().mockResolvedValue({
          result: {
            tokens: [
              { surface: '形態素', pos: '名詞', reading: 'ケイタイソ' }
            ]
          }
        })
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      // テスト実行
      await client.analyzeMorphology('テスト');

      // 検証
      expect(fetch).toHaveBeenCalledTimes(1);
      const [url, options] = vi.mocked(fetch).mock.calls[0];
      expect(url).toContain('https://jlp.yahooapis.jp/MAService/V2/parse');
      expect(url).toContain('appid=test-app-id');
      expect(options.method).toBe('POST');
      expect(options.headers).toEqual({ 'Content-Type': 'application/json' });
      
      const body = JSON.parse(options.body as string);
      expect(body.params.q).toBe('テスト');
    });

    it('APIエラーの場合は適切なエラーをスローする', async () => {
      // fetchがエラーをスローするように設定
      vi.mocked(fetch).mockRejectedValue(new Error('API error'));

      // テスト実行と検証
      await expect(client.analyzeMorphology('テスト')).rejects.toThrow('形態素解析の実行中にエラーが発生しました');
    });
  });

  describe('addFurigana', () => {
    it('正しいパラメータでAPIを呼び出す', async () => {
      // fetchのモック応答を設定
      const mockResponse = {
        json: vi.fn().mockResolvedValue({
          result: {
            word: [
              { surface: '漢字', furigana: 'かんじ' }
            ]
          }
        })
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      // テスト実行
      await client.addFurigana('漢字');

      // 検証
      expect(fetch).toHaveBeenCalledTimes(1);
      const [url, options] = vi.mocked(fetch).mock.calls[0];
      expect(url).toContain('https://jlp.yahooapis.jp/FuriganaService/V2/furigana');
      expect(url).toContain('appid=test-app-id');
      expect(options.method).toBe('POST');
      expect(options.headers).toEqual({ 'Content-Type': 'application/json' });
      
      const body = JSON.parse(options.body as string);
      expect(body.params.q).toBe('漢字');
    });

    it('APIエラーの場合は適切なエラーをスローする', async () => {
      // fetchがエラーをスローするように設定
      vi.mocked(fetch).mockRejectedValue(new Error('API error'));

      // テスト実行と検証
      await expect(client.addFurigana('漢字')).rejects.toThrow('ふりがな付与中にエラーが発生しました');
    });
  });
}); 