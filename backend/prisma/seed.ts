import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const missions = [
    { name: 'Primera Operación',  description: 'Realiza tu primera simulación',                       type: 'TRADES_COUNT'   as const, targetValue: 1,  xpReward: 25,  isDaily: false },
    { name: 'Operador Activo',    description: 'Completa 10 operaciones en total',                    type: 'TRADES_COUNT'   as const, targetValue: 10, xpReward: 150, isDaily: false },
    { name: 'Disciplina de Riesgo', description: 'Realiza 5 operaciones con riesgo ≤ 2% cada una',  type: 'RISK_MAX_PCT'   as const, targetValue: 5,  xpReward: 100, isDaily: false },
    { name: 'Maestro del R/R',    description: 'Completa 3 operaciones con R/R ≥ 2:1',               type: 'MIN_RR_RATIO'   as const, targetValue: 3,  xpReward: 75,  isDaily: false },
    { name: 'Racha Ganadora',     description: 'Consigue 3 operaciones ganadoras consecutivas',       type: 'WIN_STREAK'     as const, targetValue: 3,  xpReward: 200, isDaily: false },
  ];

  for (const m of missions) {
    await prisma.mission.upsert({
      where:  { name: m.name },
      update: m,
      create: m,
    });
  }

  console.log('✅ Seed completado — misiones insertadas');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
