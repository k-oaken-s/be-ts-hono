import { PrismaClient, Prisma } from '@prisma/client';
import { IAnalysisHistoryRepository } from '../../domain/repositories/IAnalysisHistoryRepository';
import { AnalysisHistory, AnalysisType } from '../../domain/models/AnalysisHistory';
import { IUnitOfWork } from '../database/UnitOfWork';

export class AnalysisHistoryRepository implements IAnalysisHistoryRepository {
  private prisma: PrismaClient | Prisma.TransactionClient;

  constructor(unitOfWork: IUnitOfWork) {
    this.prisma = unitOfWork.getPrisma();
  }

  async save(analysisHistory: AnalysisHistory): Promise<AnalysisHistory> {
    const savedEntity = await this.prisma.analysisHistory.create({
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

  async findById(id: string): Promise<AnalysisHistory | null> {
    const entity = await this.prisma.analysisHistory.findUnique({
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

  async findByInputText(text: string, limit: number = 10): Promise<AnalysisHistory[]> {
    const entities = await this.prisma.analysisHistory.findMany({
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

  async getRecentAnalyses(limit: number = 10): Promise<AnalysisHistory[]> {
    const entities = await this.prisma.analysisHistory.findMany({
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