import type { Level } from './types';

export const nivel2: Level = {
  id: 'n2',
  number: 2,
  title: 'Gestión del riesgo',
  subtitle: 'La habilidad que te mantiene en el juego',
  description:
    'Sabrás decidir cuánto arriesgar y calcular el tamaño exacto de cada operación, evaluar tu forma de operar con números y protegerte de las rachas perdedoras con límites claros.',
  lessons: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n2-matematica-perdidas',
      title: 'La matemática de las pérdidas',
      summary: 'Descubrirás por qué recuperar una pérdida exige ganar un porcentaje mayor del que perdiste y qué es el drawdown.',
      minutes: 8,
      sections: [
        {
          heading: 'Perder un 50% y ganar un 50% no te deja igual',
          blocks: [
            {
              type: 'p',
              text: 'Parece lógico pensar: «si pierdo un 50% y luego gano un 50%, vuelvo a estar donde empecé». Pero no es así, y entender por qué es la base de toda la gestión del riesgo.',
            },
            {
              type: 'example',
              title: 'Perder la mitad y ganar la mitad',
              rows: [
                ['Cuenta inicial', '$10,000'],
                ['Pierdes un 50%', '$5,000'],
                ['Ganas un 50% de $5,000', '+$2,500'],
                ['Cuenta final', '$7,500'],
                ['Resultado', 'Sigues perdiendo $2,500'],
              ],
            },
            {
              type: 'p',
              text: 'La clave es que el porcentaje de ganancia se aplica sobre una cuenta **más pequeña**. Cuanto más pierdes, más pequeña es la base desde la que tienes que recuperarte.',
            },
          ],
        },
        {
          heading: 'Cuánto necesitas ganar para recuperar',
          blocks: [
            {
              type: 'formula',
              label: 'Ganancia necesaria para recuperar una pérdida',
              expr: 'Ganancia necesaria = pérdida ÷ (1 − pérdida)',
              note: 'Usa la pérdida en forma decimal: 20% = 0.20. Por ejemplo, 0.20 ÷ 0.80 = 0.25, es decir, un 25%.',
            },
            {
              type: 'table',
              headers: ['Pérdida', 'Te queda (de $10,000)', 'Ganancia necesaria para recuperar'],
              rows: [
                ['10%', '$9,000', '11.1%'],
                ['20%', '$8,000', '25%'],
                ['30%', '$7,000', '42.9%'],
                ['50%', '$5,000', '100%'],
                ['75%', '$2,500', '300%'],
              ],
            },
            {
              type: 'figure',
              name: 'drawdown-recovery',
              caption: 'Cuanto más profunda es la caída, más empinada es la subida necesaria para recuperarla.',
            },
            {
              type: 'example',
              title: 'Recuperar una pérdida del 20%',
              rows: [
                ['Cuenta inicial', '$10,000'],
                ['Pierdes un 20%', '$8,000'],
                ['Para volver a $10,000', 'Necesitas ganar $2,000'],
                ['En porcentaje', '2,000 ÷ 8,000 = 25%'],
              ],
            },
          ],
        },
        {
          heading: 'Qué es el drawdown',
          blocks: [
            {
              type: 'p',
              text: 'El **drawdown** es la caída de la cuenta desde su punto más alto hasta un mínimo posterior. El **drawdown máximo** es la mayor de esas caídas en todo tu historial. Mide cuánto ha llegado a doler tu forma de operar.',
            },
            {
              type: 'example',
              title: 'Medir un drawdown',
              rows: [
                ['Máximo de la cuenta', '$11,000'],
                ['Mínimo posterior', '$9,900'],
                ['Caída', '11,000 − 9,900 = $1,100'],
                ['Drawdown', '1,100 ÷ 11,000 = 10%'],
              ],
              note: 'Se mide desde el máximo, no desde el saldo inicial: aunque sigas por encima de los $10,000 con los que empezaste, has tenido un drawdown del 10%.',
            },
            {
              type: 'callout',
              tone: 'tip',
              text: 'En el **Diario** del simulador verás tu drawdown máximo y tu curva de capital. Míralos con la misma atención que tu P&L (ganancias y pérdidas).',
            },
          ],
        },
        {
          heading: 'Por qué las pérdidas pequeñas son tus aliadas',
          blocks: [
            {
              type: 'p',
              text: 'Mientras la caída se queda en un 10% o un 20%, recuperarla es razonable. A partir de ahí, el esfuerzo se dispara. Por eso, el objetivo número uno de la gestión del riesgo es **mantener las caídas pequeñas**.',
            },
            {
              type: 'example',
              title: 'Diez pérdidas seguidas con distinto riesgo por operación',
              rows: [
                ['Arriesgando el 1% en cada una', 'La cuenta queda en $9,043.82 (−9.6%)'],
                ['Para recuperar', 'Necesitas ganar un 10.6%'],
                ['Arriesgando el 5% en cada una', 'La cuenta queda en $5,987.37 (−40.1%)'],
                ['Para recuperar', 'Necesitas ganar un 67%'],
              ],
              note: 'Cada pérdida se calcula sobre el saldo que queda en ese momento, partiendo de $10,000.',
            },
            {
              type: 'callout',
              tone: 'key',
              text: 'Proteger el capital es lo primero. Sin capital no hay más operaciones, y sin más operaciones no hay forma de mejorar.',
            },
          ],
        },
        {
          heading: 'Qué significa esto para ti',
          blocks: [
            {
              type: 'p',
              text: 'Todo esto se traduce en tres hábitos concretos que trabajarás en el resto de este nivel:',
            },
            {
              type: 'list',
              items: [
                'Arriesga poco en cada operación: lo verás en la próxima lección con la regla del 1%.',
                'Ponte límites de pérdida diarios y semanales, para que un mal día no se convierta en una mala semana.',
                'No intentes recuperar de golpe con operaciones más grandes: las pérdidas grandes son las más difíciles de deshacer.',
              ],
            },
          ],
        },
      ],
      keyPoints: [
        'Para recuperar una pérdida necesitas ganar un porcentaje mayor que el que perdiste.',
        'Una caída del 10% pide un 11.1%; del 20%, un 25%; del 50%, un 100%.',
        'El drawdown es la caída de la cuenta desde su máximo hasta un mínimo posterior.',
        'Mantener las pérdidas pequeñas es la base de toda la gestión del riesgo.',
      ],
      quiz: [
        {
          q: 'Si tu cuenta pierde un 50%, ¿cuánto necesitas ganar para volver al punto de partida?',
          options: ['50%', '75%', '100%', '200%'],
          answer: 2,
          explain: 'Con la mitad de la cuenta, necesitas duplicarla: 0.50 ÷ (1 − 0.50) = 1, es decir, un 100%.',
        },
        {
          q: 'Tu cuenta de $10,000 baja a $7,000. ¿Qué ganancia necesitas para recuperarla?',
          options: ['30%', '42.9%', '33.3%', '70%'],
          answer: 1,
          explain: 'Necesitas ganar $3,000 partiendo de $7,000: 3,000 ÷ 7,000 ≈ 42.9%.',
        },
        {
          q: 'Tu cuenta llegó a $12,000 y después bajó a $10,800. ¿Cuál fue el drawdown?',
          options: ['10%', '12%', '8%'],
          answer: 0,
          explain: 'La caída fue de $1,200 desde el máximo de $12,000: 1,200 ÷ 12,000 = 10%.',
        },
        {
          q: '¿Por qué conviene arriesgar poco en cada operación?',
          options: [
            'Porque así se garantiza ganar',
            'Porque el bróker lo exige',
            'Porque reduce el spread',
            'Porque las caídas pequeñas se recuperan con ganancias razonables y las grandes no',
          ],
          answer: 3,
          explain: 'Nada garantiza ganar, pero mantener las caídas pequeñas evita entrar en la zona en la que recuperar exige ganancias enormes.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n2-regla-del-1',
      title: 'Cuánto arriesgar por operación: la regla del 1%',
      summary: 'Aprenderás qué significa arriesgar un porcentaje fijo del balance, por qué un 1% es un buen punto de partida y cómo evitar cambiarlo por impulso.',
      minutes: 8,
      sections: [
        {
          heading: 'Qué significa arriesgar el 1%',
          blocks: [
            {
              type: 'p',
              text: 'El **riesgo por operación** es el dinero que pierdes si se activa tu stop loss. La **regla del 1%** dice que esa cantidad no debe superar el 1% de tu balance.',
            },
            {
              type: 'formula',
              label: 'Riesgo en dólares',
              expr: 'Riesgo en $ = balance × % de riesgo',
            },
            {
              type: 'table',
              headers: ['Balance', 'Riesgo 0.5%', 'Riesgo 1%', 'Riesgo 2%'],
              rows: [
                ['$2,000', '$10', '$20', '$40'],
                ['$5,000', '$25', '$50', '$100'],
                ['$10,000', '$50', '$100', '$200'],
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: 'El 1% no es lo que «inviertes» ni el margen que se bloquea: es **lo que pierdes si se activa el stop**. Con una cuenta de $10,000 puedes abrir una posición de $33,500 y arriesgar solo $100, si el tamaño y el stop están bien calculados.',
            },
          ],
        },
        {
          heading: 'Por qué un porcentaje pequeño',
          blocks: [
            {
              type: 'p',
              text: 'Las rachas de pérdidas son inevitables, incluso con un buen método. Arriesgar poco en cada operación te permite atravesarlas sin que la cuenta quede tocada.',
            },
            {
              type: 'table',
              headers: ['Pérdidas seguidas', 'Arriesgando 1%', 'Arriesgando 5%', 'Arriesgando 10%'],
              rows: [
                ['5', '$9,509.90', '$7,737.81', '$5,904.90'],
                ['10', '$9,043.82', '$5,987.37', '$3,486.78'],
              ],
            },
            {
              type: 'p',
              text: 'La tabla parte de $10,000 y calcula cada pérdida sobre el saldo que queda en ese momento. Con un 1%, diez pérdidas seguidas te dejan una cuenta casi intacta. Con un 10%, te dejan con apenas un tercio.',
            },
          ],
        },
        {
          heading: 'El riesgo se adapta a tu balance',
          blocks: [
            {
              type: 'p',
              text: 'Como el riesgo es un porcentaje, la cantidad en dólares cambia con tu balance. Cuando la cuenta baja, arriesgas menos dinero, lo que frena las caídas. Cuando sube, arriesgas algo más, lo que te permite crecer.',
            },
            {
              type: 'example',
              title: 'Un riesgo que se ajusta solo',
              rows: [
                ['Balance de $10,000', 'Riesgo del 1% = $100'],
                ['Tras varias pérdidas, $9,500', 'Riesgo del 1% = $95'],
                ['Tras varias ganancias, $11,000', 'Riesgo del 1% = $110'],
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: 'Puedes recalcular el riesgo antes de cada operación o, para simplificar, una vez al empezar la semana. Lo importante es que la regla no dependa de cómo te sientes.',
            },
          ],
        },
        {
          heading: '¿0.5%, 1% o 2%?',
          blocks: [
            {
              type: 'p',
              text: 'El 1% es un punto de partida razonable, no una ley. Estas son algunas referencias:',
            },
            {
              type: 'list',
              items: [
                '**0.5% o menos**: si empiezas con dinero real, si estás en una mala racha o si pruebas algo nuevo.',
                '**1%**: una referencia equilibrada para aprender y para operar con constancia.',
                '**2%**: un techo. Por encima, las rachas perdedoras normales empiezan a hacer mucho daño.',
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              title: 'El verdadero peligro',
              text: 'Lo peligroso no es elegir 1% o 2%: es **cambiarlo según las emociones**. Subir el riesgo después de ganar por euforia, o después de perder para «recuperar», es la forma más rápida de romper todo lo que has construido.',
            },
          ],
        },
        {
          heading: 'Cómo lo ves en el simulador',
          blocks: [
            {
              type: 'p',
              text: 'El panel de órdenes te muestra el **riesgo en $ y en %** antes de abrir. Úsalo como control final: si el porcentaje supera tu regla, algo falla en el tamaño o en el stop.',
            },
            {
              type: 'example',
              title: 'Detectar un riesgo excesivo',
              rows: [
                ['Balance', '$10,000'],
                ['Tamaño elegido', '0.50 lotes'],
                ['Distancia al stop', '$7'],
                ['Riesgo', '7 × 0.50 × 100 = $350'],
                ['En porcentaje', '350 ÷ 10,000 = 3.5%'],
                ['Diagnóstico', 'Más del triple de lo que permite la regla del 1%'],
              ],
              note: 'En la próxima lección aprenderás a calcular el tamaño exacto para que esto no ocurra.',
            },
          ],
        },
      ],
      keyPoints: [
        'El riesgo por operación es lo que pierdes si se activa el stop loss.',
        'Regla del 1%: no arriesgar más del 1% del balance en una operación ($100 con $10,000).',
        'Un porcentaje pequeño te permite atravesar rachas perdedoras normales sin daños graves.',
        'El riesgo en $ se ajusta al balance, pero el porcentaje no se cambia por emociones.',
      ],
      quiz: [
        {
          q: 'Tu balance es de $8,000 y arriesgas el 1%. ¿Cuánto puedes perder como máximo en una operación?',
          options: ['$8', '$80', '$800'],
          answer: 1,
          explain: '$8,000 × 0.01 = $80.',
        },
        {
          q: '¿Qué representa ese 1%?',
          options: [
            'La cantidad que pierdes si se activa el stop loss',
            'El margen que bloquea el bróker',
            'El tamaño de la posición en lotes',
          ],
          answer: 0,
          explain: 'El riesgo es la pérdida si se alcanza el stop, no el margen ni el tamaño de la posición.',
        },
        {
          q: 'Empiezas con $10,000 y tienes 10 pérdidas seguidas arriesgando el 1% cada vez. ¿Cuánto queda aproximadamente?',
          options: ['Unos $5,987', '$0', 'Unos $3,487', 'Unos $9,044'],
          answer: 3,
          explain: '$10,000 × 0.99^10 ≈ $9,043.82. La cuenta apenas se resiente.',
        },
        {
          q: 'Acabas de tener dos pérdidas seguidas. ¿Qué es lo correcto?',
          options: [
            'Subir al 3% para recuperar antes',
            'Quitar el stop para no cerrar más en pérdida',
            'Mantener o incluso reducir el porcentaje de riesgo',
            'Doblar el tamaño en la siguiente operación',
          ],
          answer: 2,
          explain: 'Las rachas son normales. Subir el riesgo para recuperar multiplica el daño si la racha continúa.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n2-tamano-posicion',
      title: 'Calcular el tamaño de posición paso a paso',
      summary: 'Aprenderás a calcular cuántos lotes abrir a partir de tu riesgo y de la distancia al stop, para perder exactamente lo planeado si la operación sale mal.',
      minutes: 10,
      sections: [
        {
          heading: 'El orden correcto: primero el stop, después el tamaño',
          blocks: [
            {
              type: 'p',
              text: 'Un error muy habitual es elegir los lotes «a ojo» y luego colocar el stop donde salga para que el riesgo cuadre. El proceso correcto es el contrario:',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                'Decides dónde va el stop según el gráfico: el punto en el que tu idea deja de ser válida.',
                'Mides la distancia entre la entrada y el stop, en dólares de precio.',
                'Calculas el tamaño para que, si se activa el stop, pierdas exactamente tu riesgo.',
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: 'El **stop** lo decide el mercado (dónde se invalida tu idea). El **tamaño** lo decide tu riesgo. Nunca al revés.',
            },
          ],
        },
        {
          heading: 'La fórmula',
          blocks: [
            {
              type: 'formula',
              label: 'Tamaño de posición',
              expr: 'Lotes = riesgo en $ ÷ (distancia al stop en $ × 100)',
              note: 'El 100 son las onzas que hay en un lote. La distancia al stop se mide en dólares de precio.',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                'Riesgo en $ = balance × % de riesgo.',
                'Distancia al stop = diferencia entre el precio de entrada y el del stop.',
                'Lotes = riesgo ÷ (distancia × 100).',
                'Redondea **hacia abajo** al múltiplo de 0.01 más cercano.',
              ],
            },
          ],
        },
        {
          heading: 'Ejemplos resueltos',
          blocks: [
            {
              type: 'example',
              title: 'Compra con el stop a $5',
              rows: [
                ['Balance', '$10,000'],
                ['Riesgo del 1%', '$100'],
                ['Entrada', '3350.00'],
                ['Stop loss', '3345.00'],
                ['Distancia', '$5'],
                ['Lotes', '100 ÷ (5 × 100) = 0.20'],
                ['Comprobación', '5 × 0.20 × 100 = $100 ✓'],
              ],
            },
            {
              type: 'example',
              title: 'Venta con el stop a $8',
              rows: [
                ['Balance', '$10,000'],
                ['Riesgo del 1%', '$100'],
                ['Entrada (venta)', '3312.00'],
                ['Stop loss', '3320.00'],
                ['Distancia', '$8'],
                ['Lotes', '100 ÷ (8 × 100) = 0.125 → 0.12'],
                ['Riesgo real', '8 × 0.12 × 100 = $96 (0.96%)'],
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              title: 'Redondea siempre hacia abajo',
              text: 'Si el cálculo da 0.125, usa 0.12 y no 0.13. Con 0.13 lotes perderías 8 × 0.13 × 100 = $104 y superarías tu 1%.',
            },
          ],
        },
        {
          heading: 'Stop más lejos, posición más pequeña',
          blocks: [
            {
              type: 'table',
              headers: ['Distancia al stop', 'Lotes (riesgo de $100)', 'Pérdida si se activa el stop'],
              rows: [
                ['$2', '0.50', '$100'],
                ['$4', '0.25', '$100'],
                ['$5', '0.20', '$100'],
                ['$10', '0.10', '$100'],
                ['$20', '0.05', '$100'],
              ],
            },
            {
              type: 'p',
              text: 'El riesgo es el mismo en todas las filas; lo que cambia es el tamaño. Por eso no necesitas poner stops muy ajustados «para arriesgar menos»: coloca el stop donde tenga sentido y deja que el tamaño se adapte.',
            },
            {
              type: 'example',
              title: 'Cuenta pequeña: cuando el tamaño mínimo no cabe',
              rows: [
                ['Balance', '$1,000'],
                ['Riesgo del 1%', '$10'],
                ['Stop a $5', '10 ÷ (5 × 100) = 0.02 lotes ✓'],
                ['Stop a $15', '10 ÷ (15 × 100) = 0.0066… → menos que el mínimo de 0.01'],
                ['Con 0.01 lotes y stop a $15', 'Arriesgarías $15 (1.5%)'],
              ],
              note: 'Si el tamaño mínimo supera tu riesgo, lo correcto es no abrir esa operación o buscar otra cuyo stop lógico esté más cerca. No muevas el stop a un sitio sin sentido solo para que cuadre.',
            },
          ],
        },
        {
          heading: 'El spread y la comprobación final',
          blocks: [
            {
              type: 'p',
              text: 'Mide la distancia desde tu **precio de entrada real**. En una compra entras al ask, que está 0.30 por encima del bid. Si mides desde el precio que ves en el gráfico y la distancia es corta, ese 0.30 puede hacer que arriesgues algo más de lo previsto.',
            },
            {
              type: 'example',
              title: 'El spread en un stop corto',
              rows: [
                ['Distancia medida en el gráfico', '$2.00'],
                ['Distancia real sumando el spread', '$2.30'],
                ['Con 0.50 lotes', '2.30 × 0.50 × 100 = $115 (más de tu 1%)'],
                ['Recalculando', '100 ÷ (2.30 × 100) = 0.434… → 0.43 lotes'],
                ['Riesgo con 0.43 lotes', '2.30 × 0.43 × 100 = $98.90 ✓'],
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: 'El panel de órdenes del simulador calcula el riesgo en $ y en % por ti. Haz siempre tu cálculo a mano y compruébalo en el panel: si no coinciden, revisa la distancia que has medido.',
            },
          ],
        },
      ],
      keyPoints: [
        'Primero decides dónde va el stop; después calculas el tamaño.',
        'Lotes = riesgo en $ ÷ (distancia al stop en $ × 100).',
        'Redondea siempre hacia abajo para no superar tu riesgo.',
        'Con el stop más lejos abres menos lotes, pero el riesgo en $ no cambia.',
      ],
      quiz: [
        {
          q: 'Balance de $10,000, riesgo del 1% y stop a $4. ¿Cuántos lotes abres?',
          options: ['0.04', '0.40', '0.25', '2.50'],
          answer: 2,
          explain: 'Riesgo = $100. Lotes = 100 ÷ (4 × 100) = 0.25.',
        },
        {
          q: 'Balance de $5,000, riesgo del 1% y stop a $10. ¿Cuántos lotes abres?',
          options: ['0.05', '0.50', '0.10', '0.01'],
          answer: 0,
          explain: 'Riesgo = $50. Lotes = 50 ÷ (10 × 100) = 0.05.',
        },
        {
          q: 'Tu cálculo da 0.137 lotes. ¿Qué tamaño usas?',
          options: ['0.14', '0.13', '0.15'],
          answer: 1,
          explain: 'Se redondea siempre hacia abajo para no superar el riesgo planeado: 0.13.',
        },
        {
          q: 'Para respetar tu riesgo necesitarías menos de 0.01 lotes. ¿Qué haces?',
          options: [
            'Abrir 0.01 igualmente sin pensarlo',
            'Quitar el stop loss',
            'Alejar el take profit',
            'No abrir esa operación o buscar otra cuyo stop lógico esté más cerca',
          ],
          answer: 3,
          explain: 'Si el tamaño mínimo supera tu riesgo, la operación no encaja en tu plan. Forzarla rompe tu regla.',
        },
      ],
      practice: {
        goal: 'Calcula el tamaño de posición a partir de tu stop para arriesgar como máximo el 1% del balance, y comprueba el cálculo en el panel de órdenes.',
        steps: [
          'Abre el simulador en H1 y decide la dirección de la operación.',
          'Coloca el stop loss donde tu idea dejaría de ser válida (por ejemplo, al otro lado del último mínimo o máximo) y mide la distancia en dólares.',
          'Calcula a mano: riesgo en $ = balance × 1%; lotes = riesgo ÷ (distancia × 100). Redondea hacia abajo a 0.01.',
          'Introduce ese tamaño en el panel de órdenes y comprueba que el riesgo mostrado no supera el 1%.',
          'Coloca el take profit en un nivel con sentido y revisa la relación R:R.',
          'Escribe el cálculo en las notas, por ejemplo: «Stop a $6, riesgo $100 → 100 ÷ 600 = 0.166… → 0.16 lotes».',
          'Pulsa Comprar o Vender y revisa el resultado en el Diario.',
        ],
        rules: { maxRiskPct: 1, requireNotes: true },
      },
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n2-riesgo-beneficio',
      title: 'Relación riesgo/beneficio y tasa de acierto',
      summary: 'Entenderás cómo se combinan la relación riesgo/beneficio y el porcentaje de acierto, y qué tasa de acierto necesitas para no perder con cada R:R.',
      minutes: 9,
      sections: [
        {
          heading: 'Qué es la relación riesgo/beneficio',
          blocks: [
            {
              type: 'p',
              text: 'La **relación riesgo/beneficio** (R:R) compara la distancia a tu stop loss (lo que arriesgas) con la distancia a tu take profit (lo que buscas ganar). Un R:R de **1:2** significa que arriesgas 1 para intentar ganar 2.',
            },
            {
              type: 'formula',
              label: 'Relación riesgo/beneficio',
              expr: 'R:R = distancia al take profit ÷ distancia al stop loss',
              note: 'Se expresa como 1:resultado. Por ejemplo, 10 ÷ 5 = 2 → 1:2.',
            },
            {
              type: 'figure',
              name: 'risk-reward',
              caption: 'Con el stop a una distancia y el objetivo al doble, la relación es 1:2.',
            },
            {
              type: 'example',
              title: 'Calcular el R:R de una compra',
              rows: [
                ['Compra en', '3350.00'],
                ['Stop loss', '3346.00 (riesgo de $4)'],
                ['Take profit', '3362.00 (objetivo de $12)'],
                ['R:R', '12 ÷ 4 = 3 → 1:3'],
              ],
            },
          ],
        },
        {
          heading: 'Pensar en «R»',
          blocks: [
            {
              type: 'p',
              text: 'Una forma muy práctica de medir resultados es en **R**, donde **1R es lo que arriesgas** en una operación. Así comparas operaciones aunque cambie el tamaño de tu cuenta.',
            },
            {
              type: 'example',
              title: 'Resultados medidos en R (riesgo de $100)',
              rows: [
                ['1R', '$100'],
                ['Ganadora que llega al objetivo 1:2', '+2R = +$200'],
                ['Perdedora que toca el stop', '−1R = −$100'],
                ['Ganadora cerrada antes de tiempo, con medio R a favor', '+0.5R = +$50'],
              ],
            },
          ],
        },
        {
          heading: 'La tasa de acierto no basta',
          blocks: [
            {
              type: 'p',
              text: 'La **tasa de acierto** (o porcentaje de acierto) es el porcentaje de operaciones que terminan en ganancia. Es un dato importante, pero por sí solo no dice si ganas dinero.',
            },
            {
              type: 'example',
              title: 'Acertar 7 de cada 10 y aun así perder',
              rows: [
                ['Tasa de acierto', '70%'],
                ['Ganancia media', '$50'],
                ['Pérdida media', '$150'],
                ['En 10 operaciones', '7 ganadoras y 3 perdedoras'],
                ['Ganado', '7 × $50 = $350'],
                ['Perdido', '3 × $150 = $450'],
                ['Resultado', '350 − 450 = −$100'],
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: 'Lo que decide si ganas no es cuántas veces aciertas, sino la **combinación** de tasa de acierto y R:R.',
            },
          ],
        },
        {
          heading: 'La tasa de acierto de equilibrio',
          blocks: [
            {
              type: 'p',
              text: 'Para cada R:R existe una tasa de acierto mínima con la que, a largo plazo, ni ganas ni pierdes. La llamamos **tasa de acierto de equilibrio**.',
            },
            {
              type: 'formula',
              label: 'Tasa de acierto de equilibrio',
              expr: 'Acierto mínimo = 1 ÷ (1 + R)',
              note: 'R es el segundo número del R:R. Con 1:2, R = 2 → 1 ÷ 3 = 33.3%.',
            },
            {
              type: 'table',
              headers: ['R:R', 'Tasa de acierto de equilibrio', 'Dicho de otra forma'],
              rows: [
                ['1:1', '50%', 'Acertar 1 de cada 2'],
                ['1:1.5', '40%', 'Acertar 2 de cada 5'],
                ['1:2', '33.3%', 'Acertar 1 de cada 3'],
                ['1:3', '25%', 'Acertar 1 de cada 4'],
              ],
            },
            {
              type: 'example',
              title: 'Comprobar el equilibrio con 1:2',
              rows: [
                ['Operaciones', '3, con riesgo de $100 y objetivo de $200'],
                ['1 ganadora', '+$200'],
                ['2 perdedoras', '2 × −$100 = −$200'],
                ['Resultado', '$0: equilibrio exacto con un 33.3% de acierto'],
              ],
              note: 'Estos cálculos no incluyen el spread. En la práctica necesitas acertar algo más que el equilibrio para ganar.',
            },
          ],
        },
        {
          heading: 'Ni demasiado bajo ni demasiado alto',
          blocks: [
            {
              type: 'p',
              text: 'Un R:R alto no sale gratis: cuanto más lejos está el objetivo, **menos veces lo alcanza el precio**. Un 1:5 suena muy bien en la calculadora, pero si el gráfico no da motivos para esperar ese recorrido, tu tasa de acierto caerá.',
            },
            {
              type: 'callout',
              tone: 'warning',
              text: 'No alejes el take profit sin motivo solo para mejorar el R:R sobre el papel. El objetivo debe tener sentido en el gráfico, por ejemplo antes de un máximo o un mínimo anterior.',
            },
            {
              type: 'callout',
              tone: 'tip',
              text: 'El panel del simulador te muestra el R:R antes de abrir, y el **Diario** te enseña tu R:R medio y tu porcentaje de acierto reales. Compáralos con la tabla de equilibrio para ver dónde estás.',
            },
          ],
        },
      ],
      keyPoints: [
        'R:R = distancia al take profit ÷ distancia al stop loss.',
        'La tasa de acierto por sí sola no dice si ganas: hay que combinarla con el R:R.',
        'Acierto de equilibrio = 1 ÷ (1 + R): 50% con 1:1, 33.3% con 1:2 y 25% con 1:3.',
        'El objetivo debe tener sentido en el gráfico, no solo en la calculadora.',
      ],
      quiz: [
        {
          q: 'Tu stop está a $6 de la entrada y tu take profit a $12. ¿Cuál es el R:R?',
          options: ['1:2', '1:6', '1:0.5', '1:12'],
          answer: 0,
          explain: 'R:R = 12 ÷ 6 = 2 → 1:2.',
        },
        {
          q: 'Con un R:R de 1:3, ¿qué tasa de acierto mínima necesitas para no perder (sin contar costes)?',
          options: ['33.3%', '50%', '25%', '75%'],
          answer: 2,
          explain: '1 ÷ (1 + 3) = 0.25, es decir, un 25%.',
        },
        {
          q: 'Aciertas el 60% de las veces con una ganancia media de $40 y una pérdida media de $100. ¿Qué pasa en 10 operaciones?',
          options: ['Ganas $240', 'Pierdes $160', 'Ganas $160', 'Quedas en $0'],
          answer: 1,
          explain: '6 × $40 = $240 ganados y 4 × $100 = $400 perdidos: 240 − 400 = −$160.',
        },
        {
          q: '¿Por qué no siempre conviene buscar un R:R de 1:5?',
          options: [
            'Porque los brókers lo prohíben',
            'Porque aumenta el margen necesario',
            'Porque reduce el spread',
            'Porque un objetivo muy lejano se alcanza menos veces y puede no tener sentido en el gráfico',
          ],
          answer: 3,
          explain: 'Cuanto más lejos está el objetivo, menor suele ser la tasa de acierto. El R:R y el acierto van de la mano.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n2-esperanza',
      title: 'Esperanza matemática: el número que decide si ganas',
      summary: 'Aprenderás a calcular la esperanza matemática de tu forma de operar y a interpretarla con prudencia.',
      minutes: 9,
      sections: [
        {
          heading: 'Qué es la esperanza matemática',
          blocks: [
            {
              type: 'p',
              text: 'La **esperanza matemática** (o expectativa) es lo que ganas o pierdes **de media por operación** si repites tu forma de operar muchas veces. Si es positiva, a largo plazo tu método tiende a ganar. Si es negativa, a largo plazo tiende a perder, por muchas rachas buenas que tengas por el camino.',
            },
            {
              type: 'formula',
              label: 'Esperanza por operación',
              expr: 'Esperanza = (% acierto × ganancia media) − (% fallo × pérdida media)',
              note: '% fallo = 100% − % acierto. Usa los porcentajes en decimal: 40% = 0.40.',
            },
          ],
        },
        {
          heading: 'Ejemplo 1: pocas ganadoras, pero grandes',
          blocks: [
            {
              type: 'example',
              title: '40% de acierto con R:R 1:2',
              rows: [
                ['% acierto', '40% → 0.40'],
                ['% fallo', '60% → 0.60'],
                ['Ganancia media', '$200'],
                ['Pérdida media', '$100'],
                ['Parte ganadora', '0.40 × 200 = $80'],
                ['Parte perdedora', '0.60 × 100 = $60'],
                ['Esperanza', '80 − 60 = +$20 por operación'],
              ],
              note: 'En 100 operaciones parecidas, el resultado esperado rondaría +$2,000, aunque el resultado real se desviará de esa cifra.',
            },
            {
              type: 'p',
              text: 'Fíjate: este método **pierde 6 de cada 10 operaciones** y aun así tiene una esperanza positiva. Perder a menudo no significa tener un mal método.',
            },
          ],
        },
        {
          heading: 'Ejemplo 2: muchas ganadoras, pero pequeñas',
          blocks: [
            {
              type: 'example',
              title: '75% de acierto con ganancias pequeñas',
              rows: [
                ['% acierto', '75% → 0.75'],
                ['% fallo', '25% → 0.25'],
                ['Ganancia media', '$40'],
                ['Pérdida media', '$150'],
                ['Parte ganadora', '0.75 × 40 = $30'],
                ['Parte perdedora', '0.25 × 150 = $37.50'],
                ['Esperanza', '30 − 37.50 = −$7.50 por operación'],
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              text: 'Ganar 3 de cada 4 operaciones puede sentirse genial y, aun así, vaciar la cuenta poco a poco. Es lo que suele ocurrir cuando se cierran rápido las ganadoras y se deja correr a las perdedoras.',
            },
          ],
        },
        {
          heading: 'La esperanza medida en R',
          blocks: [
            {
              type: 'p',
              text: 'Si mides en R (recuerda: 1R = lo que arriesgas) y cada pérdida es de 1R porque respetas tu stop, la fórmula se simplifica:',
            },
            {
              type: 'formula',
              label: 'Esperanza en R',
              expr: 'Esperanza (R) = (% acierto × R ganador medio) − (% fallo × 1)',
            },
            {
              type: 'table',
              headers: ['% acierto', 'R:R', 'Cálculo', 'Esperanza por operación'],
              rows: [
                ['50%', '1:1', '0.50 × 1 − 0.50 × 1', '0R'],
                ['55%', '1:1', '0.55 × 1 − 0.45 × 1', '+0.10R'],
                ['30%', '1:2', '0.30 × 2 − 0.70 × 1', '−0.10R'],
                ['40%', '1:2', '0.40 × 2 − 0.60 × 1', '+0.20R'],
                ['35%', '1:3', '0.35 × 3 − 0.65 × 1', '+0.40R'],
              ],
            },
            {
              type: 'example',
              title: 'De R a dólares',
              rows: [
                ['Esperanza', '+0.20R por operación'],
                ['Riesgo por operación', '$100 (1R)'],
                ['Media por operación', '0.20 × $100 = +$20'],
                ['En 50 operaciones', '50 × $20 ≈ +$1,000 esperados'],
              ],
              note: 'Ninguno de estos cálculos incluye el spread, que reduce un poco la esperanza real.',
            },
          ],
        },
        {
          heading: 'Cómo estimar tu esperanza (y sus límites)',
          blocks: [
            {
              type: 'p',
              text: 'Para calcular tu esperanza necesitas datos reales de tus operaciones. Con 5 o 10 operaciones, el resultado depende muchísimo del azar. Como orientación, espera a tener **al menos 30 o 50 operaciones con el mismo método** antes de sacar conclusiones, y aun así tómalas con prudencia.',
            },
            {
              type: 'list',
              items: [
                'Usa el **Diario** del simulador: ahí tienes el porcentaje de acierto, el P&L y el R:R medio.',
                'Registra siempre el mismo tipo de operación; si mezclas métodos, la cifra no significa nada.',
                'Una esperanza positiva en el pasado **no garantiza** resultados futuros: los mercados cambian.',
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: 'La esperanza es el motor y la gestión del riesgo es el freno: necesitas los dos. Con una esperanza positiva pero un riesgo excesivo, una mala racha puede sacarte del juego antes de que la media tenga tiempo de actuar.',
            },
          ],
        },
      ],
      keyPoints: [
        'Esperanza = (% acierto × ganancia media) − (% fallo × pérdida media).',
        'Un 40% de acierto con 1:2 da una esperanza positiva (+0.20R); un 75% con ganancias pequeñas puede darla negativa.',
        'Se necesitan muchas operaciones registradas para estimarla con algo de fiabilidad.',
        'Una esperanza positiva no garantiza nada: sin gestión del riesgo, una mala racha puede arruinarla.',
      ],
      quiz: [
        {
          q: 'Aciertas el 50% de las veces, con una ganancia media de $150 y una pérdida media de $100. ¿Cuál es tu esperanza por operación?',
          options: ['+$25', '+$50', '−$25', '$0'],
          answer: 0,
          explain: '(0.50 × 150) − (0.50 × 100) = 75 − 50 = +$25.',
        },
        {
          q: '¿Qué indica una esperanza negativa?',
          options: [
            'Que la próxima operación será perdedora',
            'Que, repitiendo ese método muchas veces, lo esperable es perder dinero',
            'Que el spread es demasiado alto',
          ],
          answer: 1,
          explain: 'La esperanza habla del promedio a largo plazo, no de la siguiente operación concreta.',
        },
        {
          q: 'Aciertas el 30% de las veces con un R:R de 1:3. ¿Cuál es tu esperanza en R?',
          options: ['−0.10R', '+0.90R', '+0.20R', '0R'],
          answer: 2,
          explain: '(0.30 × 3) − (0.70 × 1) = 0.90 − 0.70 = +0.20R.',
        },
        {
          q: 'Tras 8 operaciones tu esperanza parece muy positiva. ¿Qué conclusión es la más prudente?',
          options: [
            'Ya tienes un método ganador demostrado',
            'Es el momento de subir el riesgo al 5%',
            'Ya puedes dejar de usar stop loss',
            'Con tan pocas operaciones el azar pesa mucho: sigue registrando datos',
          ],
          answer: 3,
          explain: 'Unas pocas operaciones pueden salir bien o mal por pura suerte. Necesitas muchas más para que la cifra sea fiable.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n2-limites',
      title: 'Límites diarios, semanales y rachas perdedoras',
      summary: 'Entenderás por qué las rachas de pérdidas son normales y aprenderás a ponerte límites que eviten que un mal día se convierta en un desastre.',
      minutes: 9,
      sections: [
        {
          heading: 'Las rachas perdedoras son normales',
          blocks: [
            {
              type: 'p',
              text: 'Incluso un método con esperanza positiva tendrá rachas de varias pérdidas seguidas. No es mala suerte personal ni una señal automática de que el método ha dejado de funcionar: es pura estadística.',
            },
            {
              type: 'example',
              title: 'Un método con un 40% de acierto',
              rows: [
                ['Probabilidad de perder una operación', '60%'],
                ['Perder 2 seguidas', '0.60 × 0.60 = 36%'],
                ['Perder 3 seguidas', '0.60 × 0.60 × 0.60 = 21.6%'],
                ['Perder 5 seguidas en un tramo concreto de 5 operaciones', '0.60⁵ ≈ 7.8%'],
                ['Ver al menos una racha de 5 o más en 100 operaciones', 'Muy probable: alrededor del 97%'],
                ['Ver al menos una racha de 8 o más en 100 operaciones', 'Aproximadamente la mitad de las veces'],
              ],
              note: 'Cálculos suponiendo que cada operación es independiente de las demás.',
            },
            {
              type: 'callout',
              tone: 'key',
              text: 'Si aceptas de antemano que las rachas van a llegar, no te pillarán por sorpresa ni te empujarán a tomar decisiones impulsivas.',
            },
          ],
        },
        {
          heading: 'Cuánto cuesta una racha según tu riesgo',
          blocks: [
            {
              type: 'table',
              headers: ['Pérdidas seguidas', 'Caída arriesgando 1%', 'Caída arriesgando 2%', 'Caída arriesgando 5%'],
              rows: [
                ['5', '4.9%', '9.6%', '22.6%'],
                ['8', '7.7%', '14.9%', '33.7%'],
                ['10', '9.6%', '18.3%', '40.1%'],
              ],
            },
            {
              type: 'p',
              text: 'Cada pérdida se calcula sobre el saldo restante. Con un 1% de riesgo, incluso una racha de 10 pérdidas es una caída que se recupera con una ganancia del 10.6%. Con un 5%, la misma racha deja una caída del 40.1%, que exige ganar un 67% para volver al punto de partida.',
            },
          ],
        },
        {
          heading: 'Límites de pérdida diarios y semanales',
          blocks: [
            {
              type: 'p',
              text: 'Un **límite de pérdida diaria** es la cantidad máxima que aceptas perder en un día. Cuando la alcanzas, dejas de operar hasta el día siguiente, pase lo que pase. El **límite semanal** funciona igual, pero para toda la semana.',
            },
            {
              type: 'example',
              title: 'Límites de ejemplo para una cuenta de $10,000',
              rows: [
                ['Riesgo por operación', '1% = $100'],
                ['Límite diario', '3% = $300 (tres pérdidas completas)'],
                ['Límite semanal', '6% = $600'],
                ['Si llegas a un límite', 'Cierras la plataforma y revisas tu diario'],
              ],
              note: 'Son valores de ejemplo. Lo importante es fijarlos antes de empezar y cumplirlos siempre.',
            },
            {
              type: 'callout',
              tone: 'tip',
              text: 'También puedes limitar el **número de operaciones** por día, por ejemplo a tres. Así evitas operar por aburrimiento o por impulso.',
            },
          ],
        },
        {
          heading: 'El enemigo: operar para recuperar',
          blocks: [
            {
              type: 'p',
              text: 'Después de varias pérdidas aparece la tentación de recuperar rápido: subir el tamaño, entrar sin un motivo claro o mover el stop. A esto se le suele llamar **operar por venganza** («revenge trading»).',
            },
            {
              type: 'example',
              title: 'Subir el riesgo después de perder',
              rows: [
                ['Cuenta inicial', '$10,000'],
                ['3 pérdidas arriesgando el 1%', 'Quedan $9,702.99 (−3%)'],
                ['Subes al 4% «para recuperar» y pierdes 2 más', 'Quedan $8,942.28'],
                ['Caída total', '10.6%'],
                ['Ganancia necesaria para recuperar', '11.8%'],
              ],
              note: 'Las tres primeras pérdidas costaron $297.01; las dos últimas, $760.71: más del doble. El intento de recuperar hizo mucho más daño que la propia racha.',
            },
            {
              type: 'list',
              items: [
                'Señal de alarma: sientes que necesitas operar «ya», sin un motivo claro.',
                'Señal de alarma: subes el tamaño justo después de una pérdida.',
                'Señal de alarma: alejas el stop o dejas de escribir el motivo de tus operaciones.',
              ],
            },
          ],
        },
        {
          heading: 'Un plan para las malas rachas',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                'Escribe tus reglas antes de operar: riesgo por operación, límite diario y límite semanal.',
                'Tras un número de pérdidas seguidas que hayas decidido (por ejemplo, tres), haz una pausa y revisa el Diario.',
                'Si el drawdown llega a un nivel que hayas fijado (por ejemplo, el 10%), reduce el riesgo a la mitad hasta recuperarte.',
                'Clasifica cada pérdida: ¿seguiste el plan o te lo saltaste?',
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: 'Una pérdida que respeta el plan es parte del trabajo. Una pérdida por saltarte el plan es la que de verdad tienes que corregir.',
            },
          ],
        },
      ],
      keyPoints: [
        'Las rachas perdedoras son normales: con un 40% de acierto, una racha de 5 o más pérdidas en 100 operaciones es muy probable.',
        'Con un riesgo pequeño por operación, incluso una racha larga es una caída recuperable.',
        'Fija límites de pérdida diarios y semanales antes de operar y cúmplelos siempre.',
        'No subas el tamaño para recuperar: tras una racha, haz una pausa y revisa.',
      ],
      quiz: [
        {
          q: 'Tu método acierta el 40% de las veces. ¿Qué afirmación es correcta?',
          options: [
            'Es imposible perder 5 operaciones seguidas',
            'Una racha de 5 o más pérdidas en 100 operaciones es muy probable',
            'Después de 3 pérdidas, la siguiente operación será ganadora seguro',
          ],
          answer: 1,
          explain: 'Con un 60% de probabilidad de perder cada operación, las rachas largas aparecen con frecuencia. Además, cada operación es independiente: perder antes no garantiza ganar después.',
        },
        {
          q: 'Alcanzas tu límite de pérdida diaria. ¿Qué haces?',
          options: [
            'Dejar de operar hasta el día siguiente',
            'Duplicar el tamaño para recuperar',
            'Seguir operando, pero sin stop loss',
          ],
          answer: 0,
          explain: 'El límite solo sirve si lo cumples. Parar evita que un mal día se convierta en un desastre.',
        },
        {
          q: 'Si cada operación tiene un 60% de probabilidad de perder, ¿qué probabilidad hay de perder 2 seguidas (operaciones independientes)?',
          options: ['60%', '120%', '36%', '30%'],
          answer: 2,
          explain: '0.60 × 0.60 = 0.36, es decir, un 36%.',
        },
        {
          q: '¿Cuál de estas conductas es una señal de estar operando para recuperar?',
          options: [
            'Escribir el motivo antes de entrar',
            'Respetar el límite diario',
            'Revisar el Diario después de una racha',
            'Subir el tamaño justo después de una pérdida',
          ],
          answer: 3,
          explain: 'Aumentar el tamaño tras perder es la reacción emocional típica, y multiplica el daño si la racha continúa.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n2-practica-riesgo',
      title: 'Práctica: cinco operaciones con riesgo controlado',
      summary: 'Pondrás en práctica todo el nivel con cinco operaciones que cumplan un riesgo máximo del 1%, un R:R mínimo de 1:2 y un motivo escrito.',
      minutes: 8,
      sections: [
        {
          heading: 'El objetivo de esta práctica',
          blocks: [
            {
              type: 'p',
              text: 'Vas a juntar todo lo que has aprendido en este nivel. Harás **cinco operaciones** en el simulador y cada una debe cumplir tres reglas. El objetivo no es ganar las cinco: es **ejecutar las cinco sin saltarte ninguna regla**.',
            },
            {
              type: 'list',
              items: [
                '**Riesgo máximo del 1%** del balance en cada operación.',
                '**R:R mínimo de 1:2**: el take profit, al menos al doble de distancia que el stop.',
                '**Motivo escrito** en cada operación.',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: 'El simulador comprueba estas reglas automáticamente. Si alguna no se cumple, lo verás antes de abrir.',
            },
          ],
        },
        {
          heading: 'Tu checklist antes de cada operación',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                '¿Tengo clara la dirección y el motivo?',
                '¿El stop está en un nivel con sentido, donde mi idea deja de ser válida?',
                '¿He medido la distancia al stop en dólares?',
                '¿He calculado los lotes con la fórmula y redondeado hacia abajo?',
                '¿El take profit está al menos al doble de distancia y tiene sentido en el gráfico?',
                '¿El panel muestra un riesgo de como máximo el 1% y un R:R de al menos 2?',
                '¿He escrito el motivo?',
                '¿Sigo dentro de mi límite de pérdida del día?',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: 'Copia esta lista en tus notas y repásala antes de pulsar. Si alguna respuesta es «no», no abras la operación: esperar también es una decisión.',
            },
          ],
        },
        {
          heading: 'Una operación que cumple y otra que no',
          blocks: [
            {
              type: 'example',
              title: 'Venta que cumple las tres reglas',
              rows: [
                ['Balance', '$10,000'],
                ['Riesgo del 1%', '$100'],
                ['Entrada (venta)', '3328.50'],
                ['Stop loss', '3334.50 (distancia de $6)'],
                ['Lotes', '100 ÷ (6 × 100) = 0.166… → 0.16'],
                ['Riesgo real', '6 × 0.16 × 100 = $96 (0.96%) ✓'],
                ['Take profit', '3316.50 (distancia de $12)'],
                ['R:R', '12 ÷ 6 = 2 → 1:2 ✓'],
                ['Beneficio posible', '12 × 0.16 × 100 = $192'],
              ],
            },
            {
              type: 'example',
              title: 'Compra que no cumple',
              rows: [
                ['Distancia al stop', '$4'],
                ['Distancia al take profit', '$6'],
                ['R:R', '6 ÷ 4 = 1.5 → 1:1.5 ✗'],
                ['Tamaño elegido', '0.30 lotes'],
                ['Riesgo', '4 × 0.30 × 100 = $120 (1.2%) ✗'],
                ['Cómo corregirla', 'Bajar a 100 ÷ (4 × 100) = 0.25 lotes y llevar el TP a $8 o más, solo si el gráfico lo justifica'],
              ],
              note: 'Si el gráfico no da espacio para un objetivo de 1:2, la respuesta correcta es no abrir esa operación.',
            },
          ],
        },
        {
          heading: 'Después de las cinco: analiza el Diario',
          blocks: [
            {
              type: 'table',
              headers: ['Estadística', 'Qué mirar'],
              rows: [
                ['Porcentaje de acierto', 'Con 5 operaciones puede variar mucho por azar; no saques conclusiones'],
                ['P&L', 'Con un riesgo del 1% sobre $10,000, ninguna pérdida debería superar unos $100'],
                ['R:R medio', 'Debería ser de 2 o más si respetaste la regla'],
                ['Riesgo medio', 'Debería ser del 1% o menos'],
                ['Drawdown máximo', 'Incluso con 5 pérdidas seguidas sería pequeño, alrededor del 5%'],
                ['Curva de capital', 'Escalones pequeños, sin caídas bruscas'],
              ],
            },
            {
              type: 'example',
              title: 'Escenarios con 5 operaciones (riesgo de $100 y R:R 1:2)',
              rows: [
                ['0 ganadoras y 5 perdedoras', '5 × −$100 = −$500'],
                ['1 ganadora y 4 perdedoras', '+$200 − $400 = −$200'],
                ['2 ganadoras y 3 perdedoras', '+$400 − $300 = +$100'],
                ['3 ganadoras y 2 perdedoras', '+$600 − $200 = +$400'],
              ],
              note: 'Cifras aproximadas: las operaciones que se cierran al último precio, sin tocar el SL ni el TP, darán resultados intermedios. Fíjate en que ni el peor escenario pone en peligro la cuenta.',
            },
          ],
        },
        {
          heading: 'Reflexiona y repite',
          blocks: [
            {
              type: 'list',
              items: [
                '¿Respeté las tres reglas en las cinco operaciones?',
                '¿Hubo algún momento en el que quise saltármelas? ¿Por qué?',
                '¿Mis motivos eran claros y concretos?',
                '¿Alguna operación se cerró al último precio sin tocar el SL ni el TP? ¿Qué me dice eso de mi objetivo?',
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: 'Si cumpliste las reglas en las cinco operaciones, has superado la práctica, sea cual sea el P&L. La habilidad que se entrena aquí es la constancia.',
            },
            {
              type: 'callout',
              tone: 'warning',
              text: 'Operar con dinero real implica riesgo de perderlo. Esta academia es formación, no asesoramiento financiero: sigue practicando en el simulador hasta que estas reglas te salgan solas.',
            },
          ],
        },
      ],
      keyPoints: [
        'En cada operación: riesgo de como máximo el 1%, R:R de al menos 1:2 y motivo escrito.',
        'Calcula los lotes con la fórmula y redondea siempre hacia abajo.',
        'Con 5 operaciones el resultado depende mucho del azar: evalúa si cumpliste las reglas.',
        'Con un riesgo del 1%, incluso cinco pérdidas seguidas son una caída pequeña.',
      ],
      quiz: [
        {
          q: 'Balance de $10,000, riesgo del 1% y stop a $8. ¿Qué tamaño usas?',
          options: ['0.13', '0.12', '0.80', '1.25'],
          answer: 1,
          explain: '100 ÷ (8 × 100) = 0.125. Redondeando hacia abajo, 0.12 lotes (riesgo real de $96).',
        },
        {
          q: 'Tu stop está a $5. ¿A qué distancia mínima debe estar el take profit para cumplir un R:R de 1:2?',
          options: ['$5', '$2.50', '$7.50', '$10'],
          answer: 3,
          explain: 'Para 1:2 el objetivo debe ser al menos el doble de la distancia al stop: 5 × 2 = $10.',
        },
        {
          q: 'De 5 operaciones, 2 ganan $200 cada una y 3 pierden $100 cada una. ¿Cuál es el P&L?',
          options: ['+$100', '−$100', '+$400', '+$700'],
          answer: 0,
          explain: '2 × $200 − 3 × $100 = $400 − $300 = +$100.',
        },
        {
          q: '¿Cuándo has superado esta práctica?',
          options: [
            'Cuando ganas las cinco operaciones',
            'Cuando el P&L final es positivo',
            'Cuando cumples las tres reglas en las cinco operaciones',
          ],
          answer: 2,
          explain: 'El objetivo es la ejecución disciplinada. Con solo cinco operaciones, el resultado depende demasiado del azar.',
        },
      ],
      practice: {
        goal: 'Completa cinco operaciones en el simulador (repite el ejercicio 5 veces) cumpliendo en todas: riesgo máximo del 1%, R:R de al menos 1:2 y motivo escrito.',
        steps: [
          'Antes de empezar, anota tu límite de pérdida para la sesión (por ejemplo, 3% = $300 con $10,000).',
          'Abre el simulador en H1, decide la dirección y coloca el stop loss en un nivel con sentido.',
          'Mide la distancia al stop en dólares y calcula los lotes: riesgo ÷ (distancia × 100), redondeando hacia abajo.',
          'Coloca el take profit al menos al doble de distancia que el stop, en un nivel que tenga sentido en el gráfico.',
          'Comprueba en el panel que el riesgo es de como máximo el 1%, que el R:R es de al menos 2 y revisa el checklist del setup.',
          'Escribe el motivo en «¿Por qué abres esta operación?», incluyendo tu cálculo del tamaño.',
          'Pulsa Comprar o Vender, lee el resultado y repite hasta completar cinco operaciones.',
          'Al terminar, revisa en el Diario el porcentaje de acierto, el R:R medio, el riesgo medio y el drawdown máximo.',
        ],
        rules: { maxRiskPct: 1, minRR: 2, requireNotes: true },
        count: 5,
      },
    },
  ],
};
