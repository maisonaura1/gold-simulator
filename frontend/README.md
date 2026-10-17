# GoldTrader MT — web (Next.js)

Academia de trading de oro + simulador. Todo en español. El método de la app es
**Aprende → Practica → Revisa**.

## Arrancar en local

```bash
npm install
NEXT_PUBLIC_API_URL=http://localhost:3001 npm run dev   # backend en :3001
```

Sin `NEXT_PUBLIC_API_URL` se usa el backend de producción (`.env.production`).

## Dónde está cada cosa

| Qué | Dónde |
| --- | --- |
| Lecciones (texto, tests, prácticas) | `src/content/academy/nivel-1.ts` … `nivel-6.ts` |
| Formato del contenido | `src/content/academy/types.ts` |
| Ilustraciones de las lecciones | `src/components/academy/Figure.tsx` |
| Precios y planes | `src/lib/plans.ts` (deben coincidir con Stripe) |
| Matemática de riesgo y lotes | `src/lib/trading.ts` (1 lote = 100 onzas) |
| Simulador | `src/app/trade/`, `src/components/trade/` |
| Portada | `src/app/page.tsx` |

## Añadir o editar una lección

1. Edita el nivel en `src/content/academy/nivel-N.ts`. El `id` debe empezar por
   `nN-` y ser único (el progreso de los alumnos se guarda con ese id: no
   cambies ids de lecciones ya publicadas).
2. Bloques disponibles: `p`, `list`, `callout`, `example`, `formula`, `table`
   y `figure`. Se puede usar `**negrita**` en cualquier texto.
3. Para que una lección tenga práctica, añade `practice` con sus reglas
   (`maxRiskPct`, `minRR`, `requireNotes`, `side`) y, si hace falta repetirla,
   `count`. El simulador comprueba las reglas solo.
4. `npm run build` comprueba los tipos.

El texto completo de las lecciones solo se carga en la página de cada lección;
el resto de pantallas usan un índice ligero (`src/lib/catalog.ts`).

## Despliegue

- La web se despliega en Vercel como antes.
- El backend necesita la migración `20261017000000_academy_progress` (tabla
  `lesson_progress`). En Railway se aplica sola al arrancar
  (`start:prod` ejecuta `prisma migrate deploy`).
- Si el backend aún no tiene la migración, la web sigue funcionando y guarda el
  progreso de la academia solo en el navegador.
