import { MorphemeToken } from '../../domain/models/MorphologicalAnalysis';

export interface MorphologicalResponseDto {
  input: string;
  result: MorphemeToken[];
} 