import fetch from 'node-fetch';

export class YahooApiClient {
  private appId: string;

  constructor() {
    this.appId = process.env.YAHOO_APP_ID || '';
    if (!this.appId) {
      console.warn('警告: YAHOO_APP_ID環境変数が設定されていません');
    }
  }

  async analyzeMorphology(text: string): Promise<any> {
    try {
      const url = `https://jlp.yahooapis.jp/MAService/V2/parse?appid=${this.appId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 'request1',
          jsonrpc: '2.0',
          method: 'jlp.maservice.parse',
          params: {
            q: text
          }
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Yahoo API呼び出しエラー:', error);
      throw new Error('形態素解析の実行中にエラーが発生しました');
    }
  }

  async addFurigana(text: string): Promise<any> {
    try {
      const url = `https://jlp.yahooapis.jp/FuriganaService/V2/furigana?appid=${this.appId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 'request1',
          jsonrpc: '2.0',
          method: 'jlp.furiganaservice.furigana',
          params: {
            q: text
          }
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Yahoo API呼び出しエラー:', error);
      throw new Error('ふりがな付与中にエラーが発生しました');
    }
  }
} 