// Academy content in ES / EN / NL

export type AcademySection = { heading: string; body: string };
export type AcademyQuiz = { q: string; options: string[]; answer: number };
export type AcademyModule = {
  id: string;
  title: string;
  duration: string;
  type: string;
  icon: string;
  content: AcademySection[];
  quiz: AcademyQuiz[];
  isPractice?: boolean;
};
export type AcademyLevel = {
  id: number;
  name: string;
  emoji: string;
  subtitle: string;
  color: string;
  accent: string;
  bar: string;
  xpRequired: number;
  modules: AcademyModule[];
};

const es: AcademyLevel[] = [
  {
    id: 1, name: 'Principiante', emoji: '🟡', subtitle: 'Cero a primer trade',
    color: 'border-yellow-500/40 bg-yellow-500/5', accent: 'text-yellow-400', bar: 'bg-yellow-500', xpRequired: 0,
    modules: [
      {
        id: 'l1-m0', title: '🖥️ Cómo leer el simulador — Guía de interfaz', duration: '7 min', type: 'guide', icon: '🖥️',
        content: [
          {
            heading: 'La pantalla principal del simulador',
            body: `Cuando entras a la pantalla /trade verás tres zonas principales:

📊 IZQUIERDA — El gráfico de velas (precio del oro en tiempo real)
📋 DERECHA — El panel de órdenes (donde abres y cierras operaciones)
📌 ABAJO — El ORDER TAPE (historial de todas tus operaciones)

Hay también una barra superior dorada (el "Bullion Desk") que muestra datos del mercado en tiempo real. Pasa el cursor sobre cualquier término con ⓘ para ver qué significa.`,
          },
          {
            heading: 'La barra superior: Bullion Desk',
            body: `La barra dorada superior muestra información de mercado en tiempo real:

◆ BULLION DESK — El nombre de tu mesa de operaciones virtual
XAUUSD — Par que estás operando (oro vs. dólar)
BID — Precio al que puedes VENDER (verde)
ASK — Precio al que puedes COMPRAR (rojo)
SPD — Spread: la diferencia BID-ASK, que es el coste de cada operación
SESSION — Sesión de mercado activa (Londres, Nueva York, Tokio)
NET FLOW — Flujo neto de órdenes: más compras o más ventas en la mesa
REVIEW QUEUE — Órdenes pendientes de aprobación

💡 Todos estos términos tienen explicación: pasa el cursor sobre el ⓘ junto a cada uno.`,
          },
          {
            heading: 'El gráfico de velas japonesas',
            body: `El gráfico del centro muestra el precio del oro. Cada "vela" representa un período de tiempo:

🕯️ Vela verde (alcista): el precio subió en ese período. El cuerpo va de la apertura (abajo) al cierre (arriba).
🕯️ Vela roja (bajista): el precio bajó. El cuerpo va de la apertura (arriba) al cierre (abajo).
📏 La mecha/sombra: el precio máximo y mínimo que alcanzó dentro del período.

En la barra de herramientas del gráfico encuentras:
— Los timeframes: 1H = velas de 1 hora, 4H = 4 horas, etc.
— Los indicadores: MA20, MA50, BB, RSI, MACD (pasa el cursor para ver qué hace cada uno)
— Las herramientas de dibujo: para trazar líneas, zonas Fibonacci, etc.`,
          },
          {
            heading: 'El panel de órdenes (Order Entry)',
            body: `En el panel derecho encontrarás el formulario para abrir operaciones:

▲ BUY — Compras oro apostando a que el precio sube
▼ SELL — Vendes oro apostando a que el precio baja

Campos obligatorios:
• Precio de entrada: a qué precio quieres entrar (por defecto el precio actual)
• Stop Loss (SL): precio donde la operación se cierra automáticamente si va en tu contra → OBLIGATORIO
• Take Profit (TP): precio donde la operación se cierra automáticamente con ganancia
• Lotes: tamaño de la posición (empieza con 0.01 — el mínimo)

⚠️ El simulador no te dejará operar sin Stop Loss. Es la regla número 1.`,
          },
          {
            heading: 'El ORDER TAPE (barra inferior)',
            body: `La barra inferior es el "blotter" — el registro de todas tus órdenes. Puedes colapsarla haciendo clic en ella.

Columnas:
• TIPO: BUY (▲ verde) o SELL (▼ rojo)
• Par: XAUUSD
• Lotes: tamaño de la posición
• Precio de entrada: al que se ejecutó
• SL / TP: tus niveles de protección
• Resultado: ganancia o pérdida al cerrar

Las órdenes aparecen en tiempo real. Usa esta vista para revisar tu historial y aprender de cada trade.`,
          },
          {
            heading: 'Tu primer trade en 5 pasos',
            body: `Sigue estos pasos para tu primera operación simulada:

1️⃣ Mira el gráfico — ¿Las últimas velas son mayoritariamente verdes (sube) o rojas (baja)?
2️⃣ Elige BUY si el precio está subiendo, SELL si está bajando
3️⃣ Pon el Stop Loss a 30–50 puntos de tu precio de entrada
4️⃣ Pon el Take Profit al doble que el Stop Loss (si SL=30, TP=60)
5️⃣ Usa 0.01 lotes y pulsa CONFIRMAR

No te preocupes si la primera sale mal — lo importante es hacerlo con Stop Loss y aprender el flujo.`,
          },
        ],
        quiz: [
          { q: '¿Qué significa BID en la barra superior?', options: ['El precio al que compras', 'El precio al que vendes', 'El volumen operado'], answer: 1 },
          { q: '¿Para qué sirve el Stop Loss (SL)?', options: ['Para ganar más dinero', 'Para cerrar la operación automáticamente si va en tu contra', 'Para ver el historial'], answer: 1 },
          { q: 'Una vela verde en el gráfico significa que...', options: ['El precio bajó en ese período', 'El precio subió en ese período', 'No hubo actividad'], answer: 1 },
          { q: '¿Cuál es el tamaño de lote recomendado para empezar?', options: ['1.00 lote', '0.10 lote', '0.01 lote (micro)'], answer: 2 },
        ],
      },
      {
        id: 'l1-m1', title: '¿Qué es el oro (XAU/USD)?', duration: '5 min', type: 'lesson', icon: '📖',
        content: [
          { heading: 'El oro como activo financiero', body: `XAU es el símbolo del oro en los mercados financieros. USD es el dólar americano. Cuando ves "XAUUSD = 2.340", significa que 1 onza de oro cuesta 2.340 dólares.\n\nEl oro es uno de los activos más negociados del mundo porque:\n• Es refugio seguro en crisis económicas\n• Se mueve con fuerza cuando hay inflación\n• Opera 24/5 (lunes a viernes)\n• Tiene alta liquidez — puedes entrar y salir rápido` },
          { heading: '¿Cuánto mueve el oro al día?', body: `El oro típicamente mueve entre 10 y 30 dólares al día. Esto es importante porque:\n\n• 1 pip en XAUUSD = $0.01\n• Un movimiento de $10 = 1.000 pips\n• Con 0.01 lotes, 1.000 pips = $10 de ganancia o pérdida\n\nConsejo: El oro es volátil. Respeta siempre tu Stop Loss.` },
          { heading: 'Horarios clave del oro', body: `El oro tiene sesiones con más movimiento:\n\n🇬🇧 Londres (8:00–16:00 GMT): Apertura europea, primer gran movimiento\n🇺🇸 Nueva York (13:00–21:00 GMT): El más volátil, máximos y mínimos del día\n⚠️ Noticias económicas (CPI, NFP, Fed): Movimientos de 20-50 dólares en minutos\n\nPrincipiante: Evita tradear durante publicaciones de noticias hasta nivel 2.` },
        ],
        quiz: [
          { q: 'XAU/USD 2.340 significa que...', options: ['El dólar vale $2.340', '1 onza de oro vale $2.340', 'El oro subió $2.340 hoy'], answer: 1 },
          { q: 'El horario más volátil del oro es...', options: ['Sesión asiática', 'Sesión de Nueva York', 'Fin de semana'], answer: 1 },
        ],
      },
      {
        id: 'l1-m2', title: 'Lotes, pips y valor monetario', duration: '8 min', type: 'lesson', icon: '📐',
        content: [
          { heading: 'Tamaño de lote: cuánto arriesgas', body: `En el mercado del oro, el tamaño de posición se mide en lotes:\n\n📦 1 lote estándar = 100 oz de oro → $10 por pip\n📦 0.10 lotes (mini) = 10 oz → $1 por pip\n📦 0.01 lotes (micro) = 1 oz → $0.10 por pip\n\nEjemplo real:\n• Compras 0.10 lotes a $2.340\n• El precio sube a $2.350 (+$10 = +1.000 pips)\n• Ganancia: 1.000 pips × $1 = $10` },
          { heading: 'Cálculo de riesgo en dinero', body: `La regla de oro: NUNCA arriesgues más del 1-2% por trade.\n\nCon cuenta de $10.000:\n• 1% = $100 de riesgo máximo por operación\n• Si tu SL es de 50 pips ($5 por pip con 0.10 lotes)\n• Puedes usar 0.10 lotes (50 pips × $1 = $50... menos del 1%)\n\nCalculadora rápida:\nLotes = (Capital × % riesgo) ÷ (SL en pips × valor pip)` },
          { heading: 'El spread del oro', body: `El spread es la diferencia entre el precio de compra (ask) y venta (bid).\n\nEjemplo:\n• Bid: $2.339,50 (precio al que vendes)\n• Ask: $2.340,00 (precio al que compras)\n• Spread: $0.50 = 50 pips\n\n⚠️ Ojo con brokers con spreads de 100+ pips — te roban sin que te des cuenta.` },
        ],
        quiz: [
          { q: 'Con 0.01 lotes, ¿cuánto vale 1 pip en oro?', options: ['$1', '$0.10', '$10'], answer: 1 },
          { q: 'Tienes $5.000. Riesgo máximo por trade al 1%:', options: ['$500', '$50', '$5.000'], answer: 1 },
        ],
      },
      {
        id: 'l1-m3', title: 'Stop Loss y Take Profit', duration: '6 min', type: 'lesson', icon: '🛡️',
        content: [
          { heading: '¿Qué es el Stop Loss?', body: `El Stop Loss (SL) es tu red de seguridad. Es el precio al que tu operación se cierra automáticamente para limitar pérdidas.\n\nSIN Stop Loss = ruleta rusa. El mercado puede ir en tu contra 500 pips mientras duermes.\n\nCON Stop Loss a 50 pips = sabes exactamente cuánto puedes perder.\n\nRegla número 1: Nunca abras un trade sin Stop Loss. Jamás.` },
          { heading: '¿Qué es el Take Profit?', body: `El Take Profit (TP) es el precio objetivo donde tu operación se cierra automáticamente con ganancia.\n\n¿Por qué usarlo? Porque la codicia mata accounts.\n• Precio sube +$15, estás feliz\n• No tienes TP, piensas "sube más"\n• Precio baja -$20, pierdes\n\nConfigura el TP antes de abrir el trade, no después.` },
          { heading: 'Ratio Riesgo:Beneficio (R:R)', body: `El ratio R:R es cuánto ganas vs cuánto arriesgas.\n\n❌ Malo: SL = 50 pips, TP = 25 pips → R:R 1:0.5\n✅ Mínimo: SL = 50 pips, TP = 50 pips → R:R 1:1\n🏆 Objetivo: SL = 50 pips, TP = 100 pips → R:R 1:2\n\nCon R:R 1:2 puedes perder 6 de cada 10 trades y SEGUIR siendo rentable.` },
        ],
        quiz: [
          { q: '¿Qué hace el Stop Loss?', options: ['Cierra el trade con ganancia', 'Limita tu pérdida máxima', 'Aumenta tu lote'], answer: 1 },
          { q: 'Con R:R 1:2, si arriesgas $100, ¿cuánto ganas si el TP se alcanza?', options: ['$50', '$100', '$200'], answer: 2 },
        ],
      },
      {
        id: 'l1-m4', title: 'Tu primer trade en el simulador', duration: '10 min', type: 'practice', icon: '⚡', isPractice: true,
        content: [
          { heading: 'Practica ahora en el simulador', body: `1. Observa el gráfico — ¿el precio sube o baja en los últimos 15 minutos?\n2. Si sube → BUY. Si baja → SELL\n3. Pon tu Stop Loss a 30 pips del precio de entrada\n4. Pon tu Take Profit a 60 pips (R:R 1:2)\n5. Usa 0.01 lotes\n6. Abre el trade y observa el resultado` },
          { heading: 'Qué aprender de este trade', body: `No importa si ganas o pierdes. Lo importante es:\n\n✅ ¿Pusiste Stop Loss?\n✅ ¿Tu R:R era mayor a 1:1?\n✅ ¿Calculaste el riesgo antes de entrar?\n\nSi respondiste sí a las tres, vas por buen camino.` },
        ],
        quiz: [],
      },
      {
        id: 'l1-m5', title: 'MetaTrader 5: Primeros pasos', duration: '10 min', type: 'guide', icon: '🖥️',
        content: [
          { heading: 'Qué es MetaTrader 5', body: `MetaTrader 5 (MT5) es la plataforma de trading más usada del mundo. Los brokers de fondeo (FTMO, MyFundedFX, etc.) usan MT5.\n\nEste simulador te enseña los CONCEPTOS. MT5 es donde lo aplicarás con dinero real.` },
          { heading: 'Interfaz de MT5 — Zonas principales', body: `📊 Gráfico (centro): Precio del oro en tiempo real\n📋 Market Watch (izquierda): Lista de activos. Busca XAUUSD\n⚡ Terminal (abajo): Posiciones abiertas, historial, balance\n🔧 Toolbar (arriba): Botones para órdenes, indicadores, timeframes` },
          { heading: 'Cómo abrir un trade en MT5', body: `1. Doble clic en XAUUSD en el Market Watch\n2. Selecciona "Market Execution"\n3. Escribe el lote (empieza con 0.01)\n4. Pon Stop Loss y Take Profit\n5. Clic en BUY (verde) o SELL (rojo)` },
          { heading: 'Timeframes en MT5', body: `M1 = 1 minuto (mucho ruido)\nM15 = 15 minutos ← Empieza aquí\nH1 = 1 hora (más clara)\nH4 = 4 horas (tendencias grandes)\nD1 = 1 día (contexto general)\n\nPara principiantes: usa H1 para el análisis y M15 para la entrada.` },
        ],
        quiz: [
          { q: 'En MT5, el Terminal (abajo) muestra:', options: ['El gráfico de precios', 'Tus posiciones abiertas y balance', 'Los indicadores técnicos'], answer: 1 },
          { q: 'Para principiantes, el timeframe recomendado para análisis es:', options: ['M1', 'H1', 'M5'], answer: 1 },
        ],
      },
      {
        id: 'l1-m6', title: 'TradingView para análisis', duration: '8 min', type: 'guide', icon: '📈',
        content: [
          { heading: '¿Qué es TradingView?', body: `TradingView es la herramienta de análisis técnico más popular del mundo.\n\nURL: tradingview.com — crea cuenta gratuita\nBusca: XAUUSD o GOLD\n\nLa versión gratuita es suficiente para empezar.` },
          { heading: 'Herramientas esenciales', body: `📏 Línea de tendencia: Dibuja tendencias\n📐 Retrocesos Fibonacci: Niveles de soporte/resistencia\n📦 Rectángulo: Marca zonas de precio importantes\n📍 Línea horizontal: Marca soportes y resistencias\n📝 Texto: Añade notas a tus análisis` },
          { heading: 'Cómo ver el oro en TradingView', body: `1. Busca "XAUUSD" en la barra de búsqueda\n2. Selecciona OANDA:XAUUSD o FX:XAUUSD\n3. Cambia timeframe a H1\n4. Activa velas japonesas\n5. Añade EMA 20 y EMA 50` },
        ],
        quiz: [
          { q: 'TradingView se usa principalmente para:', options: ['Ejecutar trades', 'Analizar gráficos', 'Calcular impuestos'], answer: 1 },
          { q: 'El flujo profesional es:', options: ['Solo MT5', 'Solo TradingView', 'TradingView para análisis + MT5 para ejecutar'], answer: 2 },
        ],
      },
    ],
  },
  {
    id: 2, name: 'Intermedio', emoji: '🔵', subtitle: 'Gestión de riesgo profesional',
    color: 'border-blue-500/40 bg-blue-500/5', accent: 'text-blue-400', bar: 'bg-blue-500', xpRequired: 500,
    modules: [
      {
        id: 'l2-m1', title: 'Velas japonesas — Los 5 patrones clave', duration: '12 min', type: 'lesson', icon: '🕯️',
        content: [
          { heading: 'Por qué importan las velas japonesas', body: `Cada vela cuenta una historia de 4 precios:\n• Apertura, Máximo, Mínimo, Cierre\n\nVerde = compradores ganaron\nRojo = vendedores ganaron` },
          { heading: 'Los 5 patrones para el oro', body: `🔨 Martillo: Mecha larga abajo → señal de compra en soporte\n⭐ Doji: Cuerpo mínimo → indecisión del mercado\n🌟 Engulfing alcista: Vela verde engulle la roja → fuerte señal de compra\n⭐ Engulfing bajista: Vela roja engulle la verde → fuerte señal de venta\n📌 Pin bar: Mecha larga → señal de reversión` },
          { heading: 'Cómo identificarlos en TradingView', body: `1. Abre XAUUSD en H1\n2. Busca retrocesos hacia soportes\n3. ¿Aparece un martillo o pin bar?\n4. Ese es tu setup de entrada\n\nRecuerda: patrón + zona + R:R 1:2 mínimo` },
        ],
        quiz: [
          { q: 'Un Doji indica:', options: ['Fuerte tendencia alcista', 'Indecisión del mercado', 'Señal de venta segura'], answer: 1 },
          { q: 'Un pin bar es más fiable cuando aparece en:', options: ['Cualquier precio', 'Una zona de soporte o resistencia', 'Durante noticias'], answer: 1 },
        ],
      },
      {
        id: 'l2-m2', title: 'Soportes, Resistencias y Zonas de Liquidez', duration: '15 min', type: 'lesson', icon: '🧱',
        content: [
          { heading: 'Soportes y resistencias en el oro', body: `Soporte: nivel donde el oro rebota hacia arriba\nResistencia: nivel donde el oro rebota hacia abajo\n\nNiveles más importantes:\n• Números redondos: $2.300, $2.350, $2.400\n• Máximos y mínimos previos del día/semana\n\nTruco: Los números redondos en el oro funcionan como imanes.` },
          { heading: 'Zonas de liquidez', body: `Los institucionales mueven el mercado buscando Stop Loss de otros traders.\n\n¿Dónde pone la gente su SL?\n• Por debajo de mínimos obvios → liquidez bajista\n• Por encima de máximos obvios → liquidez alcista\n\nEstrategia: Pon tu SL un poco MÁS ALLÁ del nivel obvio para evitar ser barrido.` },
          { heading: 'Cómo dibujar zonas en TradingView', body: `1. Abre H4 en TradingView\n2. Identifica los 3 máximos y 3 mínimos más recientes\n3. Dibuja líneas horizontales en esos precios\n4. Baja a H1 — ¿el precio está cerca de alguna zona?\n5. Si está cerca de soporte → busca señal de compra\n\nRegla: No compres en medio de nada. Espera las zonas.` },
        ],
        quiz: [
          { q: '¿Por qué los números redondos son importantes en el oro?', options: ['Son aleatorios', 'El mercado los respeta psicológicamente', 'Solo importan en forex'], answer: 1 },
          { q: 'El "stop hunt" es cuando el mercado:', options: ['Sube indefinidamente', 'Barre los SL obvios antes de moverse en dirección real', 'Se queda quieto'], answer: 1 },
        ],
      },
      {
        id: 'l2-m3', title: 'Gestión de riesgo avanzada', duration: '10 min', type: 'lesson', icon: '⚖️',
        content: [
          { heading: 'La regla del 1% — Por qué salva cuentas', body: `Con la regla del 1%:\n\nPuedes perder 10 trades seguidos y solo pierdes el 10%.\n\nMatemática del fondeo: Cuentas FTMO tienen límite de 10% de drawdown. Con 1% por trade, necesitas 10 pérdidas seguidas para perder la cuenta. Con 5% por trade, solo necesitas 2.` },
          { heading: 'Calculadora de tamaño de posición', body: `Fórmula exacta:\n\nLotes = (Balance × % Riesgo) ÷ (SL en pips × $10/pip)\n\nEjemplo:\n• Balance: $10.000, Riesgo: 1% = $100, SL: 50 pips\n• Lotes = $100 ÷ (50 × $10) = 0.20 lotes\n\nSiempre calcula ANTES de abrir. Nunca a ojo.` },
          { heading: 'Gestión de trades abiertos', body: `1. NUNCA muevas el SL más lejos\n2. SÍ puedes mover el SL al breakeven cuando el precio va a tu favor 50%\n3. No añadas posiciones perdedoras\n\nBreakeven en práctica:\n• Entras en compra a $2.340, SL $2.320, TP $2.380\n• Precio sube a $2.360 → mueve SL a $2.340` },
        ],
        quiz: [
          { q: 'Con la regla del 1%, ¿cuántos trades perdedores seguidos necesitas para que sea grave?', options: ['2', '5', 'Muchos más — el daño es gradual'], answer: 2 },
          { q: 'Mover el SL al breakeven significa moverlo a:', options: ['El precio más bajo del día', 'Tu precio de entrada', 'El Take Profit'], answer: 1 },
        ],
      },
      {
        id: 'l2-m4', title: 'Simulacro Fase 1 FTMO — Practica', duration: '20 min', type: 'challenge', icon: '🏆', isPractice: true,
        content: [
          { heading: 'Las reglas de una cuenta de fondeo', body: `📋 Reglas típicas de Fase 1:\n• Objetivo: +8% (ganar $800 en cuenta de $10K)\n• Máxima pérdida diaria: -5% (-$500)\n• Máximo drawdown total: -10% (-$1.000)\n• Tiempo: 30 días\n\n⚠️ Si pierdes el 5% en un día, la cuenta se congela.` },
          { heading: 'Tu reto: Simula la Fase 1', body: `Opera durante 10 sesiones con estas reglas:\n\n✅ Objetivo: llegar a +8%\n🛑 Límite diario: no perder más del 5%\n🛑 Drawdown: no bajar del 10%\n\nEstrategia:\n• Máximo 1-2 trades por día\n• Riesgo por trade: 0.5-1%\n• Si llevas -2% en el día → para de operar` },
        ],
        quiz: [],
      },
      {
        id: 'l2-m5', title: 'Indicadores técnicos en MT5 y TradingView', duration: '12 min', type: 'guide', icon: '📡',
        content: [
          { heading: 'Los 3 indicadores que funcionan en el oro', body: `📈 EMA 20 + EMA 50 en H1:\n• EMA 20 cruza sobre EMA 50 → tendencia alcista\n• Precio por encima de ambas EMAs = tendencia alcista\n\n📊 RSI:\n• RSI > 70 = sobrecomprado\n• RSI < 30 = sobrevendido\n\n📈 MACD:\n• Cruce alcista → señal de compra` },
          { heading: 'Cómo añadir indicadores en MT5', body: `Para EMA:\n1. Insert → Indicators → Trend → Moving Average\n2. Period: 20, Method: Exponential\n3. Repite con period 50\n\nPara RSI:\n1. Insert → Indicators → Oscillators → RSI\n2. Period: 14` },
          { heading: 'Cómo añadir indicadores en TradingView', body: `1. Clic en "Indicadores"\n2. Busca "EMA" → período 20 → Añadir\n3. Repite con período 50\n4. Busca "RSI" → añadir\n5. Busca "MACD" → añadir\n\nTradingView Pro: Crea alertas en indicadores para no estar pegado a la pantalla.` },
        ],
        quiz: [
          { q: 'RSI por debajo de 30 indica:', options: ['El oro está muy caro', 'El oro podría estar sobrevendido', 'Señal de venta segura'], answer: 1 },
          { q: 'Cuando la EMA 20 cruza sobre la EMA 50:', options: ['Señal bajista', 'Señal alcista', 'Sin señal'], answer: 1 },
        ],
      },
    ],
  },
  {
    id: 3, name: 'Avanzado', emoji: '🔴', subtitle: 'Mentalidad y fondeo real',
    color: 'border-red-500/40 bg-red-500/5', accent: 'text-red-400', bar: 'bg-red-500', xpRequired: 1500,
    modules: [
      {
        id: 'l3-m1', title: 'Psicología del trading — El enemigo interior', duration: '15 min', type: 'lesson', icon: '🧠',
        content: [
          { heading: 'Los 4 errores psicológicos que destruyen cuentas', body: `😱 FOMO: Entrar tarde porque "no quieres perderte" → entras en el peor punto\n😡 Revenge trading: Perder y querer recuperar inmediatamente → pérdidas en cadena\n🤞 Esperanza irracional: Mover el SL para no cerrar en pérdida → catástrofe\n💰 Overtrading: Operar demasiado → cedes todo el profit en spreads` },
          { heading: 'El protocolo anti-FOMO', body: `Si sientes que "te estás perdiendo algo":\n\n1. Para. Respira. No entres.\n2. Hay un nuevo setup CADA DÍA en el oro.\n\nRegla de los 3 "noes":\n• No es mi zona → No entro\n• No tiene R:R 1:2 → No entro\n• No está en mi horario → No entro` },
          { heading: 'Cómo manejar una racha perdedora', body: `Pérdida 1: Normal.\nPérdida 2: Revisa el setup.\nPérdida 3 en un día → PARA. Cierra el ordenador.\n\nProtocolo:\n• -2%: alerta, reduce el lote a la mitad\n• -3%: STOP. Sesión terminada.\n• -5%: cuenta de fondeo congelada` },
        ],
        quiz: [
          { q: 'El "revenge trading" es:', options: ['Una estrategia válida', 'Operar impulsivamente para recuperar pérdidas', 'Un tipo de orden'], answer: 1 },
          { q: 'Cuando llevas -3% en el día, debes:', options: ['Aumentar el lote para recuperar', 'Parar y cerrar el ordenador', 'Buscar más setups'], answer: 1 },
        ],
      },
      {
        id: 'l3-m2', title: 'El diario de trading (Trading Journal)', duration: '10 min', type: 'lesson', icon: '📔',
        content: [
          { heading: 'Por qué el journal es tu arma secreta', body: `Los traders rentables tienen una cosa en común: llevan un diario.\n\nSin journal:\n• Repites los mismos errores\n• No sabes qué setups te funcionan\n\nCon journal:\n• Identificas patrones de error\n• Tienes evidencia de tu metodología (necesario para fondeo)` },
          { heading: 'Qué registrar en cada trade', body: `📌 ANTES:\n• Setup, entrada, SL, TP, R:R calculado, estado emocional (1-10)\n\n📌 DESPUÉS:\n• Resultado, ¿seguiste el plan?, qué mejorar\n\nHerramientas: Notion, Excel o un cuaderno. Lo que uses, úsalo SIEMPRE.` },
          { heading: 'Análisis mensual', body: `Cada fin de mes analiza:\n• Win rate, promedio R:R\n• Mejor día de la semana\n• Mejor horario (Londres o NY)\n• Peor error del mes\n\nCon 3 meses de journal sabrás qué setups son TUS setups.` },
        ],
        quiz: [
          { q: 'El trading journal sirve principalmente para:', options: ['Presumir en redes sociales', 'Identificar patrones de error y mejora', 'Calcular impuestos'], answer: 1 },
        ],
      },
      {
        id: 'l3-m3', title: 'Cómo pasar una cuenta de fondeo paso a paso', duration: '20 min', type: 'lesson', icon: '🏦',
        content: [
          { heading: 'Elegir la empresa de fondeo correcta', body: `🏆 FTMO: La más conocida. $200 por cuenta $10K. Rigurosa pero excelente reputación.\n🏆 MyFundedFX: Más flexible, acepta news trading.\n🏆 Topstep: Buena para futuros de oro.\n🏆 FundedNext: Opción económica.\n\nVerifica que permita XAUUSD, spreads <50 pips y sin restricciones absurdas.` },
          { heading: 'Plan de ataque para Fase 1', body: `Objetivo: +8% en 30 días sin violar reglas.\n\n📅 Plan conservador:\n• 1-2 trades por día máximo\n• Riesgo: 0.5% por trade ($50 en $10K)\n• Para en -2% diario\n\nSemana 1: Observa más de lo que operas.\nSemana 4: Si ya tienes el +8%, ¡para!` },
          { heading: 'Los errores que suspenden cuentas de fondeo', body: `❌ Aumentar el lote cuando vas bien\n❌ Tradear durante noticias sin saber el riesgo\n❌ No usar Stop Loss\n❌ Dejar trades abiertos sin gestionar\n❌ Intentar recuperar pérdidas con lotes mayores\n\nSi pierdes $300 un martes, no lo recuperes ese día. Empieza el miércoles fresco.` },
        ],
        quiz: [
          { q: 'La estrategia correcta cuando ya tienes el +8% del objetivo es:', options: ['Seguir operando para ganar más', 'Parar y esperar la verificación', 'Doblar el lote para el bonus'], answer: 1 },
          { q: 'El mayor error en cuentas de fondeo es:', options: ['Operar pocos trades', 'Aumentar lotes cuando vas bien o para recuperar', 'Usar Stop Loss'], answer: 1 },
        ],
      },
      {
        id: 'l3-m4', title: 'Setups avanzados en XAU/USD', duration: '15 min', type: 'lesson', icon: '🎯',
        content: [
          { heading: 'Setup 1: Break and Retest', body: `1. El precio rompe una resistencia con fuerza\n2. El precio retrocede y testea ese nivel (ahora soporte)\n3. Aparece señal de compra en ese nivel\n4. Entras con SL debajo del soporte y TP al siguiente nivel\n\n¿Por qué funciona? Los institucionales compran en ese retest.` },
          { heading: 'Setup 2: Sesión de Londres — Primera hora', body: `El oro frecuentemente establece su dirección en los primeros 30-60 minutos de Londres (8:00-9:00 GMT).\n\n1. Espera las 8:00 GMT\n2. Observa los primeros 15-30 min sin operar\n3. ¿En qué dirección rompe el rango?\n4. Entra en la dirección del breakout\n\nEsta estrategia produce 1 trade claro al día.` },
          { heading: 'Setup 3: Smart Money Concepts (SMC)', body: `📊 Order Blocks: Zonas donde los institucionales pusieron órdenes grandes. El precio tiende a volver a ellas.\n\n🔍 Cómo identificar un Order Block:\n1. Busca una vela fuerte que inició un movimiento significativo\n2. El cuerpo de esa vela = tu Order Block\n3. Cuando el precio regrese → setup de entrada\n\n📍 Fair Value Gaps: Huecos que el mercado tiende a llenar.` },
        ],
        quiz: [
          { q: 'En el setup Break and Retest, ¿cuándo entras?', options: ['Cuando el precio rompe el nivel', 'Cuando el precio vuelve a testear el nivel roto', 'Al azar'], answer: 1 },
          { q: 'Un Fair Value Gap es:', options: ['Un indicador técnico', 'Un hueco de precio que el mercado tiende a llenar', 'El spread del broker'], answer: 1 },
        ],
      },
    ],
  },
];

const en: AcademyLevel[] = [
  {
    id: 1, name: 'Beginner', emoji: '🟡', subtitle: 'Zero to first trade',
    color: 'border-yellow-500/40 bg-yellow-500/5', accent: 'text-yellow-400', bar: 'bg-yellow-500', xpRequired: 0,
    modules: [
      {
        id: 'l1-m0', title: '🖥️ How to read the simulator — Interface guide', duration: '7 min', type: 'guide', icon: '🖥️',
        content: [
          {
            heading: 'The simulator main screen',
            body: `When you enter the /trade screen you'll see three main areas:

📊 LEFT — The candlestick chart (gold price in real time)
📋 RIGHT — The order panel (where you open and close trades)
📌 BOTTOM — The ORDER TAPE (history of all your trades)

There's also a golden top bar (the "Bullion Desk") showing live market data. Hover over any ⓘ icon to see what each term means.`,
          },
          {
            heading: 'The top bar: Bullion Desk',
            body: `The golden top bar shows real-time market information:

◆ BULLION DESK — Your virtual trading desk name
XAUUSD — The pair you're trading (gold vs. dollar)
BID — Price at which you can SELL (green)
ASK — Price at which you can BUY (red)
SPD — Spread: the BID-ASK difference, which is the cost of each trade
SESSION — Active market session (London, New York, Tokyo)
NET FLOW — Net order flow: more buys or more sells on the desk
REVIEW QUEUE — Orders pending approval

💡 All these terms have explanations — hover over the ⓘ icon next to each one.`,
          },
          {
            heading: 'The Japanese candlestick chart',
            body: `The centre chart shows the gold price. Each "candle" represents a time period:

🕯️ Green candle (bullish): price went up in that period. The body goes from open (bottom) to close (top).
🕯️ Red candle (bearish): price went down. The body goes from open (top) to close (bottom).
📏 The wick/shadow: the highest and lowest price reached within the period.

In the chart toolbar you'll find:
— Timeframes: 1H = 1-hour candles, 4H = 4 hours, etc.
— Indicators: MA20, MA50, BB, RSI, MACD (hover to see what each does)
— Drawing tools: to draw lines, Fibonacci zones, etc.`,
          },
          {
            heading: 'The order panel (Order Entry)',
            body: `In the right panel you'll find the form to open trades:

▲ BUY — You buy gold betting the price will rise
▼ SELL — You sell gold betting the price will fall

Required fields:
• Entry price: at what price you want to enter (defaults to current price)
• Stop Loss (SL): price where the trade closes automatically if it goes against you → REQUIRED
• Take Profit (TP): price where the trade closes automatically with a profit
• Lots: position size (start with 0.01 — the minimum)

⚠️ The simulator won't let you trade without a Stop Loss. It's rule number 1.`,
          },
          {
            heading: 'The ORDER TAPE (bottom bar)',
            body: `The bottom bar is the "blotter" — the record of all your orders. You can collapse it by clicking on it.

Columns:
• TYPE: BUY (▲ green) or SELL (▼ red)
• Pair: XAUUSD
• Lots: position size
• Entry price: at which it was executed
• SL / TP: your protection levels
• Result: profit or loss on close

Orders appear in real time. Use this view to review your history and learn from each trade.`,
          },
          {
            heading: 'Your first trade in 5 steps',
            body: `Follow these steps for your first simulated trade:

1️⃣ Look at the chart — are the last candles mostly green (rising) or red (falling)?
2️⃣ Choose BUY if the price is rising, SELL if it's falling
3️⃣ Set your Stop Loss 30–50 points from your entry price
4️⃣ Set your Take Profit at double the Stop Loss (if SL=30, TP=60)
5️⃣ Use 0.01 lots and click CONFIRM

Don't worry if the first one goes wrong — what matters is doing it with a Stop Loss and learning the flow.`,
          },
        ],
        quiz: [
          { q: 'What does BID mean in the top bar?', options: ['The price at which you buy', 'The price at which you sell', 'The volume traded'], answer: 1 },
          { q: 'What is the Stop Loss (SL) for?', options: ['To make more money', 'To automatically close the trade if it goes against you', 'To view history'], answer: 1 },
          { q: 'A green candle on the chart means...', options: ['The price fell in that period', 'The price rose in that period', 'There was no activity'], answer: 1 },
          { q: 'What lot size is recommended to start?', options: ['1.00 lot', '0.10 lot', '0.01 lot (micro)'], answer: 2 },
        ],
      },
      {
        id: 'l1-m1', title: 'What is Gold (XAU/USD)?', duration: '5 min', type: 'lesson', icon: '📖',
        content: [
          { heading: 'Gold as a financial asset', body: `XAU is the symbol for gold in financial markets. USD is the US dollar. When you see "XAUUSD = 2,340", it means 1 ounce of gold costs $2,340.\n\nGold is one of the most traded assets in the world because:\n• It's a safe haven during economic crises\n• It moves strongly during inflation\n• It trades 24/5 (Monday to Friday)\n• High liquidity — you can enter and exit quickly` },
          { heading: 'How much does gold move per day?', body: `Gold typically moves between $10 and $30 per day. This matters because:\n\n• 1 pip in XAUUSD = $0.01\n• A $10 move = 1,000 pips\n• With 0.01 lots, 1,000 pips = $10 profit or loss\n\nTip: Gold is volatile. Always respect your Stop Loss.` },
          { heading: 'Key gold trading sessions', body: `Gold moves most during these sessions:\n\n🇬🇧 London (8:00–16:00 GMT): European open, first major move\n🇺🇸 New York (13:00–21:00 GMT): Most volatile, daily highs and lows\n⚠️ Economic news (CPI, NFP, Fed): Moves of $20-50 in minutes\n\nBeginner: Avoid trading during news releases until level 2.` },
        ],
        quiz: [
          { q: 'XAUUSD 2,340 means...', options: ['The dollar is worth $2,340', '1 ounce of gold costs $2,340', 'Gold rose $2,340 today'], answer: 1 },
          { q: 'The most volatile gold session is...', options: ['Asian session', 'New York session', 'Weekend'], answer: 1 },
        ],
      },
      {
        id: 'l1-m2', title: 'Lots, pips and monetary value', duration: '8 min', type: 'lesson', icon: '📐',
        content: [
          { heading: 'Lot size: how much you risk', body: `In the gold market, position size is measured in lots:\n\n📦 1 standard lot = 100 oz → $10 per pip\n📦 0.10 lots (mini) = 10 oz → $1 per pip\n📦 0.01 lots (micro) = 1 oz → $0.10 per pip\n\nReal example:\n• You buy 0.10 lots at $2,340\n• Price rises to $2,350 (+$10 = +1,000 pips)\n• Profit: 1,000 pips × $1 = $10` },
          { heading: 'Risk calculation in money', body: `The golden rule: NEVER risk more than 1-2% per trade.\n\nWith a $10,000 account:\n• 1% = $100 maximum risk per trade\n• If your SL is 50 pips ($5 per pip with 0.10 lots)\n• You can use 0.10 lots (50 pips × $1 = $50 — under 1%)\n\nQuick formula:\nLots = (Capital × % risk) ÷ (SL in pips × pip value)` },
          { heading: 'The gold spread', body: `The spread is the difference between the buy (ask) and sell (bid) price.\n\nExample:\n• Bid: $2,339.50 (price you sell at)\n• Ask: $2,340.00 (price you buy at)\n• Spread: $0.50 = 50 pips\n\n⚠️ Watch out for brokers with spreads over 100 pips — they eat your profits silently.` },
        ],
        quiz: [
          { q: 'With 0.01 lots, how much is 1 pip worth in gold?', options: ['$1', '$0.10', '$10'], answer: 1 },
          { q: 'You have $5,000. Maximum risk per trade at 1%:', options: ['$500', '$50', '$5,000'], answer: 1 },
        ],
      },
      {
        id: 'l1-m3', title: 'Stop Loss and Take Profit', duration: '6 min', type: 'lesson', icon: '🛡️',
        content: [
          { heading: 'What is a Stop Loss?', body: `The Stop Loss (SL) is your safety net. It's the price at which your trade closes automatically to limit losses.\n\nWITHOUT Stop Loss = Russian roulette. The market can go 500 pips against you while you sleep.\n\nWITH Stop Loss at 50 pips = you know exactly how much you can lose.\n\nRule #1: Never open a trade without a Stop Loss. Ever.` },
          { heading: 'What is a Take Profit?', body: `The Take Profit (TP) is the target price where your trade closes automatically with a gain.\n\nWhy use it? Because greed kills accounts.\n• Price rises +$15, you're happy\n• No TP, you think "it'll go higher"\n• Price drops -$20, you lose\n\nSet the TP before opening the trade, not after.` },
          { heading: 'Risk:Reward Ratio (R:R)', body: `The R:R ratio is how much you win vs how much you risk.\n\n❌ Bad: SL = 50 pips, TP = 25 pips → R:R 1:0.5\n✅ Minimum: SL = 50 pips, TP = 50 pips → R:R 1:1\n🏆 Target: SL = 50 pips, TP = 100 pips → R:R 1:2\n\nWith R:R 1:2 you can lose 6 out of 10 trades and STILL be profitable.` },
        ],
        quiz: [
          { q: 'What does the Stop Loss do?', options: ['Closes the trade with profit', 'Limits your maximum loss', 'Increases your lot size'], answer: 1 },
          { q: 'With R:R 1:2, if you risk $100, how much do you gain when TP is hit?', options: ['$50', '$100', '$200'], answer: 2 },
        ],
      },
      {
        id: 'l1-m4', title: 'Your first trade in the simulator', duration: '10 min', type: 'practice', icon: '⚡', isPractice: true,
        content: [
          { heading: 'Practice now in the simulator', body: `1. Watch the chart — is the price rising or falling in the last 15 minutes?\n2. Rising → BUY. Falling → SELL\n3. Set your Stop Loss 30 pips from entry\n4. Set your Take Profit at 60 pips (R:R 1:2)\n5. Use 0.01 lots (micro, minimum risk)\n6. Open the trade and watch the result` },
          { heading: 'What to learn from this trade', body: `It doesn't matter if you win or lose on your first trade. What matters is:\n\n✅ Did you set a Stop Loss?\n✅ Was your R:R greater than 1:1?\n✅ Did you calculate risk before entering?\n\nIf you answered yes to all three, you're on the right track.` },
        ],
        quiz: [],
      },
      {
        id: 'l1-m5', title: 'MetaTrader 5: First steps', duration: '10 min', type: 'guide', icon: '🖥️',
        content: [
          { heading: 'What is MetaTrader 5', body: `MetaTrader 5 (MT5) is the most widely used trading platform in the world. Prop firms (FTMO, MyFundedFX, etc.) use MT5.\n\nThis simulator teaches you the CONCEPTS. MT5 is where you'll apply them with real money when you're ready.` },
          { heading: 'MT5 interface — Main areas', body: `📊 Chart (centre): Gold price in real time\n📋 Market Watch (left): Asset list. Find XAUUSD\n⚡ Terminal (bottom): Open positions, history, balance\n🔧 Toolbar (top): Buttons for orders, indicators, timeframes` },
          { heading: 'How to open a trade in MT5', body: `1. Double-click XAUUSD in Market Watch\n2. Select "Market Execution"\n3. Enter the lot size (start with 0.01)\n4. Set Stop Loss and Take Profit\n5. Click BUY (green) or SELL (red)` },
          { heading: 'Timeframes in MT5', body: `M1 = 1 minute (too much noise)\nM15 = 15 minutes ← Start here\nH1 = 1 hour (clearer signals)\nH4 = 4 hours (major trends)\nD1 = 1 day (overall context)\n\nFor beginners: use H1 for analysis and M15 for entry.` },
        ],
        quiz: [
          { q: 'In MT5, the Terminal (bottom) shows:', options: ['The price chart', 'Your open positions and balance', 'Technical indicators'], answer: 1 },
          { q: 'The recommended timeframe for analysis as a beginner is:', options: ['M1', 'H1', 'M5'], answer: 1 },
        ],
      },
      {
        id: 'l1-m6', title: 'TradingView for analysis', duration: '8 min', type: 'guide', icon: '📈',
        content: [
          { heading: 'What is TradingView?', body: `TradingView is the most popular technical analysis tool in the world.\n\nURL: tradingview.com — create a free account\nSearch: XAUUSD or GOLD\n\nThe free version is enough to get started.` },
          { heading: 'Essential tools', body: `📏 Trend line: Draw trends\n📐 Fibonacci retracements: Support/resistance levels\n📦 Rectangle: Mark important price zones\n📍 Horizontal line: Mark exact supports and resistances\n📝 Text: Add notes to your analysis` },
          { heading: 'How to view gold on TradingView', body: `1. Search "XAUUSD" in the search bar\n2. Select OANDA:XAUUSD or FX:XAUUSD\n3. Switch to H1 timeframe\n4. Enable candlestick chart\n5. Add EMA 20 and EMA 50` },
        ],
        quiz: [
          { q: 'TradingView is used primarily for:', options: ['Executing trades', 'Analysing charts', 'Calculating taxes'], answer: 1 },
          { q: 'The professional workflow is:', options: ['MT5 only', 'TradingView only', 'TradingView for analysis + MT5 for execution'], answer: 2 },
        ],
      },
    ],
  },
  {
    id: 2, name: 'Intermediate', emoji: '🔵', subtitle: 'Professional risk management',
    color: 'border-blue-500/40 bg-blue-500/5', accent: 'text-blue-400', bar: 'bg-blue-500', xpRequired: 500,
    modules: [
      {
        id: 'l2-m1', title: 'Japanese candlesticks — The 5 key patterns', duration: '12 min', type: 'lesson', icon: '🕯️',
        content: [
          { heading: 'Why candlesticks matter', body: `Each candle tells a story of 4 prices:\n• Open, High, Low, Close\n\nGreen = buyers won\nRed = sellers won` },
          { heading: 'The 5 patterns for gold', body: `🔨 Hammer: Long lower wick → buy signal at support\n⭐ Doji: Minimal body → market indecision\n🌟 Bullish engulfing: Green candle swallows red → strong buy signal\n⭐ Bearish engulfing: Red candle swallows green → strong sell signal\n📌 Pin bar: Long wick, price rejection → reversal signal` },
          { heading: 'How to identify them on TradingView', body: `1. Open XAUUSD on H1\n2. Look for pullbacks to support levels\n3. Does a hammer or pin bar appear?\n4. That's your entry setup\n\nRemember: pattern + zone + minimum R:R 1:2` },
        ],
        quiz: [
          { q: 'A Doji indicates:', options: ['Strong bullish trend', 'Market indecision', 'Safe sell signal'], answer: 1 },
          { q: 'A pin bar is most reliable when it appears at:', options: ['Any price', 'A support or resistance zone', 'During news'], answer: 1 },
        ],
      },
      {
        id: 'l2-m2', title: 'Support, Resistance and Liquidity Zones', duration: '15 min', type: 'lesson', icon: '🧱',
        content: [
          { heading: 'Support and resistance in gold', body: `Support: price level where gold bounces up repeatedly\nResistance: level where gold bounces down repeatedly\n\nMost important levels:\n• Round numbers: $2,300, $2,350, $2,400\n• Previous daily/weekly highs and lows\n\nGold tip: Round numbers act as magnets in gold markets.` },
          { heading: 'Liquidity zones', body: `Institutional traders move the market hunting for other traders' Stop Losses.\n\nWhere do people put their SL?\n• Below obvious lows → bearish liquidity\n• Above obvious highs → bullish liquidity\n\nStrategy: Place your SL slightly BEYOND the obvious level to avoid being swept.` },
          { heading: 'How to draw zones on TradingView', body: `1. Open H4 on TradingView\n2. Identify the 3 most significant recent highs and lows\n3. Draw horizontal lines at those prices\n4. Drop to H1 — is price near any zone?\n5. Near support → look for a buy signal\n\nRule: Don't buy in the middle of nowhere. Wait for the zones.` },
        ],
        quiz: [
          { q: 'Why are round numbers important in gold?', options: ['They are random', 'The market respects them psychologically', 'They only matter in forex'], answer: 1 },
          { q: 'A "stop hunt" is when the market:', options: ['Rises indefinitely', 'Sweeps obvious SL levels before moving in the real direction', 'Stays still'], answer: 1 },
        ],
      },
      {
        id: 'l2-m3', title: 'Advanced risk management', duration: '10 min', type: 'lesson', icon: '⚖️',
        content: [
          { heading: 'The 1% rule — Why it saves accounts', body: `With the 1% rule:\n\nYou can lose 10 trades in a row and only lose 10% of the account.\n\nProp firm math: FTMO accounts have a 10% max drawdown limit. With 1% per trade, you need 10 consecutive losses to lose the account. With 5% per trade, you only need 2.` },
          { heading: 'Position size calculator', body: `Exact formula:\n\nLots = (Balance × % Risk) ÷ (SL in pips × $10/pip)\n\nExample:\n• Balance: $10,000, Risk: 1% = $100, SL: 50 pips\n• Lots = $100 ÷ (50 × $10) = 0.20 lots\n\nAlways calculate BEFORE opening. Never by feel.` },
          { heading: 'Managing open trades', body: `1. NEVER move the SL further away\n2. You CAN move the SL to breakeven when price moves 50% in your favour\n3. Don't add to losing positions\n\nBreakeven in practice:\n• Buy at $2,340, SL $2,320, TP $2,380\n• Price rises to $2,360 → move SL to $2,340` },
        ],
        quiz: [
          { q: 'With the 1% rule, how many consecutive losing trades do you need for serious damage?', options: ['2', '5', 'Many more — the damage is gradual'], answer: 2 },
          { q: 'Moving the SL to breakeven means moving it to:', options: ['The lowest price of the day', 'Your entry price', 'The Take Profit'], answer: 1 },
        ],
      },
      {
        id: 'l2-m4', title: 'FTMO Phase 1 Simulation — Practice', duration: '20 min', type: 'challenge', icon: '🏆', isPractice: true,
        content: [
          { heading: 'Prop firm account rules', body: `📋 Typical Phase 1 rules:\n• Profit target: +8% (earn $800 on a $10K account)\n• Max daily loss: -5% (-$500)\n• Max total drawdown: -10% (-$1,000)\n• Time: 30 days\n\n⚠️ Lose 5% in a day and the account is frozen.` },
          { heading: 'Your challenge: Simulate Phase 1', body: `Trade for 10 sessions with these rules:\n\n✅ Goal: reach +8%\n🛑 Daily limit: don't lose more than 5% in a day\n🛑 Drawdown: don't go below 10%\n\nStrategy:\n• Max 1-2 trades per day\n• Risk per trade: 0.5-1%\n• If you're at -2% for the day → stop trading` },
        ],
        quiz: [],
      },
      {
        id: 'l2-m5', title: 'Technical indicators on MT5 and TradingView', duration: '12 min', type: 'guide', icon: '📡',
        content: [
          { heading: 'The 3 indicators that work for gold', body: `📈 EMA 20 + EMA 50 on H1:\n• EMA 20 crosses above EMA 50 → bullish trend\n• Price above both EMAs = bullish trend\n\n📊 RSI:\n• RSI > 70 = overbought\n• RSI < 30 = oversold\n\n📈 MACD:\n• Bullish crossover → buy signal` },
          { heading: 'How to add indicators in MT5', body: `For EMA:\n1. Insert → Indicators → Trend → Moving Average\n2. Period: 20, Method: Exponential\n3. Repeat with period 50\n\nFor RSI:\n1. Insert → Indicators → Oscillators → RSI\n2. Period: 14` },
          { heading: 'How to add indicators in TradingView', body: `1. Click "Indicators"\n2. Search "EMA" → period 20 → Add\n3. Repeat with period 50\n4. Search "RSI" → add\n5. Search "MACD" → add\n\nTradingView Pro: Create alerts on indicators so you don't need to watch the screen constantly.` },
        ],
        quiz: [
          { q: 'RSI below 30 indicates:', options: ['Gold is very expensive', 'Gold may be oversold', 'A safe sell signal'], answer: 1 },
          { q: 'When EMA 20 crosses above EMA 50:', options: ['Bearish signal', 'Bullish signal', 'No signal'], answer: 1 },
        ],
      },
    ],
  },
  {
    id: 3, name: 'Advanced', emoji: '🔴', subtitle: 'Mindset and real funding',
    color: 'border-red-500/40 bg-red-500/5', accent: 'text-red-400', bar: 'bg-red-500', xpRequired: 1500,
    modules: [
      {
        id: 'l3-m1', title: 'Trading psychology — The inner enemy', duration: '15 min', type: 'lesson', icon: '🧠',
        content: [
          { heading: 'The 4 psychological mistakes that destroy accounts', body: `😱 FOMO: Entering late because "you don't want to miss out" → you enter at the worst point\n😡 Revenge trading: Losing and immediately trying to recover → chain of losses\n🤞 Irrational hope: Moving the SL to avoid closing in loss → disaster\n💰 Overtrading: Trading too much → you give back all monthly profit in spreads` },
          { heading: 'The anti-FOMO protocol', body: `If you feel like you're "missing something":\n\n1. Stop. Breathe. Don't enter.\n2. There's a new setup EVERY DAY in gold.\n\nThe 3 "no" rule:\n• Not my zone → Don't enter\n• No R:R 1:2 → Don't enter\n• Not in my trading hours → Don't enter` },
          { heading: 'How to handle a losing streak', body: `Loss 1: Normal.\nLoss 2: Review the setup.\nLoss 3 in one day → STOP. Close the computer.\n\nProtocol:\n• -2%: alert, halve your lot size\n• -3%: STOP. Session over.\n• -5%: prop account frozen` },
        ],
        quiz: [
          { q: '"Revenge trading" is:', options: ['A valid strategy', 'Trading impulsively to recover losses', 'A type of order'], answer: 1 },
          { q: 'When you are at -3% for the day, you should:', options: ['Increase lot size to recover', 'Stop and close the computer', 'Look for more setups'], answer: 1 },
        ],
      },
      {
        id: 'l3-m2', title: 'The Trading Journal', duration: '10 min', type: 'lesson', icon: '📔',
        content: [
          { heading: 'Why the journal is your secret weapon', body: `Profitable traders have one thing in common: they keep a journal.\n\nWithout a journal:\n• You repeat the same mistakes\n• You don't know which setups work for you\n\nWith a journal:\n• You identify error patterns\n• You have evidence of your methodology (required for prop firms)` },
          { heading: 'What to record for each trade', body: `📌 BEFORE:\n• Setup, entry, SL, TP, R:R calculated, emotional state (1-10)\n\n📌 AFTER:\n• Result, did you follow the plan?, what to improve\n\nTools: Notion, Excel or a notebook. Whatever you use, use it ALWAYS.` },
          { heading: 'Monthly review', body: `At the end of each month, analyse:\n• Win rate, average R:R\n• Best day of the week\n• Best session (London or NY)\n• Worst mistake of the month\n\nWith 3 months of journaling you'll know which setups are YOUR setups.` },
        ],
        quiz: [
          { q: 'A trading journal is mainly used to:', options: ['Show off on social media', 'Identify error patterns and improvements', 'Calculate taxes'], answer: 1 },
        ],
      },
      {
        id: 'l3-m3', title: 'How to pass a prop firm account step by step', duration: '20 min', type: 'lesson', icon: '🏦',
        content: [
          { heading: 'Choosing the right prop firm', body: `🏆 FTMO: The most well-known. $200 for a $10K account. Strict but excellent reputation.\n🏆 MyFundedFX: More flexible, allows news trading.\n🏆 Topstep: Good for gold futures.\n🏆 FundedNext: Budget-friendly option.\n\nVerify it allows XAUUSD, spreads <50 pips, and no absurd restrictions.` },
          { heading: 'Attack plan for Phase 1', body: `Goal: +8% in 30 days without breaking rules.\n\n📅 Conservative plan:\n• Max 1-2 trades per day\n• Risk: 0.5% per trade ($50 on $10K)\n• Stop at -2% daily\n\nWeek 1: Watch more than you trade.\nWeek 4: If you already have +8%, stop!` },
          { heading: 'Mistakes that get prop accounts terminated', body: `❌ Increasing lot size when you're doing well\n❌ Trading during news without understanding the risk\n❌ Not using Stop Loss\n❌ Leaving trades open overnight without management\n❌ Trying to recover losses with larger lots\n\nIf you lose $300 on Tuesday, don't recover it that day. Start fresh on Wednesday.` },
        ],
        quiz: [
          { q: 'The correct strategy when you already have the +8% target is:', options: ['Keep trading to earn more', 'Stop and wait for verification', 'Double the lot for bonus'], answer: 1 },
          { q: 'The biggest mistake in prop accounts is:', options: ['Trading too few trades', 'Increasing lots when doing well or to recover', 'Using Stop Loss'], answer: 1 },
        ],
      },
      {
        id: 'l3-m4', title: 'Advanced setups on XAU/USD', duration: '15 min', type: 'lesson', icon: '🎯',
        content: [
          { heading: 'Setup 1: Break and Retest', body: `1. Price breaks a significant resistance with force\n2. Price pulls back and "tests" that level (now support)\n3. A buy signal appears at that level\n4. Enter with SL below support and TP at next level\n\nWhy it works? Institutions buy on the retest.` },
          { heading: 'Setup 2: London Session — First hour', body: `Gold frequently sets its daily direction in the first 30-60 minutes of London (8:00-9:00 GMT).\n\n1. Wait for 8:00 GMT\n2. Watch the first 15-30 min without trading\n3. Which direction does the overnight range break?\n4. Enter in the breakout direction\n\nThis strategy produces 1 clear trade per day — perfect for prop firms.` },
          { heading: 'Setup 3: Smart Money Concepts (SMC)', body: `📊 Order Blocks: Zones where institutions placed large orders. Price tends to return to them.\n\n🔍 How to identify an Order Block:\n1. Find a strong candle that started a significant move\n2. The body of that candle = your Order Block\n3. When price returns → entry setup\n\n📍 Fair Value Gaps: Price gaps the market tends to fill.` },
        ],
        quiz: [
          { q: 'In the Break and Retest setup, when do you enter?', options: ['When the price breaks the level', 'When the price comes back to test the broken level', 'Randomly'], answer: 1 },
          { q: 'A Fair Value Gap is:', options: ['A technical indicator', 'A price gap the market tends to fill', 'The broker spread'], answer: 1 },
        ],
      },
    ],
  },
];

const nl: AcademyLevel[] = [
  {
    id: 1, name: 'Beginner', emoji: '🟡', subtitle: 'Van nul naar eerste trade',
    color: 'border-yellow-500/40 bg-yellow-500/5', accent: 'text-yellow-400', bar: 'bg-yellow-500', xpRequired: 0,
    modules: [
      {
        id: 'l1-m0', title: '🖥️ Hoe gebruik je de simulator — Interface-gids', duration: '7 min', type: 'guide', icon: '🖥️',
        content: [
          {
            heading: 'Het hoofdscherm van de simulator',
            body: `Als je het scherm /trade opent, zie je drie hoofdgebieden:

📊 LINKS — De candlestick-grafiek (goudprijs in realtime)
📋 RECHTS — Het orderpaneel (waar je trades opent en sluit)
📌 ONDER — De ORDER TAPE (geschiedenis van al je orders)

Er is ook een gouden bovenste balk (het "Bullion Desk") die live marktgegevens toont. Beweeg de muis over een ⓘ-pictogram om te zien wat elke term betekent.`,
          },
          {
            heading: 'De bovenste balk: Bullion Desk',
            body: `De gouden bovenste balk toont real-time marktinformatie:

◆ BULLION DESK — Naam van je virtuele handelsbureau
XAUUSD — Het paar dat je verhandelt (goud vs. dollar)
BID — Prijs waartegen je kunt VERKOPEN (groen)
ASK — Prijs waartegen je kunt KOPEN (rood)
SPD — Spread: het verschil BID-ASK, de kosten per trade
SESSION — Actieve marktsessie (Londen, New York, Tokio)
NET FLOW — Netto orderstroom: meer kopen of verkopen op de desk
REVIEW QUEUE — Orders wachtend op goedkeuring

💡 Alle termen hebben uitleg — beweeg de muis over het ⓘ naast elk item.`,
          },
          {
            heading: 'De Japanse candlestick-grafiek',
            body: `De grafiek in het midden toont de goudprijs. Elke "kaars" staat voor een tijdsperiode:

🕯️ Groene kaars (stijgend): prijs steeg in die periode. Het lichaam loopt van open (onder) naar sluiting (boven).
🕯️ Rode kaars (dalend): prijs daalde. Het lichaam loopt van open (boven) naar sluiting (onder).
📏 De wick/schaduw: de hoogste en laagste prijs die bereikt werd.

In de grafiekwerkbalk vind je:
— Tijdsbestekken: 1H = 1-uurkaarsen, 4H = 4 uur, etc.
— Indicatoren: MA20, MA50, BB, RSI, MACD (beweeg erover voor uitleg)
— Tekeninstrumenten: voor het tekenen van lijnen, Fibonacci-zones, etc.`,
          },
          {
            heading: 'Het orderpaneel (Order Entry)',
            body: `In het rechterpaneel vind je het formulier om trades te openen:

▲ KOPEN — Je koopt goud en wedt dat de prijs stijgt
▼ VERKOPEN — Je verkoopt goud en wedt dat de prijs daalt

Verplichte velden:
• Instapprijs: op welke prijs je wilt instappen (standaard de huidige prijs)
• Stop-verlies (SL): prijs waarbij de trade automatisch sluit als hij tegen je ingaat → VERPLICHT
• Winst nemen (TP): prijs waarbij de trade automatisch sluit met winst
• Loten: positiegrootte (begin met 0,01 — het minimum)

⚠️ De simulator laat je niet handelen zonder Stop-verlies. Dat is regel nummer 1.`,
          },
          {
            heading: 'De ORDER TAPE (onderste balk)',
            body: `De onderste balk is het "blotter" — het overzicht van al je orders. Je kunt het inklappen door erop te klikken.

Kolommen:
• TYPE: KOPEN (▲ groen) of VERKOPEN (▼ rood)
• Paar: XAUUSD
• Loten: positiegrootte
• Instapprijs: waartegen uitgevoerd
• SL / TP: je beschermingsniveaus
• Resultaat: winst of verlies bij sluiting

Orders verschijnen in realtime. Gebruik dit overzicht om je geschiedenis te bekijken en van elke trade te leren.`,
          },
          {
            heading: 'Je eerste trade in 5 stappen',
            body: `Volg deze stappen voor je eerste gesimuleerde trade:

1️⃣ Bekijk de grafiek — zijn de laatste kaarsen voornamelijk groen (stijgend) of rood (dalend)?
2️⃣ Kies KOPEN als de prijs stijgt, VERKOPEN als hij daalt
3️⃣ Stel je Stop-verlies in op 30–50 punten van je instapprijs
4️⃣ Stel je Winst nemen in op het dubbele van het Stop-verlies (als SL=30, TP=60)
5️⃣ Gebruik 0,01 lot en klik op BEVESTIGEN

Maak je geen zorgen als de eerste trade verlies geeft — het gaat erom dat je het doet mét Stop-verlies en het flow leert kennen.`,
          },
        ],
        quiz: [
          { q: 'Wat betekent BID in de bovenste balk?', options: ['De prijs waartegen je koopt', 'De prijs waartegen je verkoopt', 'Het verhandelde volume'], answer: 1 },
          { q: 'Waarvoor dient het Stop-verlies (SL)?', options: ['Om meer geld te verdienen', 'Om de trade automatisch te sluiten als hij tegen je ingaat', 'Om de geschiedenis te bekijken'], answer: 1 },
          { q: 'Een groene kaars in de grafiek betekent...', options: ['De prijs daalde in die periode', 'De prijs steeg in die periode', 'Er was geen activiteit'], answer: 1 },
          { q: 'Welke lotgrootte is aanbevolen om mee te beginnen?', options: ['1,00 lot', '0,10 lot', '0,01 lot (micro)'], answer: 2 },
        ],
      },
      {
        id: 'l1-m1', title: 'Wat is goud (XAU/USD)?', duration: '5 min', type: 'lesson', icon: '📖',
        content: [
          { heading: 'Goud als financieel instrument', body: `XAU is het symbool voor goud op de financiële markten. USD is de Amerikaanse dollar. Als je "XAUUSD = 2.340" ziet, betekent dit dat 1 troy ounce goud $2.340 kost.\n\nGoud is een van de meest verhandelde activa ter wereld omdat:\n• Het een veilige haven is bij economische crises\n• Het sterk beweegt bij inflatie\n• Het 24/5 verhandeld wordt (maandag t/m vrijdag)\n• Hoge liquiditeit — je kunt snel in- en uitstappen` },
          { heading: 'Hoeveel beweegt goud per dag?', body: `Goud beweegt doorgaans tussen $10 en $30 per dag. Dit is belangrijk omdat:\n\n• 1 pip in XAUUSD = $0,01\n• Een beweging van $10 = 1.000 pips\n• Met 0,01 lot = $10 winst of verlies\n\nTip: Goud is volatiel. Respecteer altijd je Stop-verlies.` },
          { heading: 'Belangrijke handelssessies', body: `Goud beweegt het meest tijdens:\n\n🇬🇧 Londen (8:00–16:00 GMT): Europese opening, eerste grote beweging\n🇺🇸 New York (13:00–21:00 GMT): Meest volatiel, dagelijks hoog en laag\n⚠️ Economisch nieuws (CPI, NFP, Fed): Bewegingen van $20-50 in minuten\n\nBeginner: Vermijd handelen tijdens nieuwspublicaties tot niveau 2.` },
        ],
        quiz: [
          { q: 'XAUUSD 2.340 betekent...', options: ['De dollar is $2.340 waard', '1 troy ounce goud kost $2.340', 'Goud steeg vandaag $2.340'], answer: 1 },
          { q: 'De meest volatiele goudsessie is...', options: ['Aziatische sessie', 'New York sessie', 'Weekend'], answer: 1 },
        ],
      },
      {
        id: 'l1-m2', title: 'Loten, pips en monetaire waarde', duration: '8 min', type: 'lesson', icon: '📐',
        content: [
          { heading: 'Lotgrootte: hoeveel je riskeert', body: `Op de goudmarkt wordt positiegrootte gemeten in loten:\n\n📦 1 standaard lot = 100 oz → $10 per pip\n📦 0,10 lot (mini) = 10 oz → $1 per pip\n📦 0,01 lot (micro) = 1 oz → $0,10 per pip\n\nPraktijkvoorbeeld:\n• Je koopt 0,10 lot op $2.340\n• Prijs stijgt naar $2.350 (+$10 = +1.000 pips)\n• Winst: 1.000 pips × $1 = $10` },
          { heading: 'Risicoberekening in geld', body: `De gouden regel: riskeer NOOIT meer dan 1-2% per trade.\n\nMet een account van $10.000:\n• 1% = $100 maximaal risico per trade\n• Als je SL 50 pips is ($5 per pip met 0,10 lot)\n• Gebruik 0,10 lot (50 pips × $1 = $50 — onder 1%)\n\nSnelle formule:\nLoten = (Kapitaal × % risico) ÷ (SL in pips × pip-waarde)` },
          { heading: 'De goudspread', body: `De spread is het verschil tussen de koop- (ask) en verkoopprijs (bid).\n\nVoorbeeld:\n• Bod: $2.339,50 (prijs waartegen je verkoopt)\n• Laat: $2.340,00 (prijs waartegen je koopt)\n• Spread: $0,50 = 50 pips\n\n⚠️ Pas op voor brokers met spreads boven 100 pips — ze vreten je winst stilletjes op.` },
        ],
        quiz: [
          { q: 'Met 0,01 lot, hoeveel is 1 pip waard in goud?', options: ['$1', '$0,10', '$10'], answer: 1 },
          { q: 'Je hebt $5.000. Maximaal risico per trade bij 1%:', options: ['$500', '$50', '$5.000'], answer: 1 },
        ],
      },
      {
        id: 'l1-m3', title: 'Stop-verlies en Winst nemen', duration: '6 min', type: 'lesson', icon: '🛡️',
        content: [
          { heading: 'Wat is een Stop-verlies?', body: `Het Stop-verlies (SL) is je vangnet. Het is de prijs waarop je trade automatisch sluit om verliezen te beperken.\n\nZONDER Stop-verlies = Russisch roulette. De markt kan 500 pips tegen je ingaan terwijl je slaapt.\n\nMET Stop-verlies op 50 pips = je weet precies hoeveel je kunt verliezen.\n\nRegel #1: Open nooit een trade zonder Stop-verlies. Nooit.` },
          { heading: 'Wat is Winst nemen?', body: `Winst nemen (TP) is de doelprijs waarop je trade automatisch met winst sluit.\n\nWaarom gebruiken? Omdat hebzucht accounts vernietigt.\n• Prijs stijgt +$15, je bent blij\n• Geen TP, je denkt "het gaat hoger"\n• Prijs daalt -$20, je verliest\n\nStel de TP in vóórdat je de trade opent, niet erna.` },
          { heading: 'Risico:Winst-verhouding (R:W)', body: `De R:W-verhouding is hoeveel je wint versus hoeveel je riskeert.\n\n❌ Slecht: SL = 50 pips, TP = 25 pips → R:W 1:0,5\n✅ Minimum: SL = 50 pips, TP = 50 pips → R:W 1:1\n🏆 Doel: SL = 50 pips, TP = 100 pips → R:W 1:2\n\nMet R:W 1:2 kun je 6 van de 10 trades verliezen en TOCH winstgevend zijn.` },
        ],
        quiz: [
          { q: 'Wat doet het Stop-verlies?', options: ['Sluit de trade met winst', 'Beperkt je maximale verlies', 'Vergroot je lot'], answer: 1 },
          { q: 'Met R:W 1:2, als je $100 riskeert, hoeveel win je als TP wordt bereikt?', options: ['$50', '$100', '$200'], answer: 2 },
        ],
      },
      {
        id: 'l1-m4', title: 'Je eerste trade in de simulator', duration: '10 min', type: 'practice', icon: '⚡', isPractice: true,
        content: [
          { heading: 'Oefen nu in de simulator', body: `1. Bekijk de grafiek — stijgt of daalt de prijs de laatste 15 minuten?\n2. Stijgt → KOPEN. Daalt → VERKOPEN\n3. Stel je Stop-verlies in op 30 pips van je instapprijs\n4. Stel je Winst nemen in op 60 pips (R:W 1:2)\n5. Gebruik 0,01 lot (micro, minimaal risico)\n6. Open de trade en bekijk het resultaat` },
          { heading: 'Wat leer je van deze trade', body: `Het maakt niet uit of je wint of verliest bij je eerste trade. Wat telt:\n\n✅ Heb je een Stop-verlies ingesteld?\n✅ Was je R:W groter dan 1:1?\n✅ Berekende je het risico vóór het instappen?\n\nAls je alle drie met ja beantwoordt, ben je op de goede weg.` },
        ],
        quiz: [],
      },
      {
        id: 'l1-m5', title: 'MetaTrader 5: Eerste stappen', duration: '10 min', type: 'guide', icon: '🖥️',
        content: [
          { heading: 'Wat is MetaTrader 5', body: `MetaTrader 5 (MT5) is het meest gebruikte handelsplatform ter wereld. Prop firms (FTMO, MyFundedFX, etc.) gebruiken MT5.\n\nDeze simulator leert je de CONCEPTEN. MT5 is waar je ze toepast met echt geld wanneer je er klaar voor bent.` },
          { heading: 'MT5-interface — Hoofdgebieden', body: `📊 Grafiek (midden): Goudprijs in realtime\n📋 Marktoverzicht (links): Activalijst. Zoek XAUUSD\n⚡ Terminal (onder): Open posities, geschiedenis, saldo\n🔧 Werkbalk (boven): Knoppen voor orders, indicatoren, tijdsbestekken` },
          { heading: 'Hoe open je een trade in MT5', body: `1. Dubbelklik op XAUUSD in het Marktoverzicht\n2. Selecteer "Marktuitvoering"\n3. Voer de lotgrootte in (begin met 0,01)\n4. Stel Stop-verlies en Winst nemen in\n5. Klik op KOPEN (groen) of VERKOPEN (rood)` },
          { heading: 'Tijdsbestekken in MT5', body: `M1 = 1 minuut (te veel ruis)\nM15 = 15 minuten ← Begin hier\nH1 = 1 uur (duidelijkere signalen)\nH4 = 4 uur (grote trends)\nD1 = 1 dag (algemene context)\n\nVoor beginners: gebruik H1 voor analyse en M15 voor instap.` },
        ],
        quiz: [
          { q: 'In MT5 toont het Terminal (onder):', options: ['De prijsgrafiek', 'Je open posities en saldo', 'Technische indicatoren'], answer: 1 },
          { q: 'Het aanbevolen tijdsbestek voor analyse als beginner is:', options: ['M1', 'H1', 'M5'], answer: 1 },
        ],
      },
      {
        id: 'l1-m6', title: 'TradingView voor analyse', duration: '8 min', type: 'guide', icon: '📈',
        content: [
          { heading: 'Wat is TradingView?', body: `TradingView is het populairste technische analyseplatform ter wereld.\n\nURL: tradingview.com — maak een gratis account aan\nZoek: XAUUSD of GOLD\n\nDe gratis versie is voldoende om te beginnen.` },
          { heading: 'Essentiële tools', body: `📏 Trendlijn: Teken trends\n📐 Fibonacci-retracements: Steun/weerstandsniveaus\n📦 Rechthoek: Markeer belangrijke prijszones\n📍 Horizontale lijn: Markeer exacte steun en weerstand\n📝 Tekst: Voeg notities toe aan je analyses` },
          { heading: 'Hoe bekijk je goud op TradingView', body: `1. Zoek "XAUUSD" in de zoekbalk\n2. Selecteer OANDA:XAUUSD of FX:XAUUSD\n3. Schakel over naar H1-tijdsbestek\n4. Activeer kandelaarsgrafiek\n5. Voeg EMA 20 en EMA 50 toe` },
        ],
        quiz: [
          { q: 'TradingView wordt voornamelijk gebruikt voor:', options: ['Orders uitvoeren', 'Grafieken analyseren', 'Belastingen berekenen'], answer: 1 },
          { q: 'De professionele werkwijze is:', options: ['Alleen MT5', 'Alleen TradingView', 'TradingView voor analyse + MT5 voor uitvoering'], answer: 2 },
        ],
      },
    ],
  },
  {
    id: 2, name: 'Gemiddeld', emoji: '🔵', subtitle: 'Professioneel risicobeheer',
    color: 'border-blue-500/40 bg-blue-500/5', accent: 'text-blue-400', bar: 'bg-blue-500', xpRequired: 500,
    modules: [
      {
        id: 'l2-m1', title: 'Japanse kandelaars — De 5 belangrijkste patronen', duration: '12 min', type: 'lesson', icon: '🕯️',
        content: [
          { heading: 'Waarom kandelaars belangrijk zijn', body: `Elke kandelaar vertelt een verhaal van 4 prijzen:\n• Open, Hoog, Laag, Sluit\n\nGroen = kopers wonnen\nRood = verkopers wonnen` },
          { heading: 'De 5 patronen voor goud', body: `🔨 Hamer: Lange onderste wick → koopsignaal bij steun\n⭐ Doji: Minimale body → marktbesluiteloosheid\n🌟 Bullish engulfing: Groene kandelaar omhult rode → sterk koopsignaal\n⭐ Bearish engulfing: Rode kandelaar omhult groene → sterk verkoopsignaal\n📌 Pin bar: Lange wick, prijsafwijzing → keringssignaal` },
          { heading: 'Hoe identificeer je ze op TradingView', body: `1. Open XAUUSD op H1\n2. Zoek pullbacks naar steunniveaus\n3. Verschijnt er een hamer of pin bar?\n4. Dat is je instapopstelling\n\nOnthoud: patroon + zone + minimaal R:W 1:2` },
        ],
        quiz: [
          { q: 'Een Doji geeft aan:', options: ['Sterke stijgende trend', 'Marktbesluiteloosheid', 'Veilig verkoopsignaal'], answer: 1 },
          { q: 'Een pin bar is het meest betrouwbaar wanneer hij verschijnt bij:', options: ['Elke prijs', 'Een steun- of weerstandszone', 'Tijdens nieuws'], answer: 1 },
        ],
      },
      {
        id: 'l2-m2', title: 'Steun, Weerstand en Liquiditeitszones', duration: '15 min', type: 'lesson', icon: '🧱',
        content: [
          { heading: 'Steun en weerstand in goud', body: `Steun: prijsniveau waar goud herhaaldelijk omhoog stuitert\nWeerstand: niveau waar goud herhaaldelijk omlaag stuitert\n\nBelangrijkste niveaus:\n• Ronde getallen: $2.300, $2.350, $2.400\n• Vorige dagelijkse/wekelijkse hoogtepunten en dieptepunten\n\nGoudtip: Ronde getallen werken als magneten in goudmarkten.` },
          { heading: 'Liquiditeitszones', body: `Institutionele traders bewegen de markt op zoek naar Stop-verliezen van andere traders.\n\nWaar plaatsen mensen hun SL?\n• Onder duidelijke dieptepunten → neerwaartse liquiditeit\n• Boven duidelijke hoogtepunten → opwaartse liquiditeit\n\nStrategie: Plaats je SL iets VOORBIJ het voor de hand liggende niveau om niet weggevaagd te worden.` },
          { heading: 'Hoe teken je zones in TradingView', body: `1. Open H4 op TradingView\n2. Identificeer de 3 meest significante recente hoogte- en dieptepunten\n3. Teken horizontale lijnen op die prijzen\n4. Ga naar H1 — is de prijs in de buurt van een zone?\n5. Bij steun → zoek een koopsignaal\n\nRegel: Koop niet in het midden van nergens. Wacht op de zones.` },
        ],
        quiz: [
          { q: 'Waarom zijn ronde getallen belangrijk in goud?', options: ['Ze zijn willekeurig', 'De markt respecteert ze psychologisch', 'Ze tellen alleen in forex'], answer: 1 },
          { q: 'Een "stop hunt" is wanneer de markt:', options: ['Onbeperkt stijgt', 'Duidelijke SL-niveaus wegveegt vóór de echte richting', 'Stilstaat'], answer: 1 },
        ],
      },
      {
        id: 'l2-m3', title: 'Geavanceerd risicobeheer', duration: '10 min', type: 'lesson', icon: '⚖️',
        content: [
          { heading: 'De 1%-regel — Waarom het accounts redt', body: `Met de 1%-regel:\n\nJe kunt 10 trades op rij verliezen en verliest slechts 10% van het account.\n\nProp firm-wiskunde: FTMO-accounts hebben een maximale drawdown van 10%. Met 1% per trade heb je 10 opeenvolgende verliezen nodig om het account te verliezen. Met 5% per trade heb je er maar 2 nodig.` },
          { heading: 'Positiegrootte-calculator', body: `Exacte formule:\n\nLoten = (Saldo × % Risico) ÷ (SL in pips × $10/pip)\n\nVoorbeeld:\n• Saldo: $10.000, Risico: 1% = $100, SL: 50 pips\n• Loten = $100 ÷ (50 × $10) = 0,20 lot\n\nBereken ALTIJD vóór het openen. Nooit op gevoel.` },
          { heading: 'Open trades beheren', body: `1. Verplaats het SL NOOIT verder weg\n2. Je KUN het SL naar breakeven verplaatsen als de prijs 50% in jouw richting beweegt\n3. Voeg geen posities toe aan verliezende trades\n\nBreakeven in de praktijk:\n• Koop op $2.340, SL $2.320, TP $2.380\n• Prijs stijgt naar $2.360 → verplaats SL naar $2.340` },
        ],
        quiz: [
          { q: 'Met de 1%-regel, hoeveel opeenvolgende verliezende trades zijn er nodig voor ernstige schade?', options: ['2', '5', 'Veel meer — de schade is geleidelijk'], answer: 2 },
          { q: 'SL naar breakeven verplaatsen betekent het verplaatsen naar:', options: ['De laagste prijs van de dag', 'Je instapprijs', 'Het Winst nemen'], answer: 1 },
        ],
      },
      {
        id: 'l2-m4', title: 'FTMO Fase 1 Simulatie — Oefening', duration: '20 min', type: 'challenge', icon: '🏆', isPractice: true,
        content: [
          { heading: 'Prop firm accountregels', body: `📋 Typische Fase 1-regels:\n• Winstdoel: +8% ($800 verdienen op een $10K account)\n• Max dagelijks verlies: -5% (-$500)\n• Max totale drawdown: -10% (-$1.000)\n• Tijd: 30 dagen\n\n⚠️ Verlies je 5% op één dag, dan wordt het account bevroren.` },
          { heading: 'Jouw uitdaging: Simuleer Fase 1', body: `Handel gedurende 10 sessies met deze regels:\n\n✅ Doel: +8% bereiken\n🛑 Daglimiet: niet meer dan 5% per dag verliezen\n🛑 Drawdown: niet onder 10% zakken\n\nStrategie:\n• Max 1-2 trades per dag\n• Risico per trade: 0,5-1%\n• Als je op -2% staat voor de dag → stop met handelen` },
        ],
        quiz: [],
      },
      {
        id: 'l2-m5', title: 'Technische indicatoren op MT5 en TradingView', duration: '12 min', type: 'guide', icon: '📡',
        content: [
          { heading: 'De 3 indicatoren die werken voor goud', body: `📈 EMA 20 + EMA 50 op H1:\n• EMA 20 kruist boven EMA 50 → stijgende trend\n• Prijs boven beide EMA's = stijgende trend\n\n📊 RSI:\n• RSI > 70 = overkocht\n• RSI < 30 = oververkocht\n\n📈 MACD:\n• Stijgende kruising → koopsignaal` },
          { heading: 'Hoe voeg je indicatoren toe in MT5', body: `Voor EMA:\n1. Invoegen → Indicatoren → Trend → Voortschrijdend gemiddelde\n2. Periode: 20, Methode: Exponentieel\n3. Herhaal met periode 50\n\nVoor RSI:\n1. Invoegen → Indicatoren → Oscillatoren → RSI\n2. Periode: 14` },
          { heading: 'Hoe voeg je indicatoren toe in TradingView', body: `1. Klik op "Indicatoren"\n2. Zoek "EMA" → periode 20 → Toevoegen\n3. Herhaal met periode 50\n4. Zoek "RSI" → toevoegen\n5. Zoek "MACD" → toevoegen\n\nTradingView Pro: Maak meldingen op indicatoren zodat je niet constant het scherm hoeft te bewaken.` },
        ],
        quiz: [
          { q: 'RSI onder 30 geeft aan:', options: ['Goud is erg duur', 'Goud kan oververkocht zijn', 'Een veilig verkoopsignaal'], answer: 1 },
          { q: 'Wanneer EMA 20 boven EMA 50 kruist:', options: ['Bearish signaal', 'Bullish signaal', 'Geen signaal'], answer: 1 },
        ],
      },
    ],
  },
  {
    id: 3, name: 'Gevorderd', emoji: '🔴', subtitle: 'Mentaliteit en echte financiering',
    color: 'border-red-500/40 bg-red-500/5', accent: 'text-red-400', bar: 'bg-red-500', xpRequired: 1500,
    modules: [
      {
        id: 'l3-m1', title: 'Handelpsychologie — De innerlijke vijand', duration: '15 min', type: 'lesson', icon: '🧠',
        content: [
          { heading: 'De 4 psychologische fouten die accounts vernietigen', body: `😱 FOMO: Te laat instappen omdat je "niets wilt missen" → je stapt in op het slechtste punt\n😡 Wraakhandel: Verliezen en onmiddellijk proberen te herstellen → reeks van verliezen\n🤞 Irrationele hoop: SL verplaatsen om verliesafrekening te vermijden → ramp\n💰 Overhandelen: Te veel handelen → je geeft alle maandwinst terug in spreads` },
          { heading: 'Het anti-FOMO-protocol', body: `Als je voelt dat je "iets mist":\n\n1. Stop. Adem. Ga niet in.\n2. Er is elke dag een nieuwe opstelling in goud.\n\nDe 3 "nee"-regel:\n• Niet mijn zone → Niet instappen\n• Geen R:W 1:2 → Niet instappen\n• Niet in mijn handelsuren → Niet instappen` },
          { heading: 'Hoe ga je om met een verliezende reeks', body: `Verlies 1: Normaal.\nVerlies 2: Controleer de opstelling.\nVerlies 3 op één dag → STOP. Sluit de computer.\n\nProtocol:\n• -2%: waarschuwing, halveer je lotgrootte\n• -3%: STOP. Sessie voorbij.\n• -5%: prop account bevroren` },
        ],
        quiz: [
          { q: '"Wraakhandel" is:', options: ['Een geldige strategie', 'Impulsief handelen om verliezen te herstellen', 'Een type order'], answer: 1 },
          { q: 'Wanneer je op -3% staat voor de dag, moet je:', options: ['Lotgrootte vergroten om te herstellen', 'Stoppen en de computer sluiten', 'Meer opstellingen zoeken'], answer: 1 },
        ],
      },
      {
        id: 'l3-m2', title: 'Het Handelsdagboek (Trading Journal)', duration: '10 min', type: 'lesson', icon: '📔',
        content: [
          { heading: 'Waarom het dagboek je geheime wapen is', body: `Winstgevende traders hebben één ding gemeen: ze houden een dagboek bij.\n\nZonder dagboek:\n• Je herhaalt dezelfde fouten\n• Je weet niet welke opstellingen voor jou werken\n\nMet dagboek:\n• Je identificeert foutpatronen\n• Je hebt bewijs van je methodologie (vereist voor prop firms)` },
          { heading: 'Wat je per trade registreert', body: `📌 VOOR:\n• Opstelling, instap, SL, TP, berekende R:W, emotionele toestand (1-10)\n\n📌 NA:\n• Resultaat, volgde je het plan?, wat te verbeteren\n\nHulpmiddelen: Notion, Excel of een notitieboek. Wat je ook gebruikt, gebruik het ALTIJD.` },
          { heading: 'Maandelijkse evaluatie', body: `Aan het einde van elke maand analyseer je:\n• Winstpercentage, gemiddelde R:W\n• Beste dag van de week\n• Beste sessie (Londen of NY)\n• Grootste fout van de maand\n\nMet 3 maanden dagboek weet je welke opstellingen JOUW opstellingen zijn.` },
        ],
        quiz: [
          { q: 'Een handelsdagboek wordt voornamelijk gebruikt om:', options: ['Op te scheppen op sociale media', 'Foutpatronen en verbeteringen te identificeren', 'Belastingen te berekenen'], answer: 1 },
        ],
      },
      {
        id: 'l3-m3', title: 'Hoe slaag je stap voor stap voor een prop firm account', duration: '20 min', type: 'lesson', icon: '🏦',
        content: [
          { heading: 'De juiste prop firm kiezen', body: `🏆 FTMO: De bekendste. $200 voor een $10K account. Streng maar uitstekende reputatie.\n🏆 MyFundedFX: Flexibeler, staat nieuwshandel toe.\n🏆 Topstep: Goed voor goud-futures.\n🏆 FundedNext: Budgetvriendelijke optie.\n\nVerifieer dat XAUUSD is toegestaan, spreads <50 pips en geen absurde beperkingen.` },
          { heading: 'Aanvalsplan voor Fase 1', body: `Doel: +8% in 30 dagen zonder regels te overtreden.\n\n📅 Conservatief plan:\n• Max 1-2 trades per dag\n• Risico: 0,5% per trade ($50 op $10K)\n• Stop bij -2% dagelijks\n\nWeek 1: Kijk meer dan je handelt.\nWeek 4: Als je al +8% hebt, stop!` },
          { heading: 'Fouten die prop accounts beëindigen', body: `❌ Lotgrootte verhogen als het goed gaat\n❌ Handelen tijdens nieuws zonder het risico te begrijpen\n❌ Geen Stop-verlies gebruiken\n❌ Trades open laten zonder beheer\n❌ Verliezen proberen te herstellen met grotere loten\n\nAls je dinsdag $300 verliest, herstel dat dan niet die dag. Begin fris op woensdag.` },
        ],
        quiz: [
          { q: 'De juiste strategie wanneer je al het +8%-doel hebt bereikt is:', options: ['Blijven handelen voor meer winst', 'Stoppen en wachten op verificatie', 'Lot verdubbelen voor bonus'], answer: 1 },
          { q: 'De grootste fout bij prop accounts is:', options: ['Te weinig trades', 'Loten verhogen als het goed gaat of om te herstellen', 'Stop-verlies gebruiken'], answer: 1 },
        ],
      },
      {
        id: 'l3-m4', title: 'Geavanceerde opstellingen op XAU/USD', duration: '15 min', type: 'lesson', icon: '🎯',
        content: [
          { heading: 'Opstelling 1: Break and Retest', body: `1. Prijs doorbreekt een significante weerstand met kracht\n2. Prijs trekt terug en "test" dat niveau (nu steun)\n3. Een koopsignaal verschijnt op dat niveau\n4. Stap in met SL onder steun en TP op het volgende niveau\n\nWaarom werkt het? Instituties kopen bij de retest.` },
          { heading: 'Opstelling 2: Londense sessie — Eerste uur', body: `Goud bepaalt zijn dagelijkse richting vaak in de eerste 30-60 minuten van Londen (8:00-9:00 GMT).\n\n1. Wacht op 8:00 GMT\n2. Bekijk de eerste 15-30 min zonder te handelen\n3. In welke richting breekt het nachtbereik?\n4. Stap in de richting van de breakout\n\nDeze strategie levert 1 duidelijke trade per dag op — perfect voor prop firms.` },
          { heading: 'Opstelling 3: Smart Money Concepts (SMC)', body: `📊 Order Blocks: Zones waar instituties grote orders plaatsten. De prijs keert er vaak naar terug.\n\n🔍 Hoe identificeer je een Order Block:\n1. Zoek een sterke kandelaar die een significante beweging startte\n2. De body van die kandelaar = jouw Order Block\n3. Als de prijs terugkeert → instapopstelling\n\n📍 Fair Value Gaps: Prijshiaten die de markt meestal opvult.` },
        ],
        quiz: [
          { q: 'Bij de Break and Retest opstelling, wanneer stap je in?', options: ['Als de prijs het niveau doorbreekt', 'Als de prijs terugkeert om het gebroken niveau te testen', 'Willekeurig'], answer: 1 },
          { q: 'Een Fair Value Gap is:', options: ['Een technische indicator', 'Een prijshiaat dat de markt neigt op te vullen', 'De broker-spread'], answer: 1 },
        ],
      },
    ],
  },
];

export const ACADEMY_CONTENT: Record<'es' | 'en' | 'nl', AcademyLevel[]> = { es, en, nl };
