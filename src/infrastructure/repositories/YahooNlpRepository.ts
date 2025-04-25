import { INlpRepository } from '../../domain/repositories/INlpRepository';
import { MorphologicalAnalysis, MorphemeToken } from '../../domain/models/MorphologicalAnalysis';
import { Furigana, FuriganaWord } from '../../domain/models/Furigana';
import { YahooApiClient } from '../api/YahooApiClient';

export class YahooNlpRepository implements INlpRepository {
  private apiClient: YahooApiClient;

  constructor() {
    this.apiClient = new YahooApiClient();
  }

  async analyzeMorphology(text: string): Promise<MorphologicalAnalysis> {
    // Yahoo! APIが設定されていない場合はモックデータを返す
    if (!process.env.YAHOO_APP_ID) {
      console.warn('モックデータを使用: Yahoo! APIキーが設定されていません');
      const mockTokens: MorphemeToken[] = [
        { surface: '形態素', pos: '名詞', reading: 'ケイタイソ' },
        { surface: '解析', pos: '名詞', reading: 'カイセキ' }
      ];
      return new MorphologicalAnalysis(mockTokens);
    }

    try {
      const response = await this.apiClient.analyzeMorphology(text);
      
      // Yahoo APIのレスポンスをドメインモデルに変換
      const tokens: MorphemeToken[] = this.mapYahooResponseToMorphemeTokens(response);
      
      return new MorphologicalAnalysis(tokens);
    } catch (error) {
      console.error('形態素解析エラー:', error);
      throw error;
    }
  }

  async addFurigana(text: string): Promise<Furigana> {
    // Yahoo! APIが設定されていない場合はモックデータを返す
    if (!process.env.YAHOO_APP_ID) {
      console.warn('モックデータを使用: Yahoo! APIキーが設定されていません');
      const mockWords: FuriganaWord[] = [
        { surface: '漢字', furigana: 'かんじ' }
      ];
      return new Furigana(mockWords);
    }

    try {
      const response = await this.apiClient.addFurigana(text);
      
      // Yahoo APIのレスポンスをドメインモデルに変換
      const words: FuriganaWord[] = this.mapYahooResponseToFuriganaWords(response);
      
      return new Furigana(words);
    } catch (error) {
      console.error('ふりがな付与エラー:', error);
      throw error;
    }
  }

  private mapYahooResponseToMorphemeTokens(response: any): MorphemeToken[] {
    try {
      // Yahoo形態素解析APIのレスポンス構造に合わせて実装
      if (response && response.result && Array.isArray(response.result.tokens)) {
        return response.result.tokens.map((token: any) => ({
          surface: token.surface || '',
          pos: token.pos || '',
          reading: token.reading || ''
        }));
      }
      
      // 結果が期待した形式でない場合はエラーログを出力し、空配列を返す
      console.error('Yahoo API形態素解析レスポンスの形式が不正:', response);
      return [];
    } catch (error) {
      console.error('Yahoo API形態素解析レスポンスのマッピングエラー:', error);
      return [];
    }
  }

  private mapYahooResponseToFuriganaWords(response: any): FuriganaWord[] {
    try {
      // Yahooふりがな付与APIのレスポンス構造に合わせて実装
      if (response && response.result && response.result.word && Array.isArray(response.result.word)) {
        return response.result.word.map((word: any) => ({
          surface: word.surface || '',
          furigana: word.furigana || word.surface || ''
        }));
      }
      
      // 結果が期待した形式でない場合はエラーログを出力し、空配列を返す
      console.error('Yahoo APIふりがなレスポンスの形式が不正:', response);
      return [];
    } catch (error) {
      console.error('Yahoo APIふりがなレスポンスのマッピングエラー:', error);
      return [];
    }
  }
} 