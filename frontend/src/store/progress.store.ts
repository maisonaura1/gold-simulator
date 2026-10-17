'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '@/lib/api';
import type { LessonProgress } from '@/types';

/** Aprobado: al menos 2 de cada 3 respuestas correctas. */
export const PASS_SCORE = 0.66;

type ProgressMap = Record<string, LessonProgress>;

interface ProgressState {
  lessons: ProgressMap;
  /** Operaciones válidas acumuladas por práctica (solo en este dispositivo). */
  practiceHits: Record<string, number>;
  /** false si el backend aún no tiene el endpoint /academy/progress. */
  serverSync: boolean;
  hydrated: boolean;
  load: () => Promise<void>;
  saveQuiz: (lessonId: string, score: number) => Promise<void>;
  savePractice: (lessonId: string) => Promise<void>;
  /** Suma una operación válida; marca la práctica como hecha al llegar a `needed`. Devuelve el total. */
  addPracticeHit: (lessonId: string, needed: number) => number;
  reset: () => void;
}

const empty = (lessonId: string): LessonProgress => ({ lessonId, completedAt: null, quizScore: null, practiceDone: false });

function merge(a: LessonProgress | undefined, b: LessonProgress): LessonProgress {
  if (!a) return b;
  return {
    lessonId: b.lessonId,
    completedAt: a.completedAt ?? b.completedAt,
    quizScore: Math.max(a.quizScore ?? 0, b.quizScore ?? 0) || (a.quizScore ?? b.quizScore),
    practiceDone: a.practiceDone || b.practiceDone,
  };
}

async function push(p: LessonProgress): Promise<boolean> {
  try {
    await api.post('/academy/progress', {
      lessonId: p.lessonId,
      quizScore: p.quizScore ?? undefined,
      practiceDone: p.practiceDone,
      completed: !!p.completedAt,
    });
    return true;
  } catch (e) {
    const status = (e as { response?: { status?: number } })?.response?.status;
    return status !== 404;
  }
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      lessons: {},
      practiceHits: {},
      serverSync: true,
      hydrated: false,

      load: async () => {
        try {
          const { data } = await api.get<LessonProgress[]>('/academy/progress');
          const local = get().lessons;
          const merged: ProgressMap = { ...local };
          for (const row of data) merged[row.lessonId] = merge(local[row.lessonId], row);
          set({ lessons: merged, serverSync: true, hydrated: true });
          // Sube lo que solo existía en este dispositivo
          const serverIds = new Set(data.map((r) => r.lessonId));
          Object.values(local)
            .filter((p) => !serverIds.has(p.lessonId))
            .forEach((p) => void push(p));
        } catch (e) {
          const status = (e as { response?: { status?: number } })?.response?.status;
          set({ serverSync: status !== 404, hydrated: true });
        }
      },

      saveQuiz: async (lessonId, score) => {
        const prev = get().lessons[lessonId] ?? empty(lessonId);
        const passed = score >= PASS_SCORE;
        const next: LessonProgress = {
          ...prev,
          quizScore: Math.max(prev.quizScore ?? 0, score),
          completedAt: prev.completedAt ?? (passed ? new Date().toISOString() : null),
        };
        set({ lessons: { ...get().lessons, [lessonId]: next } });
        if (get().serverSync) {
          const ok = await push(next);
          if (!ok) set({ serverSync: false });
        }
      },

      savePractice: async (lessonId) => {
        const prev = get().lessons[lessonId] ?? empty(lessonId);
        if (prev.practiceDone) return;
        const next: LessonProgress = { ...prev, practiceDone: true };
        set({ lessons: { ...get().lessons, [lessonId]: next } });
        if (get().serverSync) {
          const ok = await push(next);
          if (!ok) set({ serverSync: false });
        }
      },

      addPracticeHit: (lessonId, needed) => {
        const hits = (get().practiceHits[lessonId] ?? 0) + 1;
        set({ practiceHits: { ...get().practiceHits, [lessonId]: hits } });
        if (hits >= needed) void get().savePractice(lessonId);
        return hits;
      },

      reset: () => set({ lessons: {}, practiceHits: {}, hydrated: false }),
    }),
    {
      name: 'gt-academy-progress',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} },
      ),
      partialize: (s) => ({ lessons: s.lessons, practiceHits: s.practiceHits }),
    },
  ),
);
