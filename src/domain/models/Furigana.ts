export interface FuriganaWord {
  surface: string;
  furigana: string;
}

export class Furigana {
  private words: FuriganaWord[];

  constructor(words: FuriganaWord[]) {
    this.words = words;
  }

  getWords(): FuriganaWord[] {
    return this.words;
  }

  getFullText(): string {
    return this.words.map(word => word.surface).join('');
  }

  getFullFurigana(): string {
    return this.words.map(word => word.furigana).join('');
  }
} 