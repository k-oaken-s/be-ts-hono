import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('analysis_history')
export class AnalysisHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  inputText: string;

  @Column({ type: 'text' })
  analysisType: string; // 'morphology' または 'furigana'

  @Column({ type: 'text' })
  result: string; // JSON文字列として保存

  @CreateDateColumn()
  createdAt: Date;
} 