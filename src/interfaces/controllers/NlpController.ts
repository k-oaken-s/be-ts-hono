import { Context } from 'hono';
import { AnalyzeMorphologyWithHistoryUseCase } from '../../application/usecases/AnalyzeMorphologyWithHistoryUseCase';
import { AddFuriganaUseCase } from '../../application/usecases/AddFuriganaUseCase';
import { MorphologicalRequestDto } from '../../application/dtos/MorphologicalRequestDto';
import { FuriganaRequestDto } from '../../application/dtos/FuriganaRequestDto';

export class NlpController {
  private analyzeMorphologyUseCase: AnalyzeMorphologyWithHistoryUseCase;
  private addFuriganaUseCase: AddFuriganaUseCase;

  constructor(
    analyzeMorphologyUseCase: AnalyzeMorphologyWithHistoryUseCase,
    addFuriganaUseCase: AddFuriganaUseCase
  ) {
    this.analyzeMorphologyUseCase = analyzeMorphologyUseCase;
    this.addFuriganaUseCase = addFuriganaUseCase;
  }

  async analyzeMorphology(c: Context): Promise<Response> {
    try {
      const body = await c.req.json<MorphologicalRequestDto>();
      
      // トランザクションデコレータが処理するため、nullを渡す
      const result = await this.analyzeMorphologyUseCase.execute(null, body);
      
      return c.json(result);
    } catch (error) {
      console.error('形態素解析エラー:', error);
      
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      
      return c.json({ error: 'サーバーエラーが発生しました' }, 500);
    }
  }

  async addFurigana(c: Context): Promise<Response> {
    try {
      const body = await c.req.json();
      
      if (!body || typeof body !== 'object') {
        return c.json({ error: 'リクエストボディが無効です' }, 400);
      }
      
      const { text } = body as FuriganaRequestDto;
      
      if (!text || typeof text !== 'string') {
        return c.json({ error: 'テキストが指定されていないか、無効です' }, 400);
      }
      
      const result = await this.addFuriganaUseCase.execute({ text });
      return c.json(result);
    } catch (error) {
      console.error('ふりがな付与エラー:', error);
      
      // JSONパースエラーの処理
      if (error instanceof SyntaxError) {
        return c.json({ error: 'JSONの形式が無効です' }, 400);
      }
      
      if (error instanceof Error) {
        // エラーメッセージに基づいてステータスコードを決定
        const statusCode = error.message.includes('テキストが指定されていない') ? 400 : 500;
        return c.json({ error: error.message }, statusCode);
      }
      
      return c.json({ error: 'サーバーエラーが発生しました' }, 500);
    }
  }
} 