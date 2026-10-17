// Planes y precios — ÚNICA fuente de verdad en el frontend.
// El cobro real lo hace Stripe con los price IDs del backend
// (STRIPE_PRICE_MONTHLY, STRIPE_PRICE_ANNUAL…). Si cambias un precio en Stripe,
// cámbialo también aquí.

import type { PlanId } from '@/types';

export const FREE_SIMULATIONS = 20;

export interface PlanInfo {
  id: Exclude<PlanId, 'free'>;
  name: string;
  price: string;
  period: string;
  note?: string;
  highlight?: boolean;
  features: string[];
}

export const PLANS: PlanInfo[] = [
  {
    id: 'monthly',
    name: 'Pro mensual',
    price: '€9.95',
    period: '/mes',
    note: 'Cancela cuando quieras',
    features: [
      'Simulaciones ilimitadas',
      'Todas las prácticas de la academia',
      'Diario y estadísticas completas',
      'Exportación CSV del diario',
    ],
  },
  {
    id: 'annual',
    name: 'Pro anual',
    price: '€79',
    period: '/año',
    note: 'Equivale a €6.58/mes',
    highlight: true,
    features: [
      'Todo lo de Pro mensual',
      'Ahorras más de €40 al año',
      'Ideal para completar la academia con calma',
    ],
  },
];

export const PLAN_LABEL: Record<PlanId, string> = {
  free: 'Gratis',
  monthly: 'Pro mensual',
  annual: 'Pro anual',
  lifetime: 'Pro vitalicio',
  propfirm: 'Pro fondeo',
};
