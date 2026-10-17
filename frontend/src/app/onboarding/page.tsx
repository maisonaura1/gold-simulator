import type { Metadata } from 'next';
import { Onboarding } from './Onboarding';

export const metadata: Metadata = { title: 'Bienvenida' };

export default function OnboardingPage() {
  return <Onboarding />;
}
