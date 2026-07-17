'use client';
import { useLangStore } from '@/store/lang.store';
import { landingT } from '@/lib/landing-i18n';

export function useLandingT() {
  const lang = useLangStore((s) => s.lang);
  return lang === 'es' ? landingT.es : landingT.en;
}
