import { Hono } from 'hono';
import { container } from '../../infrastructure/di/container';
import { HistoryController } from '../controllers/HistoryController';

// DIコンテナからコントローラーを取得
const historyController = container.get<HistoryController>('historyController');

// 履歴ルーター
const history = new Hono();

/**
 * @swagger
 * /api/history:
 *   get:
 *     tags:
 *       - 履歴
 *     summary: 分析履歴を取得する
 *     description: 最近の分析履歴を取得します
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 取得する履歴の最大数
 *     responses:
 *       200:
 *         description: 分析履歴
 *       500:
 *         description: サーバーエラー
 */
history.get('/', (c) => historyController.getHistory(c));

export default history; 