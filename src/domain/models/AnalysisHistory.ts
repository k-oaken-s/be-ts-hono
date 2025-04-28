export enum AnalysisType {
  MORPHOLOGY = 'morphology',
  FURIGANA = 'furigana'
}

export class AnalysisHistory {
  constructor(
    public readonly id: string | null,
    public readonly inputText: string,
    public readonly analysisType: AnalysisType,
    public readonly result: any,
    public readonly createdAt: Date = new Date()
  ) {}

  static createMorphologyAnalysis(inputText: string, result: any): AnalysisHistory {
    return new AnalysisHistory(
      null,
      inputText,
      AnalysisType.MORPHOLOGY,
      result,
      new Date()
    );
  }

  static createFuriganaAnalysis(inputText: string, result: any): AnalysisHistory {
    return new AnalysisHistory(
      null,
      inputText,
      AnalysisType.FURIGANA,
      result,
      new Date()
    );
  }
} 