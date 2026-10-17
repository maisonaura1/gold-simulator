import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/AppShell';
import { Account } from './Account';

export const metadata: Metadata = { title: 'Cuenta' };

export default function AccountPage() {
  return (
    <AppShell>
      <Account />
    </AppShell>
  );
}
