# Prompt maestro — Mejoras de UI/UX y conversión vs. BullGPT

> Pega este prompt completo en una sesión de Claude Code abierta en `/Users/maisonaura/gold-simulator/frontend`.
> Contexto: somos un simulador de trading de oro (XAUUSD) real, con motor de velas TradingView (`lightweight-charts`),
> blotter de órdenes, Trader Score y academia. Nuestro competidor `bullgpt.io` vende análisis de gráficos por IA
> (sube una foto del chart, la IA responde en 7s) con soporte humano por WhatsApp, a $40/mes o $180 pago único.
> No copiamos su copy ni su marca — adoptamos sus **patrones de diseño y de conversión** que están mejor resueltos
> que los nuestros, y los aplicamos con nuestra propia identidad (dorado/negro, no verde).

## Diagnóstico (léelo antes de tocar código)

Nuestro landing (`src/app/page.tsx`) ya tiene una estructura correcta (hero → stats bar → preview → features →
how it works → testimonios → pricing → FAQ → CTA final) y nuestro producto real es objetivamente más sofisticado
(velas reales de TradingView, blotter de auditoría, Trader Score) que el de BullGPT, que en su home es sobre todo
mockups estáticos. El gap no es de arquitectura de página, es de **pulido visual, prueba social y psicología de
pricing**. Puntos concretos donde BullGPT nos gana:

1. **Micro-marca "blueprint"**: marcas de esquina en verde (`+` en las 4 esquinas de cada sección) + etiquetas
   monoespaciadas entre corchetes (`[ WITH EXPERT-LEVEL PRECISION ]`) que dan sensación de precisión técnica.
   Nosotros ya usamos `GoldLabel` con corchetes pero sin las marcas de esquina ni la línea divisoria sutil.
2. **Prueba social cuantificada arriba del pliegue**: badge "+1300 profitable traders" + estrellas 4.8/5 + logo de
   verificador (Whop) *inmediatamente debajo del CTA principal*, antes de cualquier scroll. Nosotros solo tenemos
   el ticker de precio ahí.
3. **Mockups de producto reales embebidos en las feature cards**, no solo un preview grande al inicio: cada
   bloque de feature de BullGPT contiene una captura/mock realista (chat de WhatsApp, curva de equity con
   marcadores de profit, ticket de orden con panel de razonamiento colapsable). Nuestro `FakeMiniChart` es un SVG
   genérico plano; nuestro `ProductPreview` es un único bloque grande. Nos falta variedad de mockups pequeños
   repartidos en la sección de features.
4. **Framing de pricing orientado a ROI**, no solo a features: "la mayoría recupera su inversión en la primera
   operación ganadora". Nuestro pricing es correcto pero neutro (solo lista features).
5. **Testimonios en carrusel/marquee infinito** con doble fila, en vez de grid estático de 4 tarjetas.
6. **Sección de vídeo/YouTube de terceros** ("expertos de la industria confían en nosotros") — nosotros no
   tenemos ningún contenido de terceros/UGC.
7. Su tema es oscuro + **un solo acento (verde esmeralda)** aplicado con extrema disciplina (nunca dos acentos
   compitiendo). Nosotros usamos dorado consistentemente — bien — pero mezclamos verde/rojo semántico de P&L en
   el mismo dashboard donde el hero es dorado; ojo con no diluir la identidad dorada en `dashboard/page.tsx` y
   `charts/PriceChart.tsx` (que usa `#131722` azulado de TradingView, no nuestro `#07080b`/`#0b0d11`).

## Tareas para Claude Code

Trabaja en `/Users/maisonaura/gold-simulator/frontend`. Ejecuta en este orden, mostrando diff antes de continuar
a la siguiente tarea si el cambio toca más de un archivo grande.

### 1. Unificar el fondo del chart con la identidad de marca
En `src/components/charts/PriceChart.tsx`, las constantes `BG='#131722'`, `GRID='#1c2030'`, `BORDER='#2e3340'`
vienen del tema por defecto de TradingView y no coinciden con el resto de la app (`#07080b`, `#0b0d11`, `#1d2029`
usados en `page.tsx` y `dashboard/page.tsx`). Cámbialas a `BG='#07080b'`, `GRID='#12141c'`, `BORDER='#1d2029'`,
manteniendo `TEXT='#6b7385'` para que combine con el resto del dashboard. Verifica que las velas alcistas/bajistas
sigan usando verde/rojo semántico (eso no debe tocarse, es información, no branding).

### 2. Añadir marcas de esquina "blueprint" reutilizables
Crea `src/components/ui/CornerFrame.tsx`: un wrapper que dibuja 4 pequeñas cruces/puntos dorados (`#c9a84c`) en
las esquinas de una sección, con una línea horizontal sutil `1px solid #1d2029` arriba y abajo. Debe aceptar
`children` y renderizar `position: relative` con los 4 marcadores absolutamente posicionados (arriba-izq,
arriba-der, abajo-izq, abajo-der). Aplícalo en `page.tsx` a las secciones `#preview`, `#features` y `#pricing`
(no lo pongas en todas, solo en 3, para que sea un acento y no ruido visual).

### 3. Prueba social cuantificada en el hero
En `page.tsx`, justo debajo del CTA "Start practicing free →" y antes del `FakeTicker`, añade una fila con:
- Un badge de estrellas (usa datos reales si existen — si no hay reviews públicas todavía, usa el conteo real
  de usuarios registrados desde el backend en vez de inventar un número; expón un endpoint simple
  `GET /api/stats/public` en `backend` si no existe, que devuelva `{ totalUsers, totalTrades }`).
- Nunca fabriques cifras de reviews o testimonios falsos — si no hay datos reales todavía, omite el badge de
  estrellas y dejar solo el conteo de usuarios reales, o un TODO visible en el código (`{/* TODO: activar cuando
  tengamos reviews reales */}`).

### 4. Mini-mockups de producto dentro de las feature cards
En `FEATURES` (dentro de `page.tsx`) o en un nuevo componente `FeatureCardWithPreview`, añade a 2-3 de las 6
tarjetas de features un mockup pequeño real (200-260px de alto) usando componentes que ya existen:
- Para "Performance Analytics": una versión miniatura de la curva de equity (puedes reusar lógica de `recharts`
  ya instalado, con datos de ejemplo estáticos, no fake-random).
- Para "Risk Calculator": una miniatura del `LotCalculator` o `OrderTicket` ya existentes en
  `src/components/trade/`, en modo solo-lectura/demo.
Esto reemplaza la sensación de "features listadas con icono" por "features demostradas visualmente", que es lo
que hace fuerte a BullGPT.

### 5. Reforzar el pricing con framing de ROI y ancla de urgencia
En `PricingCard` / `TIERS` (`page.tsx`), añade una línea de micro-copy arriba de las dos tarjetas (no dentro de
cada una) del estilo "La mayoría de traders recupera el coste del plan Pro con su primera sesión de mejora
medible" — solo si es una afirmación defendible; si no, usa algo verificable como "Sin suscripción, pago único,
acceso de por vida" (esto ya lo tenemos, pero recolócalo como titular encima de las cards, no como pie de página
pequeño en gris — súbele jerarquía visual).

### 6. Testimonios: pasar de grid estático a marquee de doble fila
Sustituye el `grid` de `TESTIMONIALS` por dos filas horizontales con scroll automático infinito (CSS
`animation: scroll linear infinite`, pausado en `:hover`), fila superior moviéndose a la izquierda, fila inferior
a la derecha (para dar sensación de "muchos testimonios", como hace BullGPT). Implementa con
`overflow: hidden` + un contenedor duplicando el array de testimonios una vez (`[...arr, ...arr]`) para loop
continuo sin salto. Mantén el contenido actual (no inventes testimonios nuevos).

### 7. Sección de prueba de terceros / walkthrough
Añade una sección opcional `#demo` con un player de vídeo (o GIF) mostrando 15-20s de una sesión de trade real
en la app (grabación propia, no de terceros ya que no tenemos creators aún). Título sugerido: "Mira el simulador
en acción" con el vídeo embebido en el mismo `Mock browser frame` que ya usa `ProductPreview` (reutiliza ese
componente de marco, no dupliques estilos).

### 8. Auditoría de consistencia de color final
Después de los cambios anteriores, ejecuta una pasada rápida (`grep -rn "#131722\|#1c2030\|#2e3340" src/`) para
confirmar que no queda ningún color del tema por defecto de TradingView fuera de lo que decidiste mantener en el
paso 1, y que toda la app (landing, dashboard, trade, stats) respeta la paleta base:
`#07080b` (fondo), `#0b0d11`/`#0f1117` (superficies), `#1d2029` (bordes), `#c9a84c` (acento dorado),
`#2dcc6f`/`#e84040` (semántico P&L, no tocar).

## Qué NO hacer
- No copies literalmente textos, nombres de sección o el verde de marca de BullGPT — nuestra identidad es
  dorado/negro y debe seguir siéndolo.
- No inventes cifras de usuarios, ratings o testimonios que no existan.
- No reemplaces `lightweight-charts` por nada más simple: nuestro chart de velas reales es una ventaja real
  frente a los mockups estáticos del competidor: se usa en el marketing, no se recorta.
