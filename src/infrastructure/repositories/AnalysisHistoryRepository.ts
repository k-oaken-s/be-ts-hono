import { PrismaClient, Prisma } from '@prisma/client';
import { IAnalysisHistoryRepository } from '../../domain/repositories/IAnalysisHistoryRepository';
import { AnalysisHistory, AnalysisType } from '../../domain/models/AnalysisHistory';
import { prisma } from '../database/prisma';

export class AnalysisHistoryRepository implements IAnalysisHistoryRepository {
  async save(
    client: any = prisma,
    analysisHistory: AnalysisHistory
  ): Promise<AnalysisHistory> {
    const savedEntity = await client.analysisHistory.create({
      data: {
        inputText: analysisHistory.inputText,
        analysisType: analysisHistory.analysisType,
        result: JSON.stringify(analysisHistory.result),
      },
    });
    
    return new AnalysisHistory(
      savedEntity.id,
      savedEntity.inputText,
      savedEntity.analysisType as AnalysisType,
      JSON.parse(savedEntity.result),
      savedEntity.createdAt
    );
  }

  async findById(
    client: any = prisma,
    id: string
  ): Promise<AnalysisHistory | null> {
    const entity = await client.analysisHistory.findUnique({
      where: { id },
    });
    
    if (!entity) {
      return null;
    }
    
    return new AnalysisHistory(
      entity.id,
      entity.inputText,
      entity.analysisType as AnalysisType,
      JSON.parse(entity.result),
      entity.createdAt
    );
  }

  async findByInputText(
    client: any = prisma,
    text: string,
    limit: number = 10
  ): Promise<AnalysisHistory[]> {
    const entities = await client.analysisHistory.findMany({
      where: { inputText: text },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    
    return entities.map(entity => new AnalysisHistory(
      entity.id,
      entity.inputText,
      entity.analysisType as AnalysisType,
      JSON.parse(entity.result),
      entity.createdAt
    ));
  }

  async getRecentAnalyses(
    client: any = prisma,
    limit: number = 10
  ): Promise<AnalysisHistory[]> {
    const entities = await client.analysisHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    
    return entities.map(entity => new AnalysisHistory(
      entity.id,
      entity.inputText,
      entity.analysisType as AnalysisType,
      JSON.parse(entity.result),
      entity.createdAt
    ));
  }
} 