import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveProgressDto } from './academy.dto';

// XP que suma cada logro de la academia a la cuenta de práctica (una sola vez).
const XP_LESSON = 20;
const XP_PRACTICE = 30;

@Injectable()
export class AcademyService {
  constructor(private prisma: PrismaService) {}

  getProgress(userId: string) {
    return this.prisma.lessonProgress.findMany({
      where: { userId },
      select: { lessonId: true, quizScore: true, practiceDone: true, completedAt: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  /** Guarda el progreso sin retroceder nunca: la nota máxima y los logros se conservan. */
  async saveProgress(userId: string, dto: SaveProgressDto) {
    const prev = await this.prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: dto.lessonId } },
    });

    const quizScore = Math.max(prev?.quizScore ?? 0, dto.quizScore ?? 0) || prev?.quizScore || dto.quizScore || null;
    const practiceDone = !!prev?.practiceDone || !!dto.practiceDone;
    const completedAt = prev?.completedAt ?? (dto.completed ? new Date() : null);

    const row = await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: dto.lessonId } },
      create: { userId, lessonId: dto.lessonId, quizScore, practiceDone, completedAt },
      update: { quizScore, practiceDone, completedAt },
      select: { lessonId: true, quizScore: true, practiceDone: true, completedAt: true },
    });

    let xp = 0;
    if (!prev?.completedAt && completedAt) xp += XP_LESSON;
    if (!prev?.practiceDone && practiceDone) xp += XP_PRACTICE;
    if (xp > 0) {
      await this.prisma.simAccount
        .update({ where: { userId }, data: { xp: { increment: xp } } })
        .catch(() => null);
    }

    return row;
  }
}
