import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const missions = [
    // ─── NIVEL 1: PRINCIPIANTE ──────────────────────────────────────────────
    {
      name: '🟡 Primera Operación',
      description: 'Abre y cierra tu primer trade en el simulador. El primer paso es el más importante.',
      type: 'TRADES_COUNT' as const,
      targetValue: 1,
      xpReward: 50,
      isDaily: false,
    },
    {
      name: '🟡 SL Siempre',
      description: 'Completa 5 operaciones con riesgo ≤ 2% cada una. Nunca operes sin Stop Loss.',
      type: 'RISK_MAX_PCT' as const,
      targetValue: 5,
      xpReward: 100,
      isDaily: false,
    },
    {
      name: '🟡 Ratio R:R 1:2',
      description: 'Completa 3 operaciones con ratio Riesgo:Beneficio ≥ 2:1. La matemática a tu favor.',
      type: 'MIN_RR_RATIO' as const,
      targetValue: 3,
      xpReward: 100,
      isDaily: false,
    },
    {
      name: '🟡 10 Trades Completados',
      description: 'Cierra 10 operaciones en total. La experiencia se construye operación a operación.',
      type: 'TRADES_COUNT' as const,
      targetValue: 10,
      xpReward: 150,
      isDaily: false,
    },
    {
      name: '🟡 Primera Racha',
      description: 'Consigue 2 operaciones ganadoras consecutivas. Empieza a desarrollar consistencia.',
      type: 'WIN_STREAK' as const,
      targetValue: 2,
      xpReward: 150,
      isDaily: false,
    },

    // ─── NIVEL 2: INTERMEDIO ────────────────────────────────────────────────
    {
      name: '🔵 Disciplina de Riesgo',
      description: 'Realiza 15 operaciones con riesgo ≤ 2% cada una. La disciplina es el borde competitivo.',
      type: 'RISK_MAX_PCT' as const,
      targetValue: 15,
      xpReward: 200,
      isDaily: false,
    },
    {
      name: '🔵 Maestro del R:R',
      description: 'Completa 8 operaciones con R:R ≥ 2:1. Con este ratio puedes perder más de lo que ganas y seguir siendo rentable.',
      type: 'MIN_RR_RATIO' as const,
      targetValue: 8,
      xpReward: 200,
      isDaily: false,
    },
    {
      name: '🔵 Racha Dorada',
      description: 'Logra 3 operaciones ganadoras consecutivas. La consistencia supera a la suerte.',
      type: 'WIN_STREAK' as const,
      targetValue: 3,
      xpReward: 250,
      isDaily: false,
    },
    {
      name: '🔵 Veterano',
      description: 'Cierra 30 operaciones en total. El volumen de práctica es insustituible.',
      type: 'TRADES_COUNT' as const,
      targetValue: 30,
      xpReward: 250,
      isDaily: false,
    },
    {
      name: '🔵 Control Total',
      description: 'Realiza 25 operaciones con riesgo ≤ 2% cada una. Esto es lo que separa a los traders rentables.',
      type: 'RISK_MAX_PCT' as const,
      targetValue: 25,
      xpReward: 300,
      isDaily: false,
    },

    // ─── NIVEL 3: AVANZADO ──────────────────────────────────────────────────
    {
      name: '🔴 El Profesional',
      description: 'Cierra 60 operaciones en total. A este punto ya tienes la experiencia de meses de trading real.',
      type: 'TRADES_COUNT' as const,
      targetValue: 60,
      xpReward: 400,
      isDaily: false,
    },
    {
      name: '🔴 Listo para Fondeo',
      description: 'Completa 15 operaciones con R:R ≥ 2:1. Las firmas de fondeo buscan exactamente esto.',
      type: 'MIN_RR_RATIO' as const,
      targetValue: 15,
      xpReward: 400,
      isDaily: false,
    },
    {
      name: '🔴 Racha Legendaria',
      description: 'Consigue 5 operaciones ganadoras consecutivas. Solo los traders más disciplinados logran esto.',
      type: 'WIN_STREAK' as const,
      targetValue: 5,
      xpReward: 500,
      isDaily: false,
    },
    {
      name: '🔴 Centurión del Oro',
      description: 'Cierra 100 operaciones en total. Bienvenido al 1% de traders que realmente practican.',
      type: 'TRADES_COUNT' as const,
      targetValue: 100,
      xpReward: 750,
      isDaily: false,
    },

    // ─── MISIONES DIARIAS ───────────────────────────────────────────────────
    {
      name: '📅 Sesión Disciplinada',
      description: 'Hoy: completa 2 operaciones con riesgo ≤ 2% cada una. Un día a la vez.',
      type: 'RISK_MAX_PCT' as const,
      targetValue: 2,
      xpReward: 30,
      isDaily: true,
    },
    {
      name: '📅 R:R del Día',
      description: 'Hoy: cierra 1 operación con R:R ≥ 2:1. Calidad sobre cantidad.',
      type: 'MIN_RR_RATIO' as const,
      targetValue: 1,
      xpReward: 25,
      isDaily: true,
    },
  ];

  for (const m of missions) {
    await prisma.mission.upsert({
      where: { name: m.name },
      update: { description: m.description, xpReward: m.xpReward, targetValue: m.targetValue },
      create: m,
    });
  }

  console.log(`✅ Seed completado — ${missions.length} misiones insertadas`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
