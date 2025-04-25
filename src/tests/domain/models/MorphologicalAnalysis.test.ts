import { describe, it, expect } from 'vitest';
import { MorphologicalAnalysis, MorphemeToken } from '../../../domain/models/MorphologicalAnalysis';

describe('MorphologicalAnalysis', () => {
  const tokens: MorphemeToken[] = [
    { surface: '私', pos: '名詞', reading: 'ワタシ' },
    { surface: 'は', pos: '助詞', reading: 'ハ' },
    { surface: '走る', pos: '動詞', reading: 'ハシル' }
  ];

  it('getTokensメソッドは全てのトークンを返す', () => {
    const analysis = new MorphologicalAnalysis(tokens);
    expect(analysis.getTokens()).toEqual(tokens);
    expect(analysis.getTokens().length).toBe(3);
  });

  it('getNounsメソッドは名詞のみを返す', () => {
    const analysis = new MorphologicalAnalysis(tokens);
    const nouns = analysis.getNouns();
    expect(nouns.length).toBe(1);
    expect(nouns[0].surface).toBe('私');
    expect(nouns[0].pos).toBe('名詞');
  });

  it('getVerbsメソッドは動詞のみを返す', () => {
    const analysis = new MorphologicalAnalysis(tokens);
    const verbs = analysis.getVerbs();
    expect(verbs.length).toBe(1);
    expect(verbs[0].surface).toBe('走る');
    expect(verbs[0].pos).toBe('動詞');
  });

  it('toStringメソッドは元の文字列を再構成する', () => {
    const analysis = new MorphologicalAnalysis(tokens);
    expect(analysis.toString()).toBe('私は走る');
  });
}); 