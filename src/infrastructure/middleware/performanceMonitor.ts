import { Context, Next } from 'hono';
import logger from '../logging/logger';

export async function performanceMonitor(c: Context, next: Next) {
  const start = performance.now();
  const requestId = crypto.randomUUID();
  
  c.set('requestId', requestId);
  
  await next();
  
  const end = performance.now();
  const responseTime = end - start;
  
  logger.info({
    requestId,
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    responseTime: `${responseTime.toFixed(2)}ms`
  });
} 