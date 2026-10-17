// Índice ligero de la academia (sin el texto de las lecciones) para el navegador.
// Se construye en el servidor (lib/academy.ts → buildCatalog) y llega por contexto.
import type { Practice } from '@/content/academy/types';
import type { LessonProgress } from '@/types';

export interface LessonMeta {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  practice?: Practice;
  level: { id: string; number: number; title: string };
  /** Posición global (0-based) en el recorrido. */
  index: number;
  /** Posición dentro de su etapa (1-based). */
  position: number;
}

export interface LevelMeta {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  lessons: LessonMeta[];
}

export interface Catalog {
  levels: LevelMeta[];
  lessons: LessonMeta[];
  totalMinutes: number;
  practiceCount: number;
}

type P = Record<string, LessonProgress>;

export function isDone(p: P, id: string): boolean {
  return !!p[id]?.completedAt;
}

export function findLesson(c: Catalog, id: string | null | undefined): LessonMeta | undefined {
  return id ? c.lessons.find((l) => l.id === id) : undefined;
}

/** Primera lección sin completar, o la última si ya está todo hecho. */
export function currentLesson(c: Catalog, p: P): LessonMeta {
  return c.lessons.find((l) => !isDone(p, l.id)) ?? c.lessons[c.lessons.length - 1];
}

export function levelProgress(level: LevelMeta, p: P) {
  const done = level.lessons.filter((l) => isDone(p, l.id)).length;
  return { done, total: level.lessons.length, pct: level.lessons.length ? done / level.lessons.length : 0 };
}

export function overallProgress(c: Catalog, p: P) {
  const done = c.lessons.filter((l) => isDone(p, l.id)).length;
  return { done, total: c.lessons.length, pct: c.lessons.length ? done / c.lessons.length : 0 };
}
