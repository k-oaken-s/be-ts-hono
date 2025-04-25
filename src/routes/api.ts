import { Hono } from 'hono'
import yahooApiService from '../services/yahooApiService'

// APIルーター
const api = new Hono()

/**
 * @swagger
 * /api/morphological:
 *   post:
 *     tags:
 *       - 形態素解析
 *     summary: テキストの形態素解析を行う
 *     description: 日本語テキストを形態素（単語）に分割し、品詞情報などを提供します
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: 解析する日本語テキスト
 *                 example: これは形態素解析のテストです。
 *     responses:
 *       200:
 *         description: 形態素解析結果
 *       400:
 *         description: 無効なリクエスト
 *       500:
 *         description: サーバーエラー
 */
api.post('/morphological', async (c) => {
  try {
    const { text } = await c.req.json()
    
    if (!text || typeof text !== 'string') {
      return c.json({ error: 'テキストが指定されていないか、無効です' }, 400)
    }
    
    // Yahoo! APIが設定されていない場合はモックレスポンスを返す
    if (!process.env.YAHOO_APP_ID) {
      return c.json({
        message: 'モックレスポンス: Yahoo! APIキーが設定されていません',
        input: text,
        result: [
          { surface: '形態素', pos: '名詞', reading: 'ケイタイソ' },
          { surface: '解析', pos: '名詞', reading: 'カイセキ' }
        ]
      })
    }
    
    const result = await yahooApiService.analyzeMorphology(text)
    return c.json(result)
  } catch (error) {
    console.error('エラー:', error)
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

/**
 * @swagger
 * /api/furigana:
 *   post:
 *     tags:
 *       - ふりがな
 *     summary: 漢字にふりがなを付与する
 *     description: 日本語テキスト中の漢字にふりがなを付与します
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: ふりがなを付与する日本語テキスト
 *                 example: 漢字にふりがなを振ります。
 *     responses:
 *       200:
 *         description: ふりがな付与結果
 *       400:
 *         description: 無効なリクエスト
 *       500:
 *         description: サーバーエラー
 */
api.post('/furigana', async (c) => {
  try {
    const { text } = await c.req.json()
    
    if (!text || typeof text !== 'string') {
      return c.json({ error: 'テキストが指定されていないか、無効です' }, 400)
    }
    
    // Yahoo! APIが設定されていない場合はモックレスポンスを返す
    if (!process.env.YAHOO_APP_ID) {
      return c.json({
        message: 'モックレスポンス: Yahoo! APIキーが設定されていません',
        input: text,
        result: {
          word: [
            { surface: '漢字', furigana: 'かんじ' }
          ]
        }
      })
    }
    
    const result = await yahooApiService.addFurigana(text)
    return c.json(result)
  } catch (error) {
    console.error('エラー:', error)
    return c.json({ error: 'サーバーエラーが発生しました' }, 500)
  }
})

export default api