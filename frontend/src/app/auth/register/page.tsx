import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RegisterForm } from './RegisterForm';

export const metadata: Metadata = { title: 'Crear cuenta gratis' };

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
