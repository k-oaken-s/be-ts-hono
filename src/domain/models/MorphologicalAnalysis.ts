export interface MorphemeToken {
  surface: string;
  pos: string;
  reading?: string;
}

export class MorphologicalAnalysis {
  private tokens: MorphemeToken[];

  constructor(tokens: MorphemeToken[]) {
    this.tokens = tokens;
  }

  getTokens(): MorphemeToken[] {
    return this.tokens;
  }

  getNouns(): MorphemeToken[] {
    return this.tokens.filter(token => token.pos === '名詞');
  }

  getVerbs(): MorphemeToken[] {
    return this.tokens.filter(token => token.pos === '動詞');
  }

  toString(): string {
    return this.tokens.map(token => token.surface).join('');
  }
} 