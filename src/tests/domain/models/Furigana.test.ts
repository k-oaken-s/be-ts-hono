import { describe, it, expect } from 'vitest';
import { Furigana, FuriganaWord } from '../../../domain/models/Furigana';

describe('Furigana', () => {
  const words: FuriganaWord[] = [
    { surface: '漢字', furigana: 'かんじ' },
    { surface: 'の', furigana: 'の' },
    { surface: '読み方', furigana: 'よみかた' }
  ];

  it('getWordsメソッドは全ての単語を返す', () => {
    const furigana = new Furigana(words);
    expect(furigana.getWords()).toEqual(words);
    expect(furigana.getWords().length).toBe(3);
  });

  it('getFullTextメソッドは元の文字列を再構成する', () => {
    const furigana = new Furigana(words);
    expect(furigana.getFullText()).toBe('漢字の読み方');
  });

  it('getFullFuriganaメソッドはふりがなを連結して返す', () => {
    const furigana = new Furigana(words);
    expect(furigana.getFullFurigana()).toBe('かんじのよみかた');
  });
}); 