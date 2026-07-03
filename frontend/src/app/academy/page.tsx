'use client';
import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useAccount } from '@/hooks/useAccount';
import clsx from 'clsx';
import Link from 'next/link';

// ─── Data ────────────────────────────────────────────────────────────────────

const LEVELS = [
  {
    id: 1,
    name: 'Principiante',
    emoji: '🟡',
    subtitle: 'Cero a primer trade',
    color: 'border-yellow-500/40 bg-yellow-500/5',
    accent: 'text-yellow-400',
    bar: 'bg-yellow-500',
    xpRequired: 0,
    modules: [
      {
        id: 'l1-m1',
        title: '¿Qué es el oro (XAU/USD)?',
        duration: '5 min',
        type: 'lesson',
        icon: '📖',
        content: [
          {
            heading: 'El oro como activo financiero',
            body: `XAU es el símbolo del oro en los mercados financieros. USD es el dólar americano. Cuando ves "XAUUSD = 2.340", significa que 1 onza de oro cuesta 2.340 dólares.

El oro es uno de los activos más negociados del mundo porque:
• Es refugio seguro en crisis económicas
• Se mueve con fuerza cuando hay inflación
• Opera 24/5 (lunes a viernes)
• Tiene alta liquidez — puedes entrar y salir rápido`,
          },
          {
            heading: '¿Cuánto mueve el oro al día?',
            body: `El oro típicamente mueve entre 10 y 30 dólares al día. Esto es importante porque:

• 1 pip en XAUUSD = $0.01 (0,01 dólares)
• Un movimiento de $10 = 1.000 pips
• Con 0.01 lotes, 1.000 pips = $10 de ganancia o pérdida

Consejo: El oro es volátil. Respeta siempre tu Stop Loss.`,
          },
          {
            heading: 'Horarios clave del oro',
            body: `El oro tiene sesiones con más movimiento:

🇬🇧 Londres (8:00–16:00 GMT): Apertura europea, primer gran movimiento
🇺🇸 Nueva York (13:00–21:00 GMT): El más volátil, máximos y mínimos del día
⚠️ Noticias económicas (CPI, NFP, Fed): Movimientos de 20-50 dólares en minutos

Principiante: Evita tradear durante publicaciones de noticias hasta nivel 2.`,
          },
        ],
        quiz: [
          { q: 'XAU/USD 2.340 significa que...', options: ['El dólar vale $2.340', '1 onza de oro vale $2.340', 'El oro subió $2.340 hoy'], answer: 1 },
          { q: 'El horario más volátil del oro es...', options: ['Sesión asiática', 'Sesión de Nueva York', 'Fin de semana'], answer: 1 },
        ],
      },
      {
        id: 'l1-m2',
        title: 'Lotes, pips y valor monetario',
        duration: '8 min',
        type: 'lesson',
        icon: '📐',
        content: [
          {
            heading: 'Tamaño de lote: cuánto arriesgas',
            body: `En el mercado del oro, el tamaño de posición se mide en lotes:

📦 1 lote estándar = 100 oz de oro → $10 por pip
📦 0.10 lotes (mini) = 10 oz → $1 por pip
📦 0.01 lotes (micro) = 1 oz → $0.10 por pip

Ejemplo real:
• Compras 0.10 lotes a $2.340
• El precio sube a $2.350 (+$10 = +1.000 pips)
• Ganancia: 1.000 pips × $1 = $10`,
          },
          {
            heading: 'Cálculo de riesgo en dinero',
            body: `La regla de oro (literalmente): NUNCA arriesgues más del 1-2% por trade.

Con cuenta de $10.000:
• 1% = $100 de riesgo máximo por operación
• Si tu SL es de 50 pips ($5 por pip con 0.10 lotes)
• Puedes usar 0.10 lotes (50 pips × $1 = $50... menos del 1%)

Calculadora rápida:
Lotes = (Capital × % riesgo) ÷ (SL en pips × valor pip)`,
          },
          {
            heading: 'El spread del oro',
            body: `El spread es la diferencia entre el precio de compra (ask) y venta (bid).

Ejemplo:
• Bid: $2.339,50 (precio al que vendes)
• Ask: $2.340,00 (precio al que compras)
• Spread: $0.50 = 50 pips

Esto significa que al abrir una posición, ya empiezas con -$0.50 × tus lotes. Con brokers buenos el spread del oro es 15-30 pips.

⚠️ Ojo con brokers con spreads de 100+ pips — te roban sin que te des cuenta.`,
          },
        ],
        quiz: [
          { q: 'Con 0.01 lotes, ¿cuánto vale 1 pip en oro?', options: ['$1', '$0.10', '$10'], answer: 1 },
          { q: 'Tienes $5.000. Riesgo máximo por trade al 1%:', options: ['$500', '$50', '$5.000'], answer: 1 },
        ],
      },
      {
        id: 'l1-m3',
        title: 'Stop Loss y Take Profit',
        duration: '6 min',
        type: 'lesson',
        icon: '🛡️',
        content: [
          {
            heading: '¿Qué es el Stop Loss?',
            body: `El Stop Loss (SL) es tu red de seguridad. Es el precio al que tu operación se cierra automáticamente para limitar pérdidas.

SIN Stop Loss = ruleta rusa. El mercado puede ir en tu contra 500 pips mientras duermes.

CON Stop Loss a 50 pips = sabes exactamente cuánto puedes perder.

Regla número 1: Nunca abras un trade sin Stop Loss. Jamás.`,
          },
          {
            heading: '¿Qué es el Take Profit?',
            body: `El Take Profit (TP) es el precio objetivo donde tu operación se cierra automáticamente con ganancia.

¿Por qué usarlo? Porque la codicia mata accounts.
• Precio sube +$15, estás feliz
• No tienes TP, piensas "sube más"
• Precio baja -$20, pierdes

Configura el TP antes de abrir el trade, no después.`,
          },
          {
            heading: 'Ratio Riesgo:Beneficio (R:R)',
            body: `El ratio R:R es cuánto ganas vs cuánto arriesgas.

❌ Malo: SL = 50 pips, TP = 25 pips → R:R 1:0.5 (pierdes más de lo que ganas)
✅ Mínimo: SL = 50 pips, TP = 50 pips → R:R 1:1
🏆 Objetivo: SL = 50 pips, TP = 100 pips → R:R 1:2

Con R:R 1:2 puedes perder 6 de cada 10 trades y SEGUIR siendo rentable. La matemática funciona a tu favor.`,
          },
        ],
        quiz: [
          { q: '¿Qué hace el Stop Loss?', options: ['Cierra el trade con ganancia', 'Limita tu pérdida máxima', 'Aumenta tu lote'], answer: 1 },
          { q: 'Con R:R 1:2, si arriesgas $100, ¿cuánto ganas si el TP se alcanza?', options: ['$50', '$100', '$200'], answer: 2 },
        ],
      },
      {
        id: 'l1-m4',
        title: 'Tu primer trade en el simulador',
        duration: '10 min',
        type: 'practice',
        icon: '⚡',
        content: [
          {
            heading: 'Practica ahora en el simulador',
            body: `Es el momento de abrir tu primera operación. Ve a la sección "Simular" y completa estos pasos:

1. Observa el gráfico — ¿el precio sube o baja en los últimos 15 minutos?
2. Si sube → BUY (compra). Si baja → SELL (venta)
3. Pon tu Stop Loss a 30 pips del precio de entrada
4. Pon tu Take Profit a 60 pips (R:R 1:2)
5. Usa 0.01 lotes (micro, riesgo mínimo)
6. Abre el trade y observa el resultado`,
          },
          {
            heading: 'Qué aprender de este trade',
            body: `No importa si ganas o pierdes en tu primer trade. Lo importante es:

✅ ¿Pusiste Stop Loss? ← Esto es lo más importante
✅ ¿Tu R:R era mayor a 1:1?
✅ ¿Calculaste el riesgo antes de entrar?

Si respondiste sí a las tres, vas por buen camino. El resultado (ganancia/pérdida) en un solo trade no importa — lo que importa es el proceso.`,
          },
        ],
        quiz: [],
        isPractice: true,
      },
      {
        id: 'l1-m5',
        title: 'MetaTrader 5: Primeros pasos',
        duration: '10 min',
        type: 'guide',
        icon: '🖥️',
        content: [
          {
            heading: 'Qué es MetaTrader 5',
            body: `MetaTrader 5 (MT5) es la plataforma de trading más usada del mundo. Los brokers de fondeo (FTMO, MyFundedFX, etc.) usan MT5 para que operes con su dinero.

Diferencia clave: Este simulador te enseña los CONCEPTOS. MT5 es donde lo aplicarás con dinero real cuando estés listo.`,
          },
          {
            heading: 'Interfaz de MT5 — Zonas principales',
            body: `MT5 tiene 4 zonas que debes conocer:

📊 Gráfico (centro): Donde ves el precio del oro en tiempo real
📋 Market Watch (izquierda): Lista de activos disponibles. Busca XAUUSD
⚡ Terminal (abajo): Tus posiciones abiertas, historial, balance
🔧 Toolbar (arriba): Botones para órdenes, indicadores, timeframes

Este simulador está diseñado para parecerse a MT5. Todo lo que aprendes aquí se transfiere directamente.`,
          },
          {
            heading: 'Cómo abrir un trade en MT5',
            body: `Para abrir una operación en MT5:

1. Haz doble clic en XAUUSD en el Market Watch
2. Se abre la ventana de orden
3. Selecciona tipo: "Market Execution" (orden al precio actual)
4. Escribe el lote (empieza con 0.01)
5. Pon Stop Loss y Take Profit en la misma ventana
6. Clic en BUY (verde) o SELL (rojo)

⚠️ Importante: En MT5 real, las operaciones tienen consecuencias reales. Practica aquí hasta dominar los conceptos.`,
          },
          {
            heading: 'Timeframes en MT5',
            body: `El timeframe es el "zoom" del gráfico:

M1 = cada vela = 1 minuto (mucho ruido, difícil para principiantes)
M15 = cada vela = 15 minutos ← Empieza aquí
H1 = cada vela = 1 hora (más clara, menos señales falsas)
H4 = cada vela = 4 horas (tendencias grandes)
D1 = cada vela = 1 día (contexto general)

Para principiantes: usa H1 para el análisis y M15 para la entrada.`,
          },
        ],
        quiz: [
          { q: 'En MT5, el Terminal (abajo) muestra:', options: ['El gráfico de precios', 'Tus posiciones abiertas y balance', 'Los indicadores técnicos'], answer: 1 },
          { q: 'Para principiantes, el timeframe recomendado para análisis es:', options: ['M1', 'H1', 'M5'], answer: 1 },
        ],
      },
      {
        id: 'l1-m6',
        title: 'TradingView para análisis',
        duration: '8 min',
        type: 'guide',
        icon: '📈',
        content: [
          {
            heading: '¿Qué es TradingView?',
            body: `TradingView es la herramienta de análisis técnico más popular del mundo. Muchos traders usan MT5 para ejecutar trades y TradingView para analizar.

URL: tradingview.com — crea cuenta gratuita
Busca: XAUUSD o GOLD

La versión gratuita es suficiente para empezar.`,
          },
          {
            heading: 'Herramientas esenciales en TradingView',
            body: `Las 5 herramientas que usarás el 90% del tiempo:

📏 Línea de tendencia (tecla \\ ): Dibuja tendencias
📐 Retrocesos Fibonacci: Niveles de soporte/resistencia
📦 Rectángulo: Marca zonas de precio importantes
📍 Línea horizontal: Marca soportes y resistencias exactos
📝 Texto: Añade notas a tus análisis

Truco: Guarda tus análisis en "Ideas" para revisar si acertaste.`,
          },
          {
            heading: 'Cómo ver el oro en TradingView',
            body: `Configuración recomendada para analizar XAUUSD:

1. Busca "XAUUSD" en la barra de búsqueda
2. Selecciona OANDA:XAUUSD o FX:XAUUSD
3. Cambia a timeframe H1 o H4
4. Activa el tipo de gráfico "Velas japonesas" (candlesticks)
5. Añade indicador EMA 20 y EMA 50 (búscalos en Indicadores)

Las EMAs te muestran la tendencia de forma visual.`,
          },
          {
            heading: 'TradingView + MT5: El flujo de trabajo',
            body: `El flujo de trabajo profesional:

1. TradingView: Analiza el gráfico H4 → Identifica tendencia
2. TradingView: Baja a H1 → Busca punto de entrada
3. TradingView: Dibuja SL y TP → Calcula R:R
4. MT5: Ejecuta la orden con los niveles que calculaste en TV
5. MT5: Monitorea la posición

Este flujo separa el análisis de la ejecución — reduce errores emocionales.`,
          },
        ],
        quiz: [
          { q: 'TradingView se usa principalmente para:', options: ['Ejecutar trades', 'Analizar gráficos', 'Calcular impuestos'], answer: 1 },
          { q: 'El flujo profesional es:', options: ['Solo MT5', 'Solo TradingView', 'TradingView para análisis + MT5 para ejecutar'], answer: 2 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Intermedio',
    emoji: '🔵',
    subtitle: 'Gestión de riesgo profesional',
    color: 'border-blue-500/40 bg-blue-500/5',
    accent: 'text-blue-400',
    bar: 'bg-blue-500',
    xpRequired: 500,
    modules: [
      {
        id: 'l2-m1',
        title: 'Velas japonesas — Los 5 patrones clave',
        duration: '12 min',
        type: 'lesson',
        icon: '🕯️',
        content: [
          {
            heading: 'Por qué importan las velas japonesas',
            body: `Cada vela japonesa cuenta una historia de 4 precios:
• Apertura (Open): precio al inicio del período
• Máximo (High): precio más alto alcanzado
• Mínimo (Low): precio más bajo alcanzado
• Cierre (Close): precio al final del período

El cuerpo (body) muestra si los compradores o vendedores ganaron ese período.
Verde/Blanco = compradores ganaron (precio subió)
Rojo/Negro = vendedores ganaron (precio bajó)`,
          },
          {
            heading: 'Los 5 patrones que necesitas para el oro',
            body: `🔨 Martillo (Hammer): Mecha larga abajo, cuerpo arriba → señal de compra en soporte
⭐ Doji: Cuerpo casi inexistente → indecisión del mercado, espera confirmación
🌟 Engulfing alcista: Vela verde engulle la roja anterior → fuerte señal de compra
⭐ Engulfing bajista: Vela roja engulle la verde anterior → fuerte señal de venta
📌 Pin bar: Mecha larga, rechazo del precio → señal de reversión

En el oro, los Pin bars en zonas de soporte/resistencia son especialmente fiables.`,
          },
          {
            heading: 'Cómo identificarlos en TradingView',
            body: `Para practicar la identificación de patrones:

1. Abre XAUUSD en TradingView en H1
2. Busca retrocesos (cuando el precio baja después de subir)
3. ¿Aparece un martillo o pin bar cuando llega a un soporte?
4. Ese es tu setup de entrada

Recuerda: Los patrones solos no bastan. Necesitas:
• Patrón en zona de soporte/resistencia ✓
• Tendencia general a favor ✓
• R:R mínimo 1:2 ✓`,
          },
        ],
        quiz: [
          { q: 'Un Doji indica:', options: ['Fuerte tendencia alcista', 'Indecisión del mercado', 'Señal de venta segura'], answer: 1 },
          { q: 'Un pin bar es más fiable cuando aparece en:', options: ['Cualquier precio', 'Una zona de soporte o resistencia', 'Durante noticias'], answer: 1 },
        ],
      },
      {
        id: 'l2-m2',
        title: 'Soportes, Resistencias y Zonas de Liquidez',
        duration: '15 min',
        type: 'lesson',
        icon: '🧱',
        content: [
          {
            heading: 'Soportes y resistencias en el oro',
            body: `Soporte: Nivel de precio donde el oro "rebota" hacia arriba repetidamente
Resistencia: Nivel donde el oro "rebota" hacia abajo repetidamente

En el oro, los niveles más importantes son:
• Números redondos: $2.300, $2.350, $2.400 (el mercado los respeta mucho)
• Máximos y mínimos previos del día/semana
• Zonas donde el precio pasó varias veces

Truco del oro: Los números redondos en el oro funcionan como imanes. El precio tiende a ir a buscarlos.`,
          },
          {
            heading: 'Zonas de liquidez — dónde están los Stop Loss',
            body: `Los traders institucionales mueven el mercado buscando liquidez (Stop Loss de otros traders).

¿Dónde pone la gente su SL?
• Por debajo de mínimos obvios → ahí hay liquidez bajista
• Por encima de máximos obvios → ahí hay liquidez alcista

El mercado frecuentemente "barre" estos niveles antes de moverse en la dirección real. A esto se llama "fake out" o "stop hunt".

Estrategia: Pon tu SL un poco MÁS ALLÁ del nivel obvio para evitar ser barrido.`,
          },
          {
            heading: 'Cómo dibujar zonas en TradingView',
            body: `Proceso para identificar zonas en XAUUSD:

1. Abre H4 en TradingView
2. Identifica los 3 máximos y 3 mínimos más recientes y significativos
3. Dibuja líneas horizontales en esos precios
4. Baja a H1 — ¿el precio está cerca de alguna zona?
5. Si está cerca de soporte → busca señal de compra
6. Si está cerca de resistencia → busca señal de venta o espera

Regla: No compres en medio de nada. Espera las zonas.`,
          },
        ],
        quiz: [
          { q: '¿Por qué los números redondos son importantes en el oro?', options: ['Son aleatorios', 'El mercado los respeta psicológicamente', 'Solo importan en forex'], answer: 1 },
          { q: 'El "stop hunt" es cuando el mercado:', options: ['Sube indefinidamente', 'Barre los SL obvios antes de moverse en dirección real', 'Se queda quieto'], answer: 1 },
        ],
      },
      {
        id: 'l2-m3',
        title: 'Gestión de riesgo avanzada',
        duration: '10 min',
        type: 'lesson',
        icon: '⚖️',
        content: [
          {
            heading: 'La regla del 1% — Por qué salva cuentas',
            body: `Con la regla del 1% por trade:

Puedes perder 10 trades seguidos y solo pierdes el 10% de la cuenta.
Con 20 trades malos seguidos: pierdes ~18% (gracias al interés compuesto negativo).

Sin regla de riesgo: 3 trades malos con 10% de riesgo = -27%. Casi fuera.

Matemática del fondeo: Las cuentas FTMO tienen límite de 10% de drawdown máximo. Con 1% por trade, necesitas 10 pérdidas seguidas para perder la cuenta. Con 5% por trade, solo necesitas 2.`,
          },
          {
            heading: 'Calculadora de tamaño de posición',
            body: `Fórmula exacta para el oro:

Lotes = (Balance × % Riesgo) ÷ (SL en pips × $1)

Ejemplo:
• Balance: $10.000
• Riesgo: 1% = $100
• SL: 50 pips
• Lotes = $100 ÷ (50 × $1) = 2 lotes... ¡espera!

Con 1 lote en oro, 1 pip = $10. Así que:
• Lotes = $100 ÷ (50 pips × $10/pip) = 0.20 lotes

Siempre calcula ANTES de abrir. Nunca a ojo.`,
          },
          {
            heading: 'Gestión de trades abiertos',
            body: `Una vez dentro del trade, estas son las reglas:

1. NUNCA muevas el SL más lejos (añadir riesgo = error fatal)
2. SÍ puedes mover el SL al breakeven (precio de entrada) cuando el precio va a tu favor 50%
3. Trailing stop: mueve el SL siguiendo el precio para proteger ganancias
4. No añadas posiciones perdedoras (averaging down = manera rápida de arruinar cuenta)

Breakeven en práctica:
• Entras en compra a $2.340, SL $2.320, TP $2.380
• Precio sube a $2.360 (mitad del camino)
• Mueve SL a $2.340 → ahora no puedes perder dinero`,
          },
        ],
        quiz: [
          { q: 'Con la regla del 1%, ¿cuántos trades perdedores seguidos necesitas para que sea grave?', options: ['2', '5', 'Muchos más — el daño es gradual'], answer: 2 },
          { q: 'Mover el SL al breakeven significa moverlo a:', options: ['El precio más bajo del día', 'Tu precio de entrada', 'El Take Profit'], answer: 1 },
        ],
      },
      {
        id: 'l2-m4',
        title: 'Simulacro Fase 1 FTMO — Practica',
        duration: '20 min',
        type: 'challenge',
        icon: '🏆',
        content: [
          {
            heading: 'Las reglas de una cuenta de fondeo',
            body: `Las empresas de fondeo (FTMO, MyFundedFX, Topstep) te dan dinero para operar a cambio de seguir sus reglas:

📋 Reglas típicas de Fase 1:
• Objetivo de beneficio: +8% (ganar $800 en cuenta de $10K)
• Máxima pérdida diaria: -5% (-$500 en $10K)
• Máximo drawdown total: -10% (-$1.000 en $10K)
• Tiempo: 30 días (algunas sin límite)
• Sin restricciones de estilo de trading

⚠️ Si pierdes el 5% en un día, la cuenta se congela.
⚠️ Si el balance baja un 10% total, pierdes la cuenta.`,
          },
          {
            heading: 'Tu reto: Simula la Fase 1',
            body: `En el simulador, activa el "Modo Fondeo" y opera durante 10 sesiones con estas reglas:

✅ Objetivo: llegar a +8% de beneficio
🛑 Límite diario: no perder más del 5% en un día
🛑 Drawdown: no bajar del 10% del balance inicial

Estrategia sugerida:
• Máximo 1-2 trades por día
• Riesgo por trade: 0.5-1%
• Solo opera en zonas claras de soporte/resistencia
• Si llevas -2% en el día → para de operar

La paciencia vale más que las señales. Espera el setup correcto.`,
          },
        ],
        quiz: [],
        isPractice: true,
      },
      {
        id: 'l2-m5',
        title: 'Indicadores técnicos en MT5 y TradingView',
        duration: '12 min',
        type: 'guide',
        icon: '📡',
        content: [
          {
            heading: 'Los 3 indicadores que realmente funcionan en el oro',
            body: `Hay cientos de indicadores. Estos 3 son los más efectivos para XAU/USD:

📈 EMA (Media Móvil Exponencial):
• EMA 20 + EMA 50 en H1
• Cuando EMA 20 cruza sobre EMA 50 → tendencia alcista
• Cuando EMA 20 cruza bajo EMA 50 → tendencia bajista
• El precio por encima de ambas EMAs = tendencia alcista

📊 RSI (Relative Strength Index):
• RSI > 70 = sobrecomprado (considera vender)
• RSI < 30 = sobrevendido (considera comprar)
• En tendencias fuertes, el RSI puede quedarse en zonas extremas largo tiempo

📈 MACD:
• Cruce alcista de líneas → señal de compra
• Histograma cambia de negativo a positivo → confirmación`,
          },
          {
            heading: 'Cómo añadir indicadores en MT5',
            body: `En MetaTrader 5:

Para EMA:
1. Clic en "Insert" → "Indicators" → "Trend" → "Moving Average"
2. Period: 20, Method: Exponential, Color: azul
3. Repite con period 50, color: naranja

Para RSI:
1. Insert → Indicators → Oscillators → Relative Strength Index
2. Period: 14 (estándar)
3. Aparece bajo el gráfico principal

Para MACD:
1. Insert → Indicators → Oscillators → MACD
2. Configuración estándar: 12, 26, 9`,
          },
          {
            heading: 'Cómo añadir indicadores en TradingView',
            body: `En TradingView es más sencillo:

1. Clic en "Indicadores" (parte superior del gráfico)
2. Busca "EMA" → selecciona "Exponential Moving Average"
3. Cambia el período a 20 → Añadir
4. Repite con período 50
5. Para RSI: busca "RSI" → añadir
6. Para MACD: busca "MACD" → añadir

TradingView Pro: Puedes crear alertas en indicadores. Ejemplo: "Alértame cuando el RSI del oro baje de 30".

Esto es enormemente útil para no estar pegado a la pantalla.`,
          },
        ],
        quiz: [
          { q: 'RSI por debajo de 30 indica:', options: ['El oro está muy caro', 'El oro podría estar sobrevendido', 'Señal de venta segura'], answer: 1 },
          { q: 'Cuando la EMA 20 cruza sobre la EMA 50:', options: ['Señal bajista', 'Señal alcista', 'Sin señal'], answer: 1 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Avanzado',
    emoji: '🔴',
    subtitle: 'Mentalidad y fondeo real',
    color: 'border-red-500/40 bg-red-500/5',
    accent: 'text-red-400',
    bar: 'bg-red-500',
    xpRequired: 1500,
    modules: [
      {
        id: 'l3-m1',
        title: 'Psicología del trading — El enemigo interior',
        duration: '15 min',
        type: 'lesson',
        icon: '🧠',
        content: [
          {
            heading: 'Los 4 errores psicológicos que destruyen cuentas',
            body: `Los traders no pierden por falta de estrategia. Pierden por psicología:

😱 FOMO (Fear Of Missing Out): Entrar tarde en un movimiento porque "no quieres perderte"
→ Resultado: entras en el peor punto, el mercado gira y pierdes

😡 Revenge trading: Perder un trade y querer recuperarlo inmediatamente
→ Resultado: 2ª pérdida mayor, luego 3ª... "tilt" total

🤞 Esperanza irracional: Mover el SL para no cerrar en pérdida
→ Resultado: pérdida pequeña se convierte en catástrofe

💰 Overtrading: Operar demasiado porque "hay que hacer algo"
→ Resultado: cedes todo el profit del mes en spreads y malos trades`,
          },
          {
            heading: 'El protocolo anti-FOMO',
            body: `Si sientes que "te estás perdiendo algo":

1. Para. Respira. No entres.
2. Recuerda: hay un nuevo setup CADA DÍA en el oro.
3. El mercado no se va a ningún lado — siempre vuelve.
4. Pregúntate: ¿Está este trade dentro de mi plan? Si no → no entras.

La disciplina de NO operar es tan valiosa como la disciplina de operar correctamente.

Regla de los 3 "noes":
• No es mi zona → No entro
• No tiene R:R 1:2 → No entro
• No está en mi horario de trading → No entro`,
          },
          {
            heading: 'Cómo manejar una racha perdedora',
            body: `Pérdida 1: Normal. El mercado es incierto.
Pérdida 2: Revisa el setup. ¿Seguiste el plan?
Pérdida 3 en un día → PARA. Cierra el ordenador.

Protocolo de pérdida diaria:
• Si llegas al -2%: alerta, reduce el lote a la mitad
• Si llegas al -3%: STOP. Sesión terminada.
• Si llegas al -5%: cuenta de fondeo congelada (regla real)

Después de una mala racha:
1. No operes durante 24-48h
2. Revisa tus últimos trades en el journal
3. ¿Seguiste las reglas? Si no → eso es el problema, no el mercado`,
          },
        ],
        quiz: [
          { q: 'El "revenge trading" es:', options: ['Una estrategia válida', 'Operar impulsivamente para recuperar pérdidas', 'Un tipo de orden'], answer: 1 },
          { q: 'Cuando llevas -3% en el día, debes:', options: ['Aumentar el lote para recuperar', 'Parar y cerrar el ordenador', 'Buscar más setups'], answer: 1 },
        ],
      },
      {
        id: 'l3-m2',
        title: 'El diario de trading (Trading Journal)',
        duration: '10 min',
        type: 'lesson',
        icon: '📔',
        content: [
          {
            heading: 'Por qué el journal es tu arma secreta',
            body: `Los traders rentables tienen una cosa en común: llevan un diario de trading.

Sin journal:
• Repites los mismos errores una y otra vez
• No sabes qué setups te funcionan
• No puedes demostrar a empresas de fondeo que eres consistente

Con journal:
• Identificas exactamente tus patrones de error
• Sabes qué horarios y setups son más rentables para ti
• Tienes evidencia de tu metodología (necesario para fondeo)`,
          },
          {
            heading: 'Qué registrar en cada trade',
            body: `Por cada operación, anota:

📌 ANTES del trade:
• Setup (¿qué viste en el gráfico?)
• Nivel de entrada, SL, TP
• Ratio R:R calculado
• Estado emocional (1-10)

📌 DESPUÉS del trade:
• Resultado (ganancia/pérdida)
• ¿Seguiste el plan? (sí/no)
• ¿Qué salió bien?
• ¿Qué mejorar?

Herramientas: Notion, Excel o simplemente un cuaderno. Lo que uses, úsalo SIEMPRE.`,
          },
          {
            heading: 'Análisis mensual — La revisión',
            body: `Cada fin de mes, analiza:

📊 Métricas clave:
• Win rate: ¿qué % de trades ganaste?
• Promedio R:R: ¿cuánto ganabas vs perdías?
• Mejor día de la semana: ¿lunes? ¿miércoles?
• Mejor horario: ¿sesión Londres o NY?
• Peor error del mes: ¿cuál fue?

Con 3 meses de journal, sabrás:
• Qué setups son TUS setups (no los de YouTube)
• Qué días operar y qué días descansar
• Si estás listo para fondeo`,
          },
        ],
        quiz: [
          { q: 'El trading journal sirve principalmente para:', options: ['Presumir en redes sociales', 'Identificar patrones de error y mejora', 'Calcular impuestos'], answer: 1 },
        ],
      },
      {
        id: 'l3-m3',
        title: 'Cómo pasar una cuenta de fondeo paso a paso',
        duration: '20 min',
        type: 'lesson',
        icon: '🏦',
        content: [
          {
            heading: 'Elegir la empresa de fondeo correcta',
            body: `Las principales empresas para XAU/USD:

🏆 FTMO: La más conocida. $200 por cuenta $10K. Rigurosa pero reputación excelente.
🏆 MyFundedFX: Más flexible, acepta news trading. Popular para oro.
🏆 Topstep: Buena para futuros de oro (GC).
🏆 FundedNext: Opción económica para empezar.

Para el oro, verifica que la empresa:
✅ Permita tradear XAUUSD
✅ No tenga restricciones de noticias (o avisa cuándo hay)
✅ Tenga spreads razonables (<50 pips en oro)
✅ No requiera un mínimo de días de trading`,
          },
          {
            heading: 'Plan de ataque para Fase 1',
            body: `Objetivo: +8% en 30 días sin violar reglas.

📅 Plan conservador (recomendado):
• 1-2 trades por día como máximo
• Riesgo: 0.5% por trade (en $10K = $50 por trade)
• Target diario: +0.5% ($50)
• Para llegar al 8%: necesitas ~16 días buenos
• Días malos (pérdidas): para en -2% (-$200)

Calendario tipo:
Semana 1: Observa más de lo que operas. 1 trade/día.
Semana 2: Encuentra tu ritmo. 1-2 trades/día.
Semana 3: Si vas bien (+4%), mantén el plan. No aceleres.
Semana 4: Si ya tienes el +8%, ¡para! No es necesario seguir.`,
          },
          {
            heading: 'Los errores que suspenden las cuentas de fondeo',
            body: `Los 5 errores que hacen perder cuentas de fondeo:

❌ Error 1: Aumentar el lote cuando vas bien ("todo va genial, voy a doblar")
❌ Error 2: Tradear durante noticias importantes sin saber el riesgo
❌ Error 3: No usar Stop Loss ("solo serán 5 minutos sin SL")
❌ Error 4: Dejar trades abiertos de un día para otro sin gestionar
❌ Error 5: Intentar recuperar pérdidas del día con lotes mayores

La cuenta de fondeo no es para "recuperar" — es para demostrar consistencia.

Si pierdes $300 un martes, no lo recuperes ese día. Empieza el miércoles fresco.`,
          },
        ],
        quiz: [
          { q: 'La estrategia correcta cuando ya tienes el +8% del objetivo es:', options: ['Seguir operando para ganar más', 'Parar y esperar la verificación', 'Doblar el lote para el bonus'], answer: 1 },
          { q: 'El mayor error psicológico en cuentas de fondeo es:', options: ['Operar pocos trades', 'Aumentar lotes cuando vas bien o para recuperar', 'Usar Stop Loss'], answer: 1 },
        ],
      },
      {
        id: 'l3-m4',
        title: 'Setups avanzados en XAU/USD',
        duration: '15 min',
        type: 'lesson',
        icon: '🎯',
        content: [
          {
            heading: 'Setup 1: Break and Retest',
            body: `El patrón más fiable en el oro:

1. El precio rompe una resistencia significativa con fuerza
2. El precio retrocede y "testea" ese nivel (ahora soporte)
3. Aparece señal de compra (pin bar, engulfing) en ese nivel
4. Entras en compra con SL debajo del soporte y TP al siguiente nivel

¿Por qué funciona? El mercado "prueba" el nivel roto para confirmar que es soporte. Los institucionales compran en ese retest.

En TradingView: Dibuja el nivel roto como zona. Espera el precio allí. Espera vela de confirmación. Entra.`,
          },
          {
            heading: 'Setup 2: Sesión de Londres — Primera hora',
            body: `El oro frecuentemente establece su dirección del día en los primeros 30-60 minutos de la sesión de Londres (8:00-9:00 GMT).

Estrategia:
1. Espera a las 8:00 GMT (apertura Londres)
2. Observa los primeros 15-30 minutos sin operar
3. ¿En qué dirección rompe el rango de la madrugada?
4. Entra en la dirección del breakout con SL debajo del rango
5. TP al siguiente nivel de resistencia/soporte significativo

Esta estrategia produce 1 trade claro al día, perfecta para fondeo.`,
          },
          {
            heading: 'Setup 3: Smart Money Concepts (SMC) básico',
            body: `SMC es la metodología de trading "institucional". Tres conceptos clave:

📊 Order Blocks: Zonas donde los institucionales pusieron órdenes grandes. El precio tiende a volver a ellas.

🔍 Cómo identificar un Order Block:
1. Busca una vela fuerte que inició un movimiento significativo
2. El cuerpo de esa vela = tu Order Block
3. Cuando el precio regrese a esa zona → setup de entrada

📍 Fair Value Gaps (FVG): Huecos de precio que el mercado tiende a "llenar"
1. Tres velas: vela 1 deja un hueco con vela 3
2. El precio casi siempre vuelve a llenar ese hueco
3. Cuando llena el FVG → busca setup de reversión`,
          },
        ],
        quiz: [
          { q: 'En el setup Break and Retest, ¿cuándo entras?', options: ['Cuando el precio rompe el nivel', 'Cuando el precio vuelve a testear el nivel roto', 'Al azar'], answer: 1 },
          { q: 'Un Fair Value Gap es:', options: ['Un indicador técnico', 'Un hueco de precio que el mercado tiende a llenar', 'El spread del broker'], answer: 1 },
        ],
      },
    ],
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function QuizModal({ questions, onClose }: { questions: { q: string; options: string[]; answer: number }[]; onClose: (passed: boolean) => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  if (questions.length === 0) { onClose(true); return null; }

  const score = answers.filter((a, i) => a === questions[i].answer).length;
  const passed = submitted ? score >= Math.ceil(questions.length * 0.7) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#1a1d24] border border-[#2e3340] w-full max-w-md mx-4 p-6 rounded-none">
        <div className="text-[11px] text-[#8892a4] uppercase tracking-wide mb-4">Quiz de comprensión</div>
        {!submitted ? (
          <>
            <div className="space-y-5">
              {questions.map((q, qi) => (
                <div key={qi}>
                  <div className="text-[12px] text-white mb-2 font-medium">{q.q}</div>
                  <div className="space-y-1">
                    {q.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => setAnswers(prev => { const n = [...prev]; n[qi] = oi; return n; })}
                        className={clsx(
                          'w-full text-left px-3 py-2 text-[11px] border transition-all',
                          answers[qi] === oi
                            ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-[#93c5fd]'
                            : 'border-[#2e3340] text-[#8892a4] hover:border-[#3b82f6]/50'
                        )}
                      >{opt}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSubmitted(true)}
              disabled={answers.some(a => a === null)}
              className="mt-6 w-full py-2 bg-[#3b82f6] text-white text-[11px] font-medium disabled:opacity-40"
            >Comprobar respuestas</button>
          </>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-3">{passed ? '✅' : '❌'}</div>
            <div className="text-white font-bold mb-1">{score}/{questions.length} correctas</div>
            <div className="text-[11px] text-[#8892a4] mb-4">{passed ? '¡Módulo completado!' : 'Revisa el contenido e inténtalo de nuevo'}</div>
            <button onClick={() => onClose(passed)} className="px-6 py-2 bg-[#3b82f6] text-white text-[11px]">
              {passed ? 'Continuar →' : 'Volver al módulo'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ModuleViewer({ module: mod, onComplete, onClose }: {
  module: typeof LEVELS[0]['modules'][0];
  onComplete: () => void;
  onClose: () => void;
}) {
  const [page, setPage] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const content = mod.content;
  const current = content[page];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80">
      <div className="bg-[#141720] border border-[#2e3340] w-full max-w-2xl mx-4 flex flex-col" style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#1a1d24] border-b border-[#2e3340] shrink-0">
          <div className="flex items-center gap-2">
            <span>{mod.icon}</span>
            <span className="text-[12px] font-medium text-white">{mod.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#8892a4]">{page + 1} / {content.length}</span>
            <button onClick={onClose} className="text-[#8892a4] hover:text-white text-lg leading-none">×</button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-[#2e3340]">
          <div className="h-full bg-[#3b82f6] transition-all" style={{ width: `${((page + 1) / content.length) * 100}%` }} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-[14px] font-bold text-[#60a5fa] mb-4">{current.heading}</h2>
          <div className="text-[11px] text-[#c8cdd8] leading-relaxed whitespace-pre-line">{current.body}</div>

          {mod.isPractice && (
            <Link href="/trade" className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-[#16a34a]/20 border border-[#16a34a]/40 text-[#4ade80] text-[11px] hover:bg-[#16a34a]/30 transition-all">
              ⚡ Ir al simulador →
            </Link>
          )}
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#1a1d24] border-t border-[#2e3340] shrink-0">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 0}
            className="px-4 py-1.5 text-[11px] border border-[#2e3340] text-[#8892a4] disabled:opacity-30 hover:border-[#3b82f6]/50 hover:text-white transition-all"
          >← Anterior</button>

          {page < content.length - 1 ? (
            <button onClick={() => setPage(p => p + 1)} className="px-4 py-1.5 text-[11px] bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-all">
              Siguiente →
            </button>
          ) : (
            <button
              onClick={() => mod.quiz.length > 0 ? setShowQuiz(true) : onComplete()}
              className="px-4 py-1.5 text-[11px] bg-[#16a34a] text-white hover:bg-[#15803d] transition-all"
            >
              {mod.quiz.length > 0 ? '📝 Hacer quiz →' : '✅ Completar módulo'}
            </button>
          )}
        </div>
      </div>

      {showQuiz && (
        <QuizModal
          questions={mod.quiz}
          onClose={(passed) => {
            setShowQuiz(false);
            if (passed) onComplete();
          }}
        />
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AcademyPage() {
  const { account } = useAccount();
  const [activeLevel, setActiveLevel] = useState(0);
  const [activeModule, setActiveModule] = useState<typeof LEVELS[0]['modules'][0] | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gt_completed_modules');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  const xp = account?.xp ?? 0;
  const level = LEVELS[activeLevel];

  const completeModule = (moduleId: string) => {
    setCompletedModules(prev => {
      const next = new Set(prev);
      next.add(moduleId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('gt_completed_modules', JSON.stringify([...next]));
      }
      return next;
    });
    setActiveModule(null);
  };

  const levelProgress = (lvl: typeof LEVELS[0]) => {
    const done = lvl.modules.filter(m => completedModules.has(m.id)).length;
    return { done, total: lvl.modules.length, pct: Math.round((done / lvl.modules.length) * 100) };
  };

  const isLevelUnlocked = (lvl: typeof LEVELS[0]) => xp >= lvl.xpRequired;

  return (
    <AppShell>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[var(--mt-text-label)] font-medium uppercase tracking-wide" style={{ fontSize: 11 }}>
              🎓 GoldTrader Academy — XAU/USD
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[var(--mt-yellow)] font-mono">⚡ {xp} XP</span>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Level tabs */}
          <div className="w-52 border-r border-[var(--mt-border)] bg-[var(--mt-bg)] flex flex-col shrink-0">
            <div className="p-3 border-b border-[var(--mt-border)]">
              <div className="text-[9px] text-[var(--mt-text-dim)] uppercase tracking-wide">Tu progreso</div>
            </div>
            {LEVELS.map((lvl, i) => {
              const prog = levelProgress(lvl);
              const unlocked = isLevelUnlocked(lvl);
              return (
                <button
                  key={lvl.id}
                  onClick={() => unlocked && setActiveLevel(i)}
                  disabled={!unlocked}
                  className={clsx(
                    'flex flex-col p-3 text-left border-b border-[var(--mt-border)] transition-all',
                    activeLevel === i ? 'bg-[var(--mt-toolbar)]' : '',
                    !unlocked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--mt-toolbar)]'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontSize: 14 }}>{lvl.emoji}</span>
                    <div>
                      <div className="font-medium text-[var(--mt-white)]" style={{ fontSize: 11 }}>Nivel {lvl.id}</div>
                      <div className="text-[var(--mt-text-dim)]" style={{ fontSize: 9 }}>{lvl.name}</div>
                    </div>
                    {!unlocked && <span className="ml-auto text-[10px]">🔒</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-[var(--mt-border)] rounded-none overflow-hidden">
                      <div className={clsx('h-full transition-all', lvl.bar)} style={{ width: `${prog.pct}%` }} />
                    </div>
                    <span className="text-[9px] text-[var(--mt-text-dim)]">{prog.done}/{prog.total}</span>
                  </div>
                  {!unlocked && (
                    <div className="text-[9px] text-[var(--mt-text-dim)] mt-1">Necesitas {lvl.xpRequired} XP</div>
                  )}
                </button>
              );
            })}

            {/* Quick links */}
            <div className="mt-auto p-3 border-t border-[var(--mt-border)]">
              <div className="text-[9px] text-[var(--mt-text-dim)] uppercase tracking-wide mb-2">Acceso rápido</div>
              <Link href="/trade" className="flex items-center gap-2 py-1 text-[10px] text-[var(--mt-cyan)] hover:text-white transition-all">
                ⚡ Simulador
              </Link>
              <Link href="/stats" className="flex items-center gap-2 py-1 text-[10px] text-[var(--mt-cyan)] hover:text-white transition-all">
                📊 Mis estadísticas
              </Link>
              <Link href="/history" className="flex items-center gap-2 py-1 text-[10px] text-[var(--mt-cyan)] hover:text-white transition-all">
                📋 Mi historial
              </Link>
            </div>
          </div>

          {/* Module list */}
          <div className="flex-1 overflow-y-auto">
            {/* Level header */}
            <div className={clsx('mx-4 mt-4 p-4 border', level.color)}>
              <div className="flex items-center gap-3 mb-2">
                <span style={{ fontSize: 24 }}>{level.emoji}</span>
                <div>
                  <div className={clsx('font-bold', level.accent)} style={{ fontSize: 14 }}>Nivel {level.id}: {level.name}</div>
                  <div className="text-[var(--mt-text-dim)]" style={{ fontSize: 11 }}>{level.subtitle}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className={clsx('font-mono font-bold', level.accent)} style={{ fontSize: 16 }}>
                    {levelProgress(level).pct}%
                  </div>
                  <div className="text-[var(--mt-text-dim)]" style={{ fontSize: 9 }}>completado</div>
                </div>
              </div>
              <div className="h-1.5 bg-[var(--mt-border)]">
                <div className={clsx('h-full transition-all', level.bar)} style={{ width: `${levelProgress(level).pct}%` }} />
              </div>
            </div>

            {/* Modules */}
            <div className="p-4 space-y-2">
              {level.modules.map((mod, mi) => {
                const done = completedModules.has(mod.id);
                const prevDone = mi === 0 || completedModules.has(level.modules[mi - 1].id);
                const locked = !prevDone;

                return (
                  <button
                    key={mod.id}
                    onClick={() => !locked && setActiveModule(mod)}
                    disabled={locked}
                    className={clsx(
                      'w-full flex items-center gap-4 p-3 border text-left transition-all',
                      done ? 'border-[#16a34a]/40 bg-[#16a34a]/5' : '',
                      !done && !locked ? 'border-[var(--mt-border)] hover:border-[var(--mt-sep)] bg-[var(--mt-bg)] hover:bg-[var(--mt-toolbar)]' : '',
                      locked ? 'border-[var(--mt-border)] bg-[var(--mt-bg)] opacity-40 cursor-not-allowed' : '',
                    )}
                  >
                    {/* Status icon */}
                    <div className={clsx(
                      'w-8 h-8 flex items-center justify-center border shrink-0',
                      done ? 'border-[#16a34a]/50 bg-[#16a34a]/10 text-[#4ade80]' : 'border-[var(--mt-border)] text-[var(--mt-text-dim)]'
                    )} style={{ fontSize: 16 }}>
                      {done ? '✓' : locked ? '🔒' : mod.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={clsx('font-medium', done ? 'text-[#4ade80]' : 'text-[var(--mt-white)]')} style={{ fontSize: 12 }}>
                          {mod.title}
                        </span>
                        <span className={clsx(
                          'text-[9px] px-1.5 py-0.5 border uppercase tracking-wide',
                          mod.type === 'lesson' ? 'border-[#3b82f6]/30 text-[#60a5fa] bg-[#3b82f6]/10' :
                          mod.type === 'practice' ? 'border-[#16a34a]/30 text-[#4ade80] bg-[#16a34a]/10' :
                          mod.type === 'guide' ? 'border-[#f59e0b]/30 text-[#fbbf24] bg-[#f59e0b]/10' :
                          'border-[#ef4444]/30 text-[#f87171] bg-[#ef4444]/10'
                        )}>
                          {mod.type === 'lesson' ? '📖 Lección' :
                           mod.type === 'practice' ? '⚡ Práctica' :
                           mod.type === 'guide' ? '🗺️ Guía' : '🏆 Reto'}
                        </span>
                      </div>
                      <div className="text-[var(--mt-text-dim)]" style={{ fontSize: 10 }}>
                        ⏱ {mod.duration} · {mod.content.length} secciones{mod.quiz.length > 0 ? ` · ${mod.quiz.length} preguntas` : ''}
                      </div>
                    </div>

                    {/* Arrow */}
                    {!locked && (
                      <span className="text-[var(--mt-text-dim)] shrink-0" style={{ fontSize: 14 }}>›</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Level completion */}
            {levelProgress(level).pct === 100 && activeLevel < LEVELS.length - 1 && (
              <div className="mx-4 mb-4 p-4 border border-[#f59e0b]/40 bg-[#f59e0b]/5 text-center">
                <div className="text-2xl mb-2">🏆</div>
                <div className="font-bold text-[#fbbf24]" style={{ fontSize: 13 }}>¡Nivel {level.id} completado!</div>
                <div className="text-[var(--mt-text-dim)] mb-3" style={{ fontSize: 11 }}>
                  Sigue operando en el simulador para ganar XP y desbloquear el Nivel {level.id + 1}
                </div>
                <div className="text-[10px] text-[var(--mt-text-dim)]">
                  Necesitas {LEVELS[activeLevel + 1].xpRequired} XP · Tienes {xp} XP
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeModule && (
        <ModuleViewer
          module={activeModule}
          onComplete={() => completeModule(activeModule.id)}
          onClose={() => setActiveModule(null)}
        />
      )}
    </AppShell>
  );
}
