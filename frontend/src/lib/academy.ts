// Contenido completo de la academia. Solo para componentes de servidor:
// en el navegador usa el catálogo ligero (useCatalog) para no descargar todo el texto.
import type { Lesson, Level } from '@/content/academy/types';
import type { Catalog, LessonMeta, LevelMeta } from '@/lib/catalog';
import { nivel1 } from '@/content/academy/nivel-1';
import { nivel2 } from '@/content/academy/nivel-2';
import { nivel3 } from '@/content/academy/nivel-3';
import { nivel4 } from '@/content/academy/nivel-4';
import { nivel5 } from '@/content/academy/nivel-5';
import { nivel6 } from '@/content/academy/nivel-6';

export const LEVELS: Level[] = [nivel1, nivel2, nivel3, nivel4, nivel5, nivel6];

export const ALL_LESSONS: Lesson[] = LEVELS.flatMap((l) => l.lessons);
export const TOTAL_MINUTES = ALL_LESSONS.reduce((s, l) => s + l.minutes, 0);
export const PRACTICE_COUNT = ALL_LESSONS.filter((l) => l.practice).length;

export function getLesson(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function buildCatalog(): Catalog {
  let index = 0;
  const levels: LevelMeta[] = LEVELS.map((level) => ({
    id: level.id,
    number: level.number,
    title: level.title,
    subtitle: level.subtitle,
    description: level.description,
    lessons: level.lessons.map(
      (l, i): LessonMeta => ({
        id: l.id,
        title: l.title,
        summary: l.summary,
        minutes: l.minutes,
        ...(l.practice ? { practice: l.practice } : {}),
        level: { id: level.id, number: level.number, title: level.title },
        index: index++,
        position: i + 1,
      }),
    ),
  }));
  return { levels, lessons: levels.flatMap((l) => l.lessons), totalMinutes: TOTAL_MINUTES, practiceCount: PRACTICE_COUNT };
}
