import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { swaggerUI } from '@hono/swagger-ui';
import apiRouter from './interfaces/routes/api';
import history from './interfaces/routes/history';
import health from './interfaces/routes/health';
import { container } from './infrastructure/di/container';
import { swaggerSpec } from './swagger';
import { serve } from '@hono/node-server';
import { performanceMonitor } from './infrastructure/middleware/performanceMonitor';

// Swagger JSDocの設定
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Yahoo! NLP API',
      version: '1.0.0',
      description: 'Yahoo! JAPANのテキスト解析APIを活用した日本語自然言語処理API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '開発サーバー',
      },
    ],
  },
  apis: ['./src/interfaces/routes/*.ts'], // JSDocコメントを含むファイルのパス
};

// アプリケーションの初期化
const app = new Hono();

// CORSミドルウェアの適用
app.use('*', cors());

// ミドルウェアの設定
app.use('*', performanceMonitor);

// Swagger UIの追加
app.get('/', c => c.redirect('/docs'));
app.get('/docs', swaggerUI({ url: '/openapi.json' }));
app.get('/openapi.json', c => c.json(swaggerSpec));

// ルートエンドポイント
app.get('/', c => {
  return c.json({
    message: 'Yahoo! NLP API サーバーが正常に動作しています',
    version: '1.0.0',
    docs: 'Swagger UIは /swagger で利用可能です',
  });
});

// APIルーターのマウント
app.route('/api', apiRouter);
app.route('/api/history', history);
app.route('/health', health);

// サーバー起動
const port = process.env.PORT || 3000;

// Lambdaハンドラーのエクスポート
export const handler = app;

// ローカル開発用のサーバー起動
if (process.env.NODE_ENV !== 'production') {
  (async () => {
    // DIコンテナの初期化
    await container.initialize();

    // @hono/node-serverのserve関数を使用
    serve({
      fetch: app.fetch,
      port: Number(port),
    });
    console.log(`Server is running on port ${port}`);
  })();
}

export default app;
