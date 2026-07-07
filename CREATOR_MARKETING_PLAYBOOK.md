# Playbook de marketing con creadoras — caso @letscallkamilla → gold-simulator

Basado en capturas reales del grid de Instagram de @letscallkamilla (creadora patrocinada por BullGPT) y en 4
vídeos de venta reales que compartiste. No he accedido a su perfil directamente (Instagram está bloqueado en este
entorno) — todo lo de abajo sale de lo que me pasaste, nada inventado.

---

## PARTE 1 — Análisis (rol: estratega de marketing/social con 20 años)

### Lo que hace su contenido, en una frase
Vende un **estilo de vida** (nómada digital rentable viviendo en Bali) usando el trading con IA como excusa
narrativa, no vende la herramienta como producto. El producto aparece como *prop*, casi nunca como protagonista.

### Fórmulas de hook detectadas (repetidas, no casuales — esto es guion de marca, no improvisación)

1. **"Men vs. Her" (contraste de género / rage-bait)** — el hook más usado y el que más picos de vistas genera
   (24k–74k views vs. 2k–9k de la media). Plantilla exacta:
   `"Men [creencia/estereotipo sobre trading]... [ella hace lo contrario, sin esfuerzo, en el paraíso]"`
   Ejemplos reales: *"Men think profitable women in trading are 'just lucky'"*, *"Men still think profitable
   traders look stressed"*, *"Men brought ego into trading. I brought AI to the island"*. Es controversia
   calculada: genera comentarios en desacuerdo (los hombres discutiendo) y comentarios de apoyo (mujeres
   compartiendo), ambos alimentan el algoritmo.
2. **Fantasía de arbitraje de estilo de vida** — Bali, piscina, moto, café con vistas, baño de flores. El trading
   nunca se muestra como "trabajo", se muestra como accesorio de una vida ya resuelta. El copy nunca dice "cómo
   ganar dinero", dice "cómo yo ya vivo así".
3. **FOMO de IA** — *"The smartest traders already use AI"*, *"I stopped guessing trades after I found this AI
   tool"*, *"AI traders are replacing 'real traders'"*. Crea urgencia de quedarse atrás, no urgencia de precio.
4. **Prueba disfrazada de tutorial numerado con pantalla partida** (confirmado en los 4 vídeos que compartiste):
   mitad superior = grabación de pantalla real del producto (panel de oro $4,264.03, indicadores Market
   stability/RSI/Economic context, plan de trade con SELL LIMIT + Stop-Loss + Take Profit, pestañas
   Scalper/Day Trader/Swing Trader), mitad inferior = ella en un rincón precioso de Bali con un iPad, con un
   texto tipo *"3. Upload the screenshot"* / *"4. Read the trade plan"*. Es literalmente una dramatización del
   "3 simple steps" que ya usa BullGPT en su propia landing — copy de marca y copy de creadora están alineados,
   esto no es contenido orgánico espontáneo, es un guion de marca ejecutado por la creadora.
5. **Producto como prop dentro de foto candid**: una miniatura muestra una captura de chat estilo WhatsApp con
   la marca visible, superpuesta como si fuera un pensamiento suyo en una foto de café — evita que se sienta
   como anuncio.
6. **Marca visual consistente y anti-robo**: emoji 📈 + tipografía blanca en negrita quemada en cada miniatura
   (reconocible en el feed sin sonido), y su @handle incrustado dentro del propio vídeo (protección de reposteo).

### Dato importante para nosotros
En los vídeos de venta que compartiste, el instrumento que analiza es **oro (XAU)** con niveles de Stop-Loss/
Take-Profit — es decir, ella **ya produce contenido de trading de oro**. No haría falta "traducir" el nicho:
el mismo formato, con nuestra pantalla en vez de la de BullGPT, encaja sin fricción.

### Diferencia legal/ética que hay que vigilar si replicamos esto
BullGPT vende "análisis" con testimonios de dólares ganados reales ("gané $1,620", "generé +1000€") — eso roza
asesoramiento financiero no regulado y promesas de rentabilidad. Nuestro producto es un **simulador con capital
virtual**: es una ventaja real (cero riesgo) que además nos permite hacer marketing más honesto y más seguro
legalmente. El guion para nuestras creadoras debe prohibir explícitamente:
- Prometer ganancias o rentabilidad garantizada.
- Testimonios en euros/dólares reales ganados (nosotros no manejamos dinero real).
- Cualquier frase que suene a asesoramiento financiero ("deberías comprar/vender X ahora").
El ángulo honesto y vendible es: *"practica de verdad, con datos reales de mercado, sin arriesgar un euro"* —
es distinto y defendible frente a BullGPT.

---

## PARTE 2 — Guion de replicación para gold-simulator

Formato a copiar: **tutorial numerado a pantalla partida** (top: grabación de pantalla real de la app; bottom:
la creadora en un lugar con estética de vida bonita — no hace falta que sea Bali, puede ser su ciudad/casa/café).

**Hook (0-2s, elegir uno según el ángulo de la semana):**
- Contraste de género: *"Men think you need 10 years to read a gold chart. Watch what happens when I open mine."*
- FOMO/curiosidad: *"Everyone's practicing gold trading like this now and nobody's talking about it."*
- Autoridad + cero riesgo (nuestro diferencial real): *"I trade gold every day and I've never risked a single
  real euro. Here's how."*

**Cuerpo (pasos numerados, screen-recording real de nuestra app):**
1. "Open the simulator" → dashboard
2. "Load a real XAUUSD session" → gráfico de velas real (TradingView) — este es nuestro punto fuerte visual,
   más creíble que el mockup de BullGPT
3. "Set your Stop-Loss and Take-Profit with the risk calculator" → `LotCalculator` / `OrderTicket`
4. "Check your Trader Score after the trade" → dashboard con `GradeBar`

**CTA de cierre:** *"10 free simulations, no card, link in bio"* (coincide con nuestra oferta real en `page.tsx`).

**Reglas de guion (no negociables, pásalas a cada creadora por escrito):**
- Nunca decir cifras de ganancia en dinero real.
- Siempre dejar claro (en voz o en texto) que es "simulador" / "capital virtual" / "práctica".
- Disclosure obligatorio `#ad` o `#sponsored` visible desde el primer segundo (requisito legal, no opcional).

---

## PARTE 3 — Briefing de contratación (rol: RRHH/talent partner con 20 años en creator economy)

### Perfil de creadora a buscar (ICP)
- Nicho: trading/finanzas personales con estética "lifestyle" (viaje, disciplina, libertad), no "finance bro"
  corporativo — el formato que funciona aquí es aspiracional, no técnico.
- Audiencia predominantemente joven (18-34), interesada en trading retail/cripto/forex — mismo público objetivo
  que nuestro producto.
- Señal de calidad real (pídelo siempre, no te fíes solo del contador de seguidores):
  - Ratio de *reach/views por Reel* frente a seguidores (en las capturas que compartiste, muchos Reels con
    "solo" unos miles de seguidores generan 5-70k vistas — eso es lo que importa, no el follower count).
  - Capturas de Instagram Insights (alcance, guardados, compartidos, demografía) de los últimos 90 días.
  - Historial de colaboraciones pagadas previas con apps de trading/fintech y cómo les fue (pedir métricas, no
    solo el vídeo).

### Dónde encontrarlas
- Hashtags/nichos: contenido de "trading lifestyle", "girls who trade", finanzas + viajes.
- Marketplaces de creators: Whop (la misma plataforma que usa BullGPT para sus reseñas — es probable que muchas
  creadoras de este nicho ya estén ahí), Collabstr y agencias boutique especializadas en fintech/trading.
- Buscar directamente creadoras que ya han trabajado con competidores directos (BullGPT y apps similares de
  señales/IA) — ya conocen el formato y el público, la curva de aprendizaje es cero.

### Proceso de evaluación (antes de pagar nada)
1. Pedir 3 ejemplos de integraciones de marca pasadas + sus métricas reales (no solo el link al post).
2. Pedir capturas de Insights recientes (evita perfiles con seguidores comprados/engagement inflado).
3. Llamada corta de 15 min para verificar que entiende — y acepta — las reglas de compliance de la Parte 2.

### Estructura de oferta recomendada (rangos orientativos del sector, no cifras garantizadas — valídalas con 2-3
creadoras reales antes de fijar presupuesto)
- Pago base fijo por Reel/integración + código de descuento propio con comisión por registro/conversión
  (alinea su incentivo con resultados reales, no solo con "postear").
- Derechos de uso ("whitelisting"): pedir permiso para repostar como anuncio pagado (Meta Advantage+/Spark Ads)
  durante 30-90 días — esto suele valer más que el post orgánico en sí.
- Empezar con una prueba de 1-2 piezas antes de comprometerse a un contrato de varios meses o exclusividad.

### Brief que se le entrega a la creadora (documento aparte, recomendado)
- Mensajes clave permitidos / prohibidos (ver reglas de compliance arriba).
- Assets: acceso a una cuenta demo de gold-simulator para grabar pantalla real, guía de marca (dorado/negro,
  no verde), y 2-3 ejemplos de hooks de la Parte 2 como punto de partida (no como guion cerrado — el contenido
  más auténtico de @letscallkamilla funciona porque no suena leído).
