import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { ALL_LESSONS, getLesson } from '@/lib/academy';
import { LessonView } from './LessonView';

export function generateStaticParams() {
  return ALL_LESSONS.map((l) => ({ lessonId: l.id }));
}

export function generateMetadata({ params }: { params: { lessonId: string } }): Metadata {
  const lesson = getLesson(params.lessonId);
  return { title: lesson ? lesson.title : 'Lección' };
}

export default function LessonPage({ params }: { params: { lessonId: string } }) {
  const lesson = getLesson(params.lessonId);
  if (!lesson) notFound();
  // Solo el texto de esta lección viaja al navegador
  return (
    <AppShell>
      <LessonView lesson={lesson} />
    </AppShell>
  );
}
