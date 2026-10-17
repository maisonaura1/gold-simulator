import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { Journal } from './Journal';

export const metadata: Metadata = { title: 'Diario' };

export default function JournalPage() {
  return (
    <AppShell>
      <Journal />
    </AppShell>
  );
}
