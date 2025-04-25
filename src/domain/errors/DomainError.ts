export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class EmptyTextError extends DomainError {
  constructor() {
    super('テキストが空です');
    this.name = 'EmptyTextError';
  }
}

export class ApiError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
} 