import { INlpRepository } from '../repositories/INlpRepository';
import { MorphologicalAnalysis } from '../models/MorphologicalAnalysis';
import { Furigana } from '../models/Furigana';
import { EmptyTextError } from '../errors/DomainError';

export class NlpService {
  private repository: INlpRepository;

  constructor(repository: INlpRepository) {
    this.repository = repository;
  }

  async analyzeMorphology(text: string): Promise<MorphologicalAnalysis> {
    if (!text || text.trim() === '') {
      throw new EmptyTextError();
    }
    return this.repository.analyzeMorphology(text);
  }

  async addFurigana(text: string): Promise<Furigana> {
    if (!text || text.trim() === '') {
      throw new EmptyTextError();
    }
    return this.repository.addFurigana(text);
  }
} 