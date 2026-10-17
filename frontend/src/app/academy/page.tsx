import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { AcademyIndex } from './AcademyIndex';

export const metadata: Metadata = { title: 'Academia' };

export default function AcademyPage() {
  return (
    <AppShell>
      <AcademyIndex />
    </AppShell>
  );
}
