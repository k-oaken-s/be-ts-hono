import { FuriganaWord } from '../../domain/models/Furigana';

export interface FuriganaResponseDto {
  input: string;
  result: {
    word: FuriganaWord[];
  };
} 