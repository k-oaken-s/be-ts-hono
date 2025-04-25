import { Hono } from 'hono';

const health = new Hono();

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - ヘルスチェック
 *     summary: APIの健全性を確認する
 *     description: APIサーバーが正常に動作しているかを確認します
 *     responses:
 *       200:
 *         description: APIサーバーは正常に動作しています
 */
health.get('/', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default health; 