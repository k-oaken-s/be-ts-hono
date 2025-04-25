import { Hono } from 'hono';
import { container } from '../../infrastructure/di/container';
import { NlpController } from '../controllers/NlpController';

// DIコンテナからコントローラーを取得
const nlpController = container.get<NlpController>('nlpController');

// APIルーター
const api = new Hono();

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
api.post('/morphological', (c) => nlpController.analyzeMorphology(c));

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
api.post('/furigana', (c) => nlpController.addFurigana(c));

export default api; 