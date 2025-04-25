import 'dotenv/config'
import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { cors } from 'hono/cors'
import { swaggerUI } from '@hono/swagger-ui'
import swaggerJSDoc from 'swagger-jsdoc'
import apiRouter from './interfaces/routes/api'

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
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

// アプリケーションの初期化
const app = new Hono()

// CORSミドルウェアの適用
app.use('*', cors())

// Swagger UIの追加
app.get('/swagger', swaggerUI({ url: '/docs' }))
app.get('/docs', (c) => c.json(swaggerSpec))

// ルートエンドポイント
app.get('/', (c) => {
  return c.json({
    message: 'Yahoo! NLP API サーバーが正常に動作しています',
    version: '1.0.0',
    docs: 'Swagger UIは /swagger で利用可能です'
  })
})

// APIルーターのマウント
app.route('/api', apiRouter)

// AWS Lambda ハンドラー
export const handler = handle(app)

export default app