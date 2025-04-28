import 'reflect-metadata';

// トランザクションクライアントの型（具体的な実装に依存しない）
export interface TransactionClient {
  [key: string]: any;
}

// トランザクションマネージャーのインターフェース
export interface TransactionManager {
  runInTransaction<T>(
    callback: (client: TransactionClient) => Promise<T>,
    options?: any
  ): Promise<T>;
}

// トランザクションマネージャーの登録用シンボル
export const TRANSACTION_MANAGER = Symbol('TRANSACTION_MANAGER');

// トランザクションマネージャーのグローバルインスタンス
let transactionManager: TransactionManager | null = null;

// トランザクションマネージャーの設定
export function setTransactionManager(manager: TransactionManager): void {
  transactionManager = manager;
}

// トランザクションデコレータ
export function Transactional(options?: any) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      if (!transactionManager) {
        throw new Error('TransactionManager has not been set');
      }
      
      return await transactionManager.runInTransaction(async (client) => {
        // 第一引数にトランザクションクライアントを追加
        return await originalMethod.apply(this, [client, ...args]);
      }, options);
    };
    
    return descriptor;
  };
} 