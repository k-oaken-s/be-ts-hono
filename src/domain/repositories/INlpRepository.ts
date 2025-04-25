import { MorphologicalAnalysis } from '../models/MorphologicalAnalysis';
import { Furigana } from '../models/Furigana';

export interface INlpRepository {
  analyzeMorphology(text: string): Promise<MorphologicalAnalysis>;
  addFurigana(text: string): Promise<Furigana>;
} 