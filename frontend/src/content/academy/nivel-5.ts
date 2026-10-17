import type { Level } from './types';

export const nivel5: Level = {
  id: 'n5',
  number: 5,
  title: 'Estrategia y plan',
  subtitle: 'De ideas sueltas a un sistema',
  description:
    "Al terminar este nivel sabrás definir y ejecutar tres setups con reglas claras, gestionar una operación y escribir tu propio plan de trading. También aprenderás a validar tus setups con backtesting antes de confiar en ellos.",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n5-que-es-un-setup',
      title: 'Qué es un setup y por qué necesitas reglas',
      summary:
        "Aprenderás a convertir una idea de trading en un setup con contexto, gatillo, invalidación y objetivo, y a resumirlo en una checklist.",
      minutes: 8,
      sections: [
        {
          heading: "De «me parece que sube» a una regla",
          blocks: [
            {
              type: 'p',
              text: "Hasta ahora has aprendido piezas sueltas: leer velas, marcar soportes y resistencias, calcular el tamaño de la posición y seguir las noticias que mueven el oro. El problema es que, sin un método que las una, cada operación acaba siendo una decisión nueva tomada en caliente.",
            },
            {
              type: 'p',
              text: "Un **setup** es una situación de mercado concreta y repetible en la que tienes motivos para abrir una operación, descrita con reglas tan claras que dos personas distintas, leyendo esas reglas, tomarían la misma decisión.",
            },
            {
              type: 'callout',
              tone: 'key',
              title: 'Idea clave',
              text: "Un setup no es una predicción. Es un conjunto de condiciones que, cuando se cumplen, te dan **permiso para operar**. Si no se cumplen, no hay operación, por muy tentador que parezca el gráfico.",
            },
          ],
        },
        {
          heading: 'Las cuatro piezas de un setup',
          blocks: [
            {
              type: 'p',
              text: "Todo setup completo responde a cuatro preguntas. Si falta alguna, lo que tienes es una idea, no un setup.",
            },
            {
              type: 'table',
              headers: ['Pieza', 'Pregunta que responde', 'Ejemplo'],
              rows: [
                ['Contexto', '¿En qué tipo de mercado busco esta operación?', 'Tendencia alcista en H4: máximos y mínimos crecientes y precio por encima de la MA50'],
                ['Gatillo', '¿Qué tiene que pasar exactamente para entrar?', 'Una vela envolvente alcista que cierra sobre una zona de soporte en H1'],
                ['Invalidación', '¿Qué demostraría que me he equivocado?', 'Un cierre por debajo de la zona; ahí va el stop loss'],
                ['Objetivo', '¿Dónde y por qué recojo beneficios?', 'El máximo anterior o, como mínimo, 2 veces el riesgo (2R)'],
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              title: 'La unidad R',
              text: "**R** es la unidad de riesgo de una operación: la distancia (o el dinero) entre tu entrada y tu stop. Decir que un objetivo está a **2R** significa que, si se alcanza, ganas el doble de lo que arriesgabas. Usaremos esta unidad en todo el nivel.",
            },
          ],
        },
        {
          heading: 'Por qué necesitas reglas escritas',
          blocks: [
            {
              type: 'p',
              text: "Las reglas no están para quitarte libertad, sino para protegerte de ti mismo en los momentos en los que peor decides: después de una pérdida, tras una racha ganadora o cuando el precio se mueve muy rápido.",
            },
            {
              type: 'list',
              items: [
                'Consistencia: haces lo mismo cada vez que se repite la situación, no lo que te pide tu estado de ánimo.',
                'Medición: solo puedes saber si un setup funciona si lo ejecutas siempre igual. Si cambias el criterio en cada operación, tus estadísticas no significan nada.',
                'Menos dudas: cuando las condiciones se cumplen, actúas; cuando no, esperas. Decidir deja de ser agotador.',
                'Mejora: si algo falla, sabes qué regla revisar en lugar de culpar al mercado.',
              ],
            },
            {
              type: 'p',
              text: "Una buena prueba: si no puedes explicar tu setup por escrito en cinco o seis líneas, todavía no es un setup.",
            },
          ],
        },
        {
          heading: 'De las reglas a una checklist',
          blocks: [
            {
              type: 'p',
              text: "La forma más práctica de aplicar un setup es convertirlo en una **checklist**: una lista corta de comprobaciones de sí o no que repasas antes de pulsar el botón. Si una sola respuesta es «no», no hay operación.",
            },
            {
              type: 'list',
              ordered: true,
              items: [
                '¿El contexto es el que pide el setup (tendencia, rango, ruptura)?',
                '¿Ha aparecido el gatillo exacto, con la vela ya cerrada?',
                '¿Sé dónde se invalida la idea y he colocado ahí el stop loss?',
                '¿El objetivo ofrece al menos el R:R mínimo de mi plan?',
                '¿El riesgo es como máximo el 1% del balance?',
                '¿Hay alguna noticia de alto impacto a punto de publicarse?',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              title: 'En el simulador',
              text: "El panel de órdenes incluye una **checklist del setup** y te muestra el riesgo en dólares y en porcentaje, además del R:R. Úsalos como último filtro antes de pulsar Comprar o Vender, y escribe en el campo «¿Por qué abres esta operación?» qué setup estás operando y dónde se invalida.",
            },
          ],
        },
        {
          heading: 'Un setup completo, con números',
          blocks: [
            {
              type: 'p',
              text: "Veamos cómo queda una operación cuando cada pieza está definida antes de entrar. Cuenta de $10,000 y riesgo del 1%.",
            },
            {
              type: 'figure',
              name: 'risk-reward',
              caption: 'Entrada, stop loss en el punto de invalidación y take profit a 2R: las piezas del setup sobre el gráfico.',
            },
            {
              type: 'example',
              title: 'Compra en zona de soporte dentro de una tendencia alcista',
              rows: [
                ['Contexto', 'H4 alcista, precio por encima de la MA50'],
                ['Zona de soporte', '3296.00 – 3300.00'],
                ['Gatillo', 'Vela envolvente alcista en H1 que cierra en 3304.00'],
                ['Entrada', '3304.00'],
                ['Stop loss (invalidación)', '3294.00, por debajo de la zona → distancia $10'],
                ['Riesgo', '1% de $10,000 = $100'],
                ['Tamaño', '$100 ÷ ($10 × 100) = 0.10 lotes'],
                ['Objetivo', '3324.00 → distancia $20 = 2R'],
                ['Resultado si llega al objetivo', '0.10 × 100 × $20 = +$200'],
              ],
              note: "Todo está decidido antes de entrar. A partir de ahí, tu trabajo consiste en respetar el plan, no en reinterpretarlo.",
            },
          ],
        },
      ],
      keyPoints: [
        'Un setup es una situación repetible definida por contexto, gatillo, invalidación y objetivo.',
        'Sin reglas fijas no puedes medir si un setup funciona.',
        'La invalidación decide dónde va el stop; el objetivo, dónde recoges beneficios.',
        'Convierte cada setup en una checklist de sí o no: un solo «no» anula la operación.',
      ],
      quiz: [
        {
          q: '¿Cuál de estas descripciones es un setup y no solo una idea?',
          options: [
            '«El oro está muy barato, seguro que rebota pronto»',
            '«Compro cuando el precio llega al soporte y parece fuerte»',
            '«En tendencia alcista de H4, compro tras una envolvente alcista en una zona de soporte de H1, con stop bajo la zona y objetivo a 2R»',
            '«Vendo si el RSI está alto»',
          ],
          answer: 2,
          explain:
            'Es la única que define contexto, gatillo, invalidación y objetivo. Las demás dependen de impresiones («barato», «parece fuerte») o les faltan piezas.',
        },
        {
          q: '¿Qué pieza del setup te dice dónde colocar el stop loss?',
          options: ['El contexto', 'La invalidación', 'El gatillo', 'El objetivo'],
          answer: 1,
          explain:
            'La invalidación es el punto en el que la idea deja de tener sentido. El stop va ahí (con un pequeño margen), no a una distancia elegida al azar.',
        },
        {
          q: 'Todas las respuestas de tu checklist son «sí» salvo una: el R:R es 1:1.2 y tu plan exige 1:2. ¿Qué haces?',
          options: [
            'Entro igualmente: el resto se cumple',
            'Entro con la mitad de lotes',
            'Alejo el take profit hasta que el R:R sea 1:2, aunque haya una resistencia antes',
            'No opero: una sola respuesta negativa anula la operación',
          ],
          answer: 3,
          explain:
            'La checklist funciona como un todo. Mover el objetivo más allá de una resistencia solo para que cuadre el R:R es engañarte con los números.',
        },
        {
          q: '¿Por qué es importante ejecutar un setup siempre con las mismas reglas?',
          options: [
            'Porque solo así tus resultados miden el setup y te dicen si funciona',
            'Porque así se gana siempre',
            'Porque el bróker lo exige',
            'Porque las reglas eliminan las pérdidas',
          ],
          answer: 0,
          explain:
            'Ninguna regla elimina las pérdidas. Pero si cambias el criterio cada vez, tus estadísticas mezclan cosas distintas y no te dicen nada útil.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n5-setup-pullback',
      title: 'Setup 1: retroceso a zona en tendencia',
      summary:
        'Aprenderás a entrar en un retroceso dentro de una tendencia con reglas concretas de entrada, stop, objetivo y tamaño.',
      minutes: 11,
      sections: [
        {
          heading: 'La idea: a favor de la tendencia, pero a mejor precio',
          blocks: [
            {
              type: 'p',
              text: "En una tendencia el precio no avanza en línea recta: da un impulso, retrocede una parte y luego, si la tendencia sigue sana, continúa. El **setup de retroceso** busca entrar en esa pausa, a favor de la tendencia y con un stop relativamente corto.",
            },
            {
              type: 'figure',
              name: 'pullback-setup',
              caption: 'Impulso alcista, retroceso a una zona de soporte y continuación. La entrada llega cuando el retroceso muestra señales de terminar.',
            },
            {
              type: 'p',
              text: "Comprar en el retroceso tiene dos ventajas frente a comprar en mitad del impulso: el precio está más cerca del punto de invalidación, así que el stop es más corto, y el camino hasta el máximo anterior deja más recorrido para el objetivo.",
            },
          ],
        },
        {
          heading: 'Paso 1: confirma que hay tendencia',
          blocks: [
            {
              type: 'p',
              text: "El setup solo existe si hay una tendencia clara en el marco temporal superior. Usa **H4 o D1 para el contexto** y **H1 para buscar la entrada**.",
            },
            {
              type: 'list',
              items: [
                'Estructura: en tendencia alcista, máximos y mínimos crecientes; en bajista, máximos y mínimos decrecientes.',
                'Medias móviles: precio por encima de la MA50 y MA20 por encima de la MA50 (al revés en tendencia bajista).',
                'Pendiente: las medias deben estar inclinadas. Si están planas y entrelazadas, no hay tendencia y este setup no aplica.',
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "Si tienes que mirar el gráfico mucho rato para convencerte de que hay tendencia, es que no la hay. En ese caso, el setup de rango de la lección 4 puede encajar mejor.",
            },
          ],
        },
        {
          heading: 'Paso 2: espera a que el precio llegue a una zona',
          blocks: [
            {
              type: 'p',
              text: "No compras cualquier bajada. Esperas a que el retroceso alcance una **zona** donde tenga sentido que aparezcan compradores. Las más habituales son:",
            },
            {
              type: 'list',
              items: [
                'Una antigua resistencia que se ha roto y ahora puede actuar como soporte.',
                'La MA20 o la MA50, sobre todo en tendencias fuertes.',
                'El área entre el 50% y el 61.8% de retroceso de Fibonacci del último impulso.',
              ],
            },
            {
              type: 'figure',
              name: 'fibonacci',
              caption: 'Retroceso de Fibonacci trazado sobre el último impulso: la zona entre el 50% y el 61.8% es la que más nos interesa.',
            },
            {
              type: 'p',
              text: "Cuantas más referencias coincidan en la misma zona, más interesante es. Dibuja la zona con el **rectángulo** y el retroceso con la herramienta **Fibonacci** del simulador.",
            },
            {
              type: 'example',
              title: 'Calcular la zona del 50–61.8%',
              rows: [
                ['Impulso', 'De 3280.00 a 3340.00 → $60'],
                ['Retroceso del 50%', '3340.00 − ($60 × 0.5) = 3310.00'],
                ['Retroceso del 61.8%', '3340.00 − ($60 × 0.618) = 3302.92'],
                ['Zona de compra', '3302.92 – 3310.00'],
              ],
              note: 'Si además había una antigua resistencia en 3305.00, la zona gana peso: dos referencias coinciden.',
            },
          ],
        },
        {
          heading: 'Paso 3: espera la confirmación',
          blocks: [
            {
              type: 'p',
              text: "Que el precio toque la zona no basta: puede atravesarla sin detenerse. Necesitas una **vela de confirmación** en H1 que muestre que los compradores están reaccionando. Por ejemplo:",
            },
            {
              type: 'list',
              items: [
                'Una vela envolvente alcista que cubre por completo el cuerpo de la vela anterior.',
                'Una vela con mecha inferior larga y cierre en la parte alta de su rango (rechazo).',
                'Un cierre de nuevo dentro o por encima de la zona después de haberla perforado con una mecha.',
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: "Espera siempre al **cierre** de la vela. Una vela que a mitad de formación parece un rechazo perfecto puede terminar cerrando muy por debajo de la zona.",
            },
          ],
        },
        {
          heading: 'Paso 4: stop, objetivo y tamaño',
          blocks: [
            {
              type: 'p',
              text: "El **stop** va por debajo de la zona y del mínimo del retroceso, con un pequeño margen para que el ruido normal (y el spread de 0.30 del simulador) no te saque. El **objetivo** es como mínimo 2R: si el máximo anterior queda antes de 2R, no hay recorrido suficiente y no hay operación. Si queda más lejos, puedes fijar el objetivo en 2R o justo antes del máximo anterior.",
            },
            {
              type: 'example',
              title: 'Operación completa (cuenta de $10,000, riesgo 1%)',
              rows: [
                ['Vela de confirmación', 'Mecha hasta 3303.50 y cierre en 3309.00'],
                ['Entrada', '3309.00'],
                ['Stop loss', '3299.00, bajo el 61.8% y el mínimo del retroceso → $10'],
                ['Tamaño', '$100 ÷ ($10 × 100) = 0.10 lotes'],
                ['Objetivo 2R', '3309.00 + $20 = 3329.00'],
                ['Máximo anterior', '3340.00, a $31 (unos 3.1R)'],
                ['Ganancia si llega a 2R', '0.10 × 100 × $20 = +$200'],
              ],
              note: 'El máximo anterior está más lejos que 2R, así que hay espacio. Elige una de las dos reglas de objetivo en tu plan y aplícala siempre igual.',
            },
            {
              type: 'p',
              text: "En tendencia bajista todo se invierte: vendes cuando el precio rebota hacia una zona de resistencia, con el stop por encima de la zona y el objetivo en el mínimo anterior o a 2R.",
            },
          ],
        },
        {
          heading: 'Cuándo no operarlo',
          blocks: [
            {
              type: 'list',
              items: [
                'El retroceso rompe el último mínimo creciente: la estructura alcista ya no es válida.',
                'El retroceso va más allá del 78.6%: se parece más a un cambio de tendencia que a una pausa.',
                'No aparece vela de confirmación: la zona puede fallar.',
                'Hay un dato de alto impacto en los próximos minutos.',
                'El objetivo de 2R queda por encima de una resistencia importante.',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Dejar pasar una operación dudosa no te cuesta dinero. Forzarla, a menudo sí. La paciencia también forma parte del setup.",
            },
          ],
        },
      ],
      keyPoints: [
        'Solo hay setup si la tendencia está clara en H4 o D1.',
        'La entrada se busca en una zona: soporte previo, media móvil o retroceso del 50–61.8%.',
        'Sin vela de confirmación cerrada, no hay entrada.',
        'Stop más allá de la zona y del mínimo del retroceso; objetivo de al menos 2R.',
        'Si el retroceso rompe la estructura, el setup queda invalidado.',
      ],
      quiz: [
        {
          q: 'Según la lección, ¿qué marcos temporales usas para el contexto y para la entrada?',
          options: [
            'M1 para el contexto y M5 para la entrada',
            'H4 o D1 para el contexto y H1 para la entrada',
            'Solo H1 para todo',
            'W1 para el contexto y M1 para la entrada',
          ],
          answer: 1,
          explain:
            'El marco superior (H4 o D1) define la tendencia; H1 te permite afinar la entrada y ver la vela de confirmación.',
        },
        {
          q: 'Un impulso va de 3200.00 a 3260.00. ¿Dónde está el retroceso del 50%?',
          options: ['3220.00', '3237.08', '3230.00', '3245.00'],
          answer: 2,
          explain:
            'El impulso mide $60. El 50% son $30, así que 3260.00 − $30 = 3230.00. El 61.8% estaría en 3260.00 − $37.08 = 3222.92.',
        },
        {
          q: 'El precio toca tu zona y la vela de H1, que todavía no ha cerrado, parece un rechazo. ¿Qué haces?',
          options: [
            'Esperar al cierre de la vela para confirmar',
            'Comprar ya, antes de que se escape',
            'Comprar con el doble de lotes porque la señal es clara',
            'Poner el stop dentro de la zona para mejorar el R:R',
          ],
          answer: 0,
          explain:
            'Hasta que la vela cierra, la confirmación no existe. Muchas velas que parecen un rechazo a mitad de formación terminan cerrando por debajo de la zona.',
        },
        {
          q: 'Entrada en 3309.00, stop en 3299.00, cuenta de $10,000 y riesgo del 1%. ¿Qué tamaño corresponde?',
          options: ['1.00 lote', '0.01 lotes', '0.20 lotes', '0.10 lotes'],
          answer: 3,
          explain: 'Riesgo de $100 y distancia de $10: $100 ÷ ($10 × 100) = 0.10 lotes.',
        },
      ],
      practice: {
        goal: 'Abre en el simulador una operación de retroceso en tendencia que cumpla todas las reglas del setup.',
        steps: [
          'Pon el gráfico en H4, activa la MA20 y la MA50 y decide si hay tendencia alcista, bajista o ninguna. Si no hay tendencia clara, este setup no aplica: no fuerces la operación.',
          'Con la herramienta Fibonacci, mide el último impulso y marca con un rectángulo la zona entre el 50% y el 61.8%, o un soporte o resistencia previos.',
          'Cambia a H1 y comprueba si el precio está en la zona y ha cerrado una vela de confirmación. Si todavía no, no hay operación; puedes practicar la lectura con el modo replay mientras tanto.',
          'En el panel de órdenes, coloca el Stop Loss más allá de la zona y del extremo del retroceso, y el Take Profit a 2R o justo antes del máximo (o mínimo) anterior.',
          'Ajusta los lotes hasta que el panel muestre un riesgo de como máximo el 1% y comprueba que el R:R es de al menos 2.',
          'Repasa la checklist del setup y escribe en «¿Por qué abres esta operación?» el contexto, la zona, la vela de confirmación y dónde se invalida la idea.',
          'Pulsa Comprar o Vender según la tendencia y, al terminar, revisa el resultado en el Diario.',
        ],
        rules: { maxRiskPct: 1, minRR: 2, requireNotes: true },
      },
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n5-setup-ruptura',
      title: 'Setup 2: ruptura y retesteo',
      summary:
        'Aprenderás a operar la ruptura de un nivel clave sin perseguir la vela de ruptura, esperando el retesteo y filtrando las rupturas falsas.',
      minutes: 10,
      sections: [
        {
          heading: 'Cuando un nivel cede',
          blocks: [
            {
              type: 'p',
              text: "Un soporte o una resistencia que el precio ha respetado varias veces es un nivel donde muchos operadores tienen órdenes. Cuando el precio por fin lo atraviesa con fuerza, suele indicar un cambio en el equilibrio entre compradores y vendedores.",
            },
            {
              type: 'p',
              text: "Con frecuencia, tras la ruptura el precio vuelve a visitar el nivel desde el otro lado antes de seguir. Es el **retesteo**: la antigua resistencia actúa ahora como soporte (o el antiguo soporte como resistencia). Ese regreso es el punto de entrada de este setup.",
            },
            {
              type: 'figure',
              name: 'breakout-retest',
              caption: 'Ruptura de una resistencia, regreso del precio al nivel (retesteo) y continuación con la antigua resistencia actuando como soporte.',
            },
          ],
        },
        {
          heading: 'No persigas la vela de ruptura',
          blocks: [
            {
              type: 'p',
              text: "La vela que rompe el nivel suele ser grande y llamativa, y la tentación es entrar en cuanto la ves. El problema es que en ese momento el precio ya está lejos del nivel, que es donde se invalida la idea. El stop lógico queda lejos, el tamaño tiene que ser pequeño y el R:R empeora.",
            },
            {
              type: 'table',
              headers: ['', 'Persiguiendo la ruptura', 'Esperando el retesteo'],
              rows: [
                ['Nivel roto', '3350.00', '3350.00'],
                ['Entrada', '3364.00 (cierre de la vela de ruptura)', '3354.00 (retesteo confirmado)'],
                ['Stop loss', '3344.00 → $20', '3344.00 → $10'],
                ['Tamaño con $100 de riesgo', '0.05 lotes', '0.10 lotes'],
                ['Objetivo (siguiente resistencia)', '3374.00 → $10', '3374.00 → $20'],
                ['R:R', '1:0.5', '1:2'],
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Si el precio rompe y se va sin retestear, no pasa nada: te has perdido una operación, no has perdido dinero. Habrá otras.",
            },
          ],
        },
        {
          heading: 'Las reglas del setup',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                'Nivel claro: un soporte o una resistencia con al menos dos o tres reacciones visibles en H1 o H4. Márcalo con una línea horizontal.',
                'Ruptura con cierre: una vela de H1 cierra con claridad al otro lado del nivel. Una mecha que lo atraviesa y vuelve no cuenta.',
                'Retesteo: el precio vuelve a la zona del nivel. Antes de eso, no entras.',
                'Confirmación: en el retesteo aparece una vela de rechazo que cierra a favor de la ruptura.',
                'Stop: al otro lado del nivel y del extremo del retesteo, con margen.',
                'Objetivo: el siguiente nivel relevante, siempre que esté al menos a 2R. Si está más cerca, no hay operación.',
              ],
            },
            {
              type: 'p',
              text: "Fíjate en que la regla de la ruptura pide un **cierre**, no un simple toque. Es la diferencia entre una ruptura que el mercado acepta y una incursión que rechaza.",
            },
          ],
        },
        {
          heading: 'Rupturas falsas',
          blocks: [
            {
              type: 'p',
              text: "Una **ruptura falsa** ocurre cuando el precio atraviesa el nivel, atrae a quienes entran tarde y enseguida vuelve al lado original, dejándolos atrapados. Es uno de los motivos principales para esperar el retesteo: muchas rupturas falsas se descubren justo ahí.",
            },
            {
              type: 'list',
              items: [
                'La ruptura es solo una mecha, sin cierre al otro lado.',
                'La vela de ruptura es pequeña o el volumen no acompaña.',
                'Ocurre en un momento de poca actividad o justo antes de un dato importante.',
                'En el retesteo, el precio cierra de nuevo en el lado original del nivel.',
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "Si durante el retesteo una vela de H1 cierra con claridad de vuelta al otro lado del nivel, el setup está **invalidado**. No esperes «a ver si vuelve»: para eso está el stop.",
            },
          ],
        },
        {
          heading: 'Ejemplo completo: venta tras romper un soporte',
          blocks: [
            {
              type: 'p',
              text: "El setup funciona igual en las dos direcciones. Aquí, un soporte que se rompe y pasa a actuar como resistencia.",
            },
            {
              type: 'example',
              title: 'Venta en el retesteo (cuenta de $10,000, riesgo 1%)',
              rows: [
                ['Soporte roto', '3280.00, con tres rebotes previos en H1'],
                ['Ruptura', 'Vela de H1 que cierra en 3271.00'],
                ['Retesteo', 'El precio sube hasta 3281.50 y cierra una vela de rechazo en 3276.00'],
                ['Entrada (venta)', '3276.00'],
                ['Stop loss', '3284.00, por encima del nivel y del máximo del retesteo → $8'],
                ['Tamaño', '$100 ÷ ($8 × 100) = 0.125 → 0.12 lotes'],
                ['Riesgo real', '0.12 × 100 × $8 = $96 (0.96%)'],
                ['Objetivo 2R', '3276.00 − $16 = 3260.00'],
                ['Ganancia si llega', '0.12 × 100 × $16 = +$192'],
              ],
              note: 'Cuando el cálculo da más decimales de los que admite la plataforma, redondea siempre hacia abajo: así nunca superas tu riesgo máximo.',
            },
          ],
        },
      ],
      keyPoints: [
        'Un nivel roto con cierre suele cambiar de papel: la resistencia pasa a ser soporte y al revés.',
        'No persigas la vela de ruptura: entra en el retesteo, cerca de la invalidación.',
        'Una mecha no es una ruptura; necesitas un cierre al otro lado.',
        'Si el retesteo cierra de nuevo en el lado original, la ruptura era falsa y el setup se cancela.',
      ],
      quiz: [
        {
          q: '¿Por qué este setup espera el retesteo en lugar de entrar con la vela de ruptura?',
          options: [
            'Porque el retesteo garantiza que la ruptura es buena',
            'Porque la entrada queda cerca de la invalidación, con stop más corto y mejor R:R',
            'Porque así se opera más a menudo',
            'Porque las velas de ruptura nunca continúan',
          ],
          answer: 1,
          explain:
            'Nada garantiza el resultado, pero entrar cerca del nivel permite un stop corto, más lotes con el mismo riesgo y un R:R mucho mejor.',
        },
        {
          q: 'Una vela de H1 atraviesa la resistencia con una mecha, pero cierra por debajo. ¿Qué tienes?',
          options: [
            'Una ruptura sin validar: falta el cierre al otro lado del nivel',
            'Una ruptura confirmada',
            'Una señal para comprar de inmediato',
            'Un retesteo completado',
          ],
          answer: 0,
          explain:
            'Las reglas exigen un cierre al otro lado del nivel. Una mecha que lo atraviesa y vuelve es, como mucho, una incursión rechazada.',
        },
        {
          q: 'Vendes en el retesteo en 3276.00 con el stop en 3284.00 y un riesgo máximo de $100. ¿Cuántos lotes?',
          options: ['0.13 lotes', '1.25 lotes', '0.08 lotes', '0.12 lotes'],
          answer: 3,
          explain:
            '$100 ÷ ($8 × 100) = 0.125. Redondeas hacia abajo a 0.12 lotes para no superar $100; con 0.13 arriesgarías $104.',
        },
        {
          q: 'En una compra, durante el retesteo, una vela de H1 cierra con claridad de nuevo por debajo de la resistencia rota. ¿Qué significa?',
          options: [
            'Que es una oportunidad para comprar más barato',
            'Que hay que alejar el stop para darle espacio',
            'Que la ruptura probablemente era falsa y el setup queda invalidado',
            'Nada: los retesteos siempre se pasan un poco',
          ],
          answer: 2,
          explain:
            'Un cierre de vuelta en el lado original es la señal de ruptura falsa que describe la lección. El setup ya no existe y el stop debe hacer su trabajo.',
        },
      ],
      practice: {
        goal: 'Encuentra una ruptura con retesteo y opérala solo cuando el retesteo esté confirmado.',
        steps: [
          'En H1 o H4, marca con la línea horizontal un soporte o una resistencia con al menos dos reacciones claras.',
          'Comprueba que una vela ha cerrado al otro lado del nivel. Si solo hay mechas, no hay ruptura.',
          'Comprueba que el precio ha vuelto al nivel y ha cerrado una vela de rechazo a favor de la ruptura. Si todavía no ha vuelto, no entres.',
          'Coloca el Stop Loss al otro lado del nivel y del extremo del retesteo, y el Take Profit en el siguiente nivel relevante, siempre a 2R o más.',
          'Ajusta los lotes para que el riesgo que muestra el panel no supere el 1%, redondeando hacia abajo.',
          'En las notas, indica el nivel, la vela de ruptura, la vela de confirmación y qué cierre invalidaría la operación.',
          'Abre la operación y, al terminar, compara en el Diario lo que pasó con lo que habías escrito.',
        ],
        rules: { maxRiskPct: 1, minRR: 2, requireNotes: true },
      },
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n5-setup-rango',
      title: 'Setup 3: rebote en los extremos de un rango',
      summary:
        'Aprenderás a reconocer un rango claro y a operar solo sus extremos, con el stop fuera del rango y un objetivo realista.',
      minutes: 9,
      sections: [
        {
          heading: 'Cuando el mercado va de lado',
          blocks: [
            {
              type: 'p',
              text: "No siempre hay tendencia. A menudo el oro se mueve entre un techo y un suelo, a la espera de un dato o de una sesión con más actividad. A eso lo llamamos **rango** o mercado lateral.",
            },
            {
              type: 'figure',
              name: 'range',
              caption: 'Mercado lateral: el precio rebota varias veces entre un suelo y un techo bien definidos.',
            },
            {
              type: 'p',
              text: "En un rango, los setups de tendencia funcionan mal: compras un «retroceso» y el precio no hace un máximo nuevo, sino que vuelve al suelo. Por eso necesitas un setup pensado para este contexto.",
            },
          ],
        },
        {
          heading: 'Cómo reconocer un rango claro',
          blocks: [
            {
              type: 'list',
              items: [
                'Al menos dos toques en el techo y dos en el suelo, a niveles parecidos.',
                'Medias móviles (MA20 y MA50) casi planas y cruzándose entre sí.',
                'Bandas de Bollinger más bien horizontales, con el precio tocando una banda y después la otra.',
                'Anchura suficiente: el rango debe medir varias veces tu stop; si no, no hay espacio para un R:R razonable.',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Marca el rango con el **rectángulo**, del primer al último toque. Si te cuesta decidir dónde está el techo o el suelo, ese rango no es lo bastante claro para operarlo.",
            },
          ],
        },
        {
          heading: 'Opera los extremos, nunca el centro',
          blocks: [
            {
              type: 'p',
              text: "La regla principal: compras cerca del suelo y vendes cerca del techo, siempre con una **vela de rechazo** cerrada que confirme el rebote. En el centro del rango no tienes ventaja: el stop lógico queda lejos y el objetivo, cerca.",
            },
            {
              type: 'example',
              title: 'Rango entre 3300.00 y 3340.00: extremo frente a centro',
              rows: [
                ['Compra en el suelo', 'Entrada 3304.00, stop 3294.00 ($10), objetivo 3334.00 ($30) → R:R 1:3'],
                ['Compra en el centro', 'Entrada 3320.00, stop 3294.00 ($26), objetivo 3334.00 ($14) → R:R 1:0.54'],
              ],
              note: 'Mismo rango, mismo stop y mismo objetivo: lo único que cambia es dónde entras, y eso convierte una buena operación en una mala.',
            },
            {
              type: 'callout',
              tone: 'warning',
              title: 'Tierra de nadie',
              text: "Si el precio está en la mitad del rango, **no hay setup**. Espera a que llegue a uno de los extremos.",
            },
          ],
        },
        {
          heading: 'Stop fuera, objetivo antes del otro extremo',
          blocks: [
            {
              type: 'p',
              text: "El **stop** va fuera del rango, no justo en el borde: el precio perfora a menudo el extremo con una mecha antes de girarse. Deja un margen razonable más allá del suelo o del techo.",
            },
            {
              type: 'p',
              text: "El **objetivo** se coloca antes del extremo contrario, no exactamente en él, porque allí suelen aparecer los operadores del otro lado. Una alternativa más prudente es la mitad del rango. Para este setup, el mínimo aceptable es un R:R de 1:1.5.",
            },
            {
              type: 'example',
              title: 'Compra en el suelo (cuenta de $10,000, riesgo 1%)',
              rows: [
                ['Rango', '3300.00 – 3340.00 (anchura de $40)'],
                ['Vela de rechazo', 'Mecha hasta 3298.20 y cierre en 3304.00'],
                ['Entrada', '3304.00'],
                ['Stop loss', '3294.00, $6 por debajo del suelo → distancia $10'],
                ['Tamaño', '$100 ÷ ($10 × 100) = 0.10 lotes'],
                ['Objetivo', '3334.00, antes del techo → $30 = 3R → +$300'],
                ['Objetivo prudente', '3320.00, mitad del rango → $16 = 1.6R → +$160'],
              ],
              note: 'Las dos opciones superan el mínimo de 1.5R. Elige una regla en tu plan y aplícala siempre igual.',
            },
          ],
        },
        {
          heading: 'Cuando el rango se rompe',
          blocks: [
            {
              type: 'p',
              text: "Todos los rangos terminan. Si una vela de H1 cierra con fuerza fuera del rango, tu operación de rebote probablemente toque el stop. Acéptalo: no amplíes el stop ni añadas posición «porque antes siempre rebotaba».",
            },
            {
              type: 'p',
              text: "Una ruptura de rango confirmada puede convertirse en la oportunidad del setup anterior: espera el **retesteo** del extremo roto.",
            },
            {
              type: 'list',
              items: [
                'No operes rangos muy estrechos, donde el spread y el stop se comen todo el recorrido.',
                'Ten cuidado justo antes de un dato de alto impacto: los rangos previos a una noticia suelen romperse con violencia.',
                'Desconfía cuando el precio vuelve una y otra vez al mismo extremo con rebotes cada vez más pequeños: suele anticipar una ruptura.',
              ],
            },
          ],
        },
      ],
      keyPoints: [
        'Opera rangos solo cuando son claros: dos o más toques por lado y medias planas.',
        'Compra cerca del suelo y vende cerca del techo, con vela de rechazo; el centro es tierra de nadie.',
        'El stop va fuera del rango; el objetivo, antes del extremo contrario o en la mitad.',
        'Si el rango se rompe, acepta el stop y busca un posible retesteo.',
      ],
      quiz: [
        {
          q: '¿Cuál de estas señales indica mejor un rango claro?',
          options: [
            'Medias móviles inclinadas y separadas',
            'Dos o más toques en techo y suelo, con medias planas y entrelazadas',
            'Una vela muy grande en una dirección',
            'Máximos y mínimos crecientes',
          ],
          answer: 1,
          explain:
            'Un rango claro tiene varios toques en ambos extremos y medias sin pendiente. Las medias inclinadas y los máximos crecientes describen una tendencia.',
        },
        {
          q: 'En un rango de 3300.00 a 3340.00, el precio está en 3321.00. ¿Qué dice el setup?',
          options: [
            'Comprar, porque está por encima del suelo',
            'Vender, porque está por debajo del techo',
            'Comprar con un stop muy corto para mejorar el R:R',
            'No operar: está en el centro del rango',
          ],
          answer: 3,
          explain:
            'En el centro del rango el stop lógico queda lejos y el objetivo cerca. El setup solo se opera en los extremos.',
        },
        {
          q: '¿Dónde va el stop loss en una compra en el suelo del rango?',
          options: [
            'Fuera del rango, por debajo del suelo y con margen',
            'Exactamente en el suelo',
            'En la mitad del rango',
            'En un rango no hace falta stop',
          ],
          answer: 0,
          explain:
            'El precio suele perforar el extremo con mechas antes de girarse. Un stop fuera del rango, con margen, solo salta si el rango se rompe de verdad.',
        },
        {
          q: 'Compras en 3304.00 con el stop en 3294.00. ¿Cuál es el objetivo mínimo para un R:R de 1:1.5?',
          options: ['3310.00', '3334.00', '3319.00', '3324.00'],
          answer: 2,
          explain: 'El riesgo es de $10. 1.5 × $10 = $15, así que el objetivo mínimo es 3304.00 + $15 = 3319.00.',
        },
      ],
      practice: {
        goal: 'Opera un rebote en el extremo de un rango claro, con el stop fuera del rango y un R:R de al menos 1.5.',
        steps: [
          'En H1, busca una zona donde el precio haya tocado al menos dos veces el techo y dos el suelo. Comprueba que la MA20 y la MA50 están casi planas.',
          'Dibuja el rango con el rectángulo y marca la mitad con una línea horizontal.',
          'Si el precio está en la mitad del rango, no operes. Si está en un extremo, comprueba que hay una vela de rechazo cerrada.',
          'Coloca el Stop Loss fuera del rango, con margen, y el Take Profit antes del extremo contrario o en la mitad del rango.',
          'Ajusta los lotes hasta que el riesgo sea como máximo del 1% y verifica en el panel que el R:R es de 1.5 o más.',
          'Escribe en las notas los límites del rango, la vela de rechazo y qué cierre te indicaría que el rango se ha roto.',
          'Pulsa Comprar si estás en el suelo o Vender si estás en el techo, y revisa después el resultado en el Diario.',
        ],
        rules: { maxRiskPct: 1, minRR: 1.5, requireNotes: true },
      },
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n5-gestion-operacion',
      title: 'Gestionar la operación: break-even, cierres parciales y trailing stop',
      summary:
        'Conocerás las tres técnicas más habituales para gestionar una operación abierta, sus ventajas e inconvenientes, y cómo decidir de antemano cuál usar.',
      minutes: 10,
      sections: [
        {
          heading: 'Gestionar es decidir antes, no improvisar',
          blocks: [
            {
              type: 'p',
              text: "Una vez abierta la operación tienes dos caminos: dejarla correr hasta el stop o el objetivo sin tocar nada, o **gestionarla** con reglas: mover el stop, cerrar una parte, seguir al precio. Ninguna opción es mejor siempre; lo importante es que la decisión esté tomada antes de entrar.",
            },
            {
              type: 'p',
              text: "Lo que no funciona es gestionar por impulso: cerrar porque te pones nervioso o alejar el stop porque «ya casi da la vuelta». Eso no es gestión, es improvisación.",
            },
            {
              type: 'callout',
              tone: 'key',
              title: 'Cómo funciona en este simulador',
              text: "Cuando pulsas Comprar o Vender, el simulador reproduce velas reales de H1 hasta que el precio toca el Stop Loss o el Take Profit (si en 200 velas no toca ninguno, cierra al último precio). No puedes modificar la operación a mitad de camino. Por eso aquí estudiarás estas técnicas de forma **conceptual**: escribirás en las notas cómo gestionarías la operación y luego podrás comprobar con el modo replay qué habría pasado.",
            },
          ],
        },
        {
          heading: 'Mover el stop a break-even',
          blocks: [
            {
              type: 'p',
              text: "Mover el stop a **break-even** significa llevarlo al precio de entrada cuando la operación ya va a tu favor. Desde ese momento, si el precio se da la vuelta, sales sin ganar ni perder (salvo costes como posibles comisiones).",
            },
            {
              type: 'table',
              headers: ['Ventajas', 'Inconvenientes'],
              rows: [
                ['Evita que una operación que iba ganando acabe en pérdida', 'Muchas operaciones vuelven a la entrada antes de seguir: te sacará de algunas que habrían llegado al objetivo'],
                ['Reduce la tensión mientras la operación sigue abierta', 'Si lo haces demasiado pronto, convierte operaciones buenas en cierres a cero'],
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Una regla habitual es no mover a break-even hasta que el precio haya avanzado al menos **1R** o haya formado un nuevo mínimo (o máximo) a tu favor. Moverlo tras unos pocos dólares suele ser miedo disfrazado de prudencia.",
            },
          ],
        },
        {
          heading: 'Cierres parciales',
          blocks: [
            {
              type: 'p',
              text: "Un **cierre parcial** consiste en cerrar solo una parte de la posición en un primer objetivo y dejar el resto abierto hacia el objetivo final. Suele combinarse con mover a break-even el stop de la parte restante.",
            },
            {
              type: 'example',
              title: 'Compra de 0.10 lotes con plan de parcial',
              rows: [
                ['Operación', 'Entrada 3320.00, stop 3310.00 ($10), objetivo 3340.00 ($20)'],
                ['Riesgo', '0.10 × 100 × $10 = $100 (1R)'],
                ['Plan de gestión', 'Cerrar 0.05 lotes en 3330.00 (1R) y mover el stop del resto a 3320.00'],
                ['Parcial en 1R', '0.05 × 100 × $10 = +$50'],
                ['Resto en el objetivo', '0.05 × 100 × $20 = +$100'],
              ],
              note: 'Total de +$150 si llega al objetivo. Sin gestionar habrías ganado $200; pero si el precio hubiera tocado 1R y vuelto atrás, ganas $50 en lugar de perder $100.',
            },
            {
              type: 'table',
              headers: ['Escenario', 'Sin gestión', 'Parcial + break-even'],
              rows: [
                ['Va directo al objetivo', '+$200 (+2R)', '+$150 (+1.5R)'],
                ['Llega a 1R y vuelve hasta el stop original', '−$100 (−1R)', '+$50 (+0.5R)'],
                ['Va directo al stop sin llegar a 1R', '−$100 (−1R)', '−$100 (−1R)'],
              ],
            },
            {
              type: 'p',
              text: "Fíjate en el intercambio: los parciales suavizan los resultados, pero recortan las mejores operaciones. Además, necesitas un tamaño que se pueda dividir: con 0.01 lotes, el mínimo, no hay nada que repartir.",
            },
          ],
        },
        {
          heading: 'Trailing stop',
          blocks: [
            {
              type: 'p',
              text: "Un **trailing stop** es un stop que sigue al precio a medida que avanza a tu favor, sin retroceder nunca. Hay varias formas de llevarlo:",
            },
            {
              type: 'list',
              items: [
                'Por estructura: lo colocas bajo cada nuevo mínimo creciente (en compras) o sobre cada nuevo máximo decreciente (en ventas).',
                'Por media móvil: lo mantienes al otro lado de la MA20 mientras la tendencia la respete.',
                'Por distancia fija: siempre a, por ejemplo, $8 del precio más favorable alcanzado.',
              ],
            },
            {
              type: 'example',
              title: 'Trailing por estructura (0.10 lotes)',
              rows: [
                ['Entrada y stop inicial', 'Compra en 3320.00, stop en 3310.00'],
                ['Nuevo mínimo creciente en 3326.00', 'Stop a 3324.00'],
                ['Nuevo mínimo creciente en 3338.00', 'Stop a 3336.00'],
                ['El precio gira y toca el stop', 'Salida en 3336.00 → +$16 = 1.6R → 0.10 × 100 × $16 = +$160'],
              ],
              note: 'Si la tendencia hubiera seguido, el trailing te habría dejado ganar mucho más de 2R. Como se paró, devolviste parte del recorrido desde el máximo.',
            },
            {
              type: 'p',
              text: "Ventaja: captura los movimientos largos. Inconvenientes: no conoces de antemano tu R:R, devuelves parte del beneficio al final y el ruido normal puede sacarte antes de tiempo.",
            },
          ],
        },
        {
          heading: 'Elige un método y escríbelo',
          blocks: [
            {
              type: 'table',
              headers: ['Técnica', 'Encaja mejor con', 'Riesgo principal'],
              rows: [
                ['Sin gestión (SL y TP fijos)', 'Cualquier setup; es lo más fácil de medir', 'Ver cómo una operación en +1R acaba en −1R'],
                ['Break-even', 'Rupturas, cuando el nivel ya ha aguantado el retesteo', 'Salir a cero de operaciones que habrían ganado'],
                ['Cierre parcial', 'Objetivos lejanos o con zonas intermedias en el camino', 'Reducir la ganancia media'],
                ['Trailing stop', 'Retrocesos en tendencias fuertes', 'Devolver beneficio y no conocer el R:R de antemano'],
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              title: 'Practica en las notas',
              text: "Al abrir cada operación en el simulador, añade a tus notas una línea de gestión, por ejemplo: «Si llega a 3330.00 (1R), movería el stop a break-even». Después, con el modo replay, comprueba qué habría pasado. Tras 20 o 30 operaciones sabrás si esa regla te ayuda o te perjudica.",
            },
          ],
        },
      ],
      keyPoints: [
        'La gestión se decide antes de entrar, nunca por impulso con la operación abierta.',
        'El break-even protege, pero te sacará de algunas operaciones que habrían ganado.',
        'Los cierres parciales suavizan los resultados a cambio de recortar las mejores operaciones.',
        'El trailing stop captura tendencias largas, pero no conoces el R:R de antemano.',
        'En este simulador la operación va sola al SL o al TP: escribe tu gestión en las notas y compruébala con el replay.',
      ],
      quiz: [
        {
          q: '¿Qué significa mover el stop a break-even?',
          options: [
            'Ampliar el stop para dar más espacio',
            'Cerrar la mitad de la operación',
            'Llevar el stop al precio de entrada',
            'Quitar el stop',
          ],
          answer: 2,
          explain:
            'Con el stop en el precio de entrada, si el precio se da la vuelta sales sin ganar ni perder (salvo posibles costes).',
        },
        {
          q: 'Compras 0.10 lotes en 3320.00 con stop en 3310.00. Cierras 0.05 lotes en 3330.00 y el resto sale en break-even. ¿Resultado total?',
          options: ['+$50', '+$100', '$0', '+$150'],
          answer: 0,
          explain:
            'El parcial gana 0.05 × 100 × $10 = $50. La otra mitad sale en el precio de entrada, sin ganancia ni pérdida. Total: +$50.',
        },
        {
          q: '¿Cuál es un inconveniente del trailing stop?',
          options: [
            'No permite capturar tendencias largas',
            'No conoces el R:R final de antemano y sueles devolver parte del beneficio',
            'Obliga a arriesgar más del 1%',
            'Solo funciona en rangos',
          ],
          answer: 1,
          explain:
            'El trailing está pensado precisamente para tendencias largas, pero a cambio el objetivo no es fijo y la salida siempre llega después de un retroceso.',
        },
        {
          q: 'En el simulador de esta app, ¿cómo practicas la gestión de una operación?',
          options: [
            'Moviendo el stop mientras se reproducen las velas',
            'No se puede practicar de ninguna forma',
            'Cerrando parciales a mitad de la operación',
            'Escribiendo en las notas tu plan de gestión y comprobando después con el modo replay qué habría pasado',
          ],
          answer: 3,
          explain:
            'La operación del simulador corre sola hasta el SL o el TP. Puedes planificar la gestión en las notas y evaluarla con el replay.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n5-plan-de-trading',
      title: 'Escribe tu plan de trading',
      summary:
        'Reunirás todo lo aprendido en un documento propio: qué operas, cuándo, con qué setups, cuánto arriesgas, cuándo paras y cómo revisas tus resultados.',
      minutes: 11,
      sections: [
        {
          heading: 'Qué es un plan de trading',
          blocks: [
            {
              type: 'p',
              text: "Un **plan de trading** es un documento escrito con tus reglas para todo lo que depende de ti: qué mercado operas, en qué horario, con qué setups, cuánto arriesgas, cuándo paras y cómo revisas lo que haces. No dice qué hará el precio; dice qué harás tú en cada situación.",
            },
            {
              type: 'p',
              text: "Escribirlo tiene un efecto curioso: te obliga a concretar cosas que en tu cabeza parecían claras. «Arriesgo poco» se convierte en «arriesgo el 1% por operación y como máximo el 2% al día».",
            },
            {
              type: 'callout',
              tone: 'key',
              text: "Si una decisión no está en tu plan, tómala fuera del horario de trading, con calma, y añádela al plan. **Nunca la improvises con una operación abierta.**",
            },
          ],
        },
        {
          heading: 'Las siete secciones',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                'Mercado y horario: qué instrumento operas (aquí, XAU/USD), en qué sesiones y en qué marcos temporales.',
                'Setups permitidos: solo los que tienes definidos y probados, cada uno con su checklist.',
                'Riesgo por operación: qué porcentaje del balance arriesgas y cómo calculas los lotes.',
                'Límites diarios y semanales: cuánto puedes perder, o cuántas operaciones puedes hacer, antes de parar.',
                'Reglas de gestión: qué haces con la operación abierta (nada, break-even, parcial o trailing).',
                'Rutina: qué haces antes, durante y después de cada sesión.',
                'Revisión: cuándo y cómo analizas tus resultados y cambias el plan.',
              ],
            },
            {
              type: 'p',
              text: "No hace falta que sea largo. Un buen plan cabe en una o dos páginas; lo importante es que cada apartado tenga una respuesta concreta y comprobable.",
            },
          ],
        },
        {
          heading: 'Límites: el freno de emergencia',
          blocks: [
            {
              type: 'p',
              text: "Los **límites diarios y semanales** existen para cortar las malas rachas antes de que se conviertan en un problema serio. Funcionan precisamente porque se deciden en frío, no en mitad de la sesión.",
            },
            {
              type: 'example',
              title: 'Límites para una cuenta de $10,000',
              rows: [
                ['Riesgo por operación', '1% = $100'],
                ['Pérdida máxima diaria', '2% = $200 → como mucho dos operaciones perdedoras completas'],
                ['Pérdida máxima semanal', '4% = $400'],
                ['Máximo de operaciones al día', '3'],
                ['Si se alcanza un límite', 'Se acabó la sesión (o la semana). Sin excepciones.'],
              ],
              note: 'Una mala semana con estos límites cuesta un 4%, y para recuperarlo basta con ganar en torno a un 4.2%. Sin límites, una mala tarde puede costar mucho más.',
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "El límite diario no es un objetivo que haya que agotar. Si has perdido una operación y no te encuentras bien, puedes —y debes— parar antes.",
            },
          ],
        },
        {
          heading: 'Plantilla para rellenar',
          blocks: [
            {
              type: 'p',
              text: "Copia esta plantilla en un documento o en una libreta y complétala con tus propias reglas. La columna de ejemplo es solo una referencia razonable para empezar.",
            },
            {
              type: 'table',
              headers: ['Apartado', 'Pregunta que debes responder', 'Ejemplo'],
              rows: [
                ['Mercado y horario', '¿Qué opero, cuándo y en qué marcos temporales?', 'XAU/USD; solapamiento de Londres y Nueva York; contexto en H4 y entrada en H1'],
                ['Setups permitidos', '¿Qué setups puedo operar y dónde está su checklist?', 'Retroceso en tendencia y ruptura con retesteo; el de rango, solo en demo hasta tener 30 operaciones registradas'],
                ['Riesgo por operación', '¿Cuánto arriesgo y cómo calculo los lotes?', '1% del balance; lotes = riesgo en $ ÷ (distancia al stop en $ × 100), redondeando hacia abajo'],
                ['R:R mínimo', '¿Qué relación beneficio/riesgo exijo?', '1:2 en tendencia y rupturas; 1:1.5 en rangos'],
                ['Límites', '¿Cuándo paro?', '−2% al día, −4% a la semana y máximo 3 operaciones al día'],
                ['Noticias', '¿Qué hago con los datos de alto impacto?', 'No abro operaciones 30 minutos antes ni 30 minutos después'],
                ['Gestión', '¿Qué hago con la operación abierta?', 'Nada: SL y TP fijos. La gestión activa solo la pruebo en las notas'],
                ['Rutina', '¿Qué hago antes, durante y después?', 'Checklist previa de 15 minutos; diario y revisión al terminar'],
                ['Revisión', '¿Cuándo reviso y cambio el plan?', 'Cada domingo; un solo cambio cada vez, anotado con fecha'],
              ],
            },
          ],
        },
        {
          heading: 'Un plan vivo, pero no improvisado',
          blocks: [
            {
              type: 'p',
              text: "Tu plan cambiará a medida que aprendas, y eso es bueno. Lo que no debe ocurrir es que cambie a mitad de una sesión porque una operación ha salido mal.",
            },
            {
              type: 'list',
              items: [
                'Revisa el plan en un momento fijo: por ejemplo, cada semana o después de cada bloque de 20 operaciones.',
                'Cambia una sola cosa cada vez; si cambias tres, no sabrás cuál ha tenido efecto.',
                'Apoya cada cambio en datos del Diario, no en la sensación que te dejó una operación concreta.',
                'Guarda las versiones con fecha para poder compararlas.',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Lee tu plan antes de cada sesión. Parece innecesario cuando ya lo conoces, pero es justo lo que mantiene las reglas frescas cuando el mercado se pone nervioso.",
            },
          ],
        },
      ],
      keyPoints: [
        'El plan describe lo que harás tú, no lo que hará el mercado.',
        'Siete apartados: mercado y horario, setups, riesgo, límites, gestión, rutina y revisión.',
        'Los límites diarios y semanales se deciden en frío y se respetan sin excepciones.',
        'Cambia el plan solo en la revisión programada, una cosa cada vez y con datos.',
      ],
      quiz: [
        {
          q: '¿Qué describe un plan de trading?',
          options: [
            'Lo que va a hacer el precio esta semana',
            'Lo que harás tú en cada situación: qué operas, cuándo, cuánto arriesgas y cuándo paras',
            'Una lista de señales que garantizan beneficios',
            'Las noticias de la semana',
          ],
          answer: 1,
          explain:
            'El plan no predice el mercado: fija tus decisiones de antemano para que no tengas que improvisarlas bajo presión.',
        },
        {
          q: 'Arriesgas el 1% en una cuenta de $10,000 y tu límite diario es del 2%. Hoy has perdido dos operaciones completas. ¿Qué dice el plan?',
          options: [
            'Una operación más, con el doble de lotes, para recuperar',
            'Seguir operando hasta el final del horario',
            'Has llegado al límite: se acabó la sesión',
            'Bajar el riesgo al 0.5% y seguir',
          ],
          answer: 2,
          explain:
            'Dos pérdidas de $100 suman $200, el 2% del balance. El límite se ha alcanzado y la sesión termina, sin excepciones.',
        },
        {
          q: 'Tras una semana mala quieres cambiar tres reglas del plan a la vez. ¿Qué es mejor?',
          options: [
            'Cambiar una sola cosa, en la revisión programada y apoyándote en datos',
            'Cambiar las tres inmediatamente',
            'Tirar el plan y operar por intuición',
            'Cambiar las reglas cada día según el mercado',
          ],
          answer: 0,
          explain:
            'Si cambias varias reglas a la vez no sabrás cuál ha tenido efecto. Una semana mala, además, puede ser simplemente una racha normal.',
        },
        {
          q: '¿Cuál de estas reglas está bien escrita para un plan?',
          options: [
            '«Arriesgaré poco»',
            '«Operaré cuando lo vea claro»',
            '«Pararé si las cosas van mal»',
            '«Arriesgo el 1% por operación y paro al llegar a −2% en el día»',
          ],
          answer: 3,
          explain:
            'Es concreta y comprobable: puedes saber sin dudas si la has cumplido. Las demás son intenciones vagas.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n5-backtesting',
      title: 'Backtesting y el modo replay',
      summary:
        'Aprenderás a probar un setup sobre datos históricos con el modo replay, a registrar cada operación y a sacar conclusiones sin engañarte.',
      minutes: 12,
      sections: [
        {
          heading: 'Probar antes de confiar',
          blocks: [
            {
              type: 'p',
              text: "Un setup que suena lógico no es necesariamente un setup que funcione. El **backtesting** consiste en aplicar tus reglas sobre datos del pasado, operación a operación, para estimar cómo se comportan: con qué frecuencia aciertan, cuánto ganan y pierden y qué rachas producen.",
            },
            {
              type: 'p',
              text: "Puede hacerse de forma automática, con programas que aplican las reglas al histórico, o de forma **manual**, avanzando el gráfico vela a vela y decidiendo como si fuera en directo. Aquí trabajarás de forma manual, que además entrena tu ojo para reconocer el setup.",
            },
            {
              type: 'callout',
              tone: 'key',
              text: "Un backtest no predice el futuro. Te dice si tus reglas tuvieron ventaja en el pasado y te da una idea realista de qué esperar, **incluidas las rachas perdedoras**.",
            },
          ],
        },
        {
          heading: '¿Cuántas operaciones hacen falta?',
          blocks: [
            {
              type: 'p',
              text: "Con pocas operaciones, el azar lo domina todo. Diez operaciones con siete ganadoras pueden ser pura suerte; diez con siete perdedoras, pura mala suerte. Necesitas una **muestra** suficientemente grande.",
            },
            {
              type: 'list',
              items: [
                'Como mínimo, de 30 a 50 operaciones por setup antes de sacar conclusiones.',
                'Mejor aún si cubren condiciones distintas: tendencias, rangos, días de mucha y de poca volatilidad.',
                'Un setup cada vez: si mezclas setups en la misma muestra, no sabrás cuál funciona.',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "A partir de ahí, cada bloque nuevo de operaciones sirve para confirmar (o no) lo que viste. Si los resultados cambian mucho de un bloque a otro, el setup todavía no es fiable.",
            },
          ],
        },
        {
          heading: 'Cómo hacerlo con el modo replay',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                'Elige un único setup y ten a la vista sus reglas y su checklist.',
                'Activa el modo replay del gráfico y sitúate en un punto del pasado, de forma que no veas lo que vino después.',
                'Avanza vela a vela. Cuando se cumpla la checklist, anota entrada, stop, objetivo y R:R antes de seguir avanzando.',
                'Sigue avanzando hasta que el precio toque el stop o el objetivo y anota el resultado en R.',
                'Repite hasta completar la muestra, sin saltarte ningún setup válido.',
              ],
            },
            {
              type: 'p',
              text: "Además del replay, cada operación que abres en el simulador queda registrada en el **Diario**, con su resultado, su R:R y su riesgo. Si empiezas siempre las notas con el nombre del setup, podrás filtrarlo después en la exportación a CSV.",
            },
          ],
        },
        {
          heading: 'Registra cada operación',
          blocks: [
            {
              type: 'p',
              text: "Anota todas las operaciones con el mismo formato. Trabajar en **R** (múltiplos del riesgo) en lugar de en dólares te permite comparar operaciones con tamaños distintos.",
            },
            {
              type: 'table',
              headers: ['#', 'Fecha', 'Setup', 'Dirección', 'Entrada', 'Stop', 'Objetivo', 'Resultado'],
              rows: [
                ['1', '03/02', 'Retroceso', 'Compra', '3311.00', '3301.00', '3331.00', '+2R'],
                ['2', '05/02', 'Retroceso', 'Compra', '3324.50', '3316.50', '3340.50', '−1R'],
                ['3', '06/02', 'Retroceso', 'Venta', '3298.00', '3306.00', '3282.00', '+2R'],
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "Registra también los setups válidos que no habrías tomado «porque no te gustaban». Si solo anotas los que te convencen, estás probando tu intuición, no tus reglas.",
            },
          ],
        },
        {
          heading: 'Cuidado con el sesgo retrospectivo',
          blocks: [
            {
              type: 'p',
              text: "El **sesgo retrospectivo** es la tendencia a ver como obvio lo que ya sabes que ocurrió. En un gráfico del pasado, las buenas operaciones parecen evidentes y las malas, fáciles de evitar. Así se infla cualquier backtest.",
            },
            {
              type: 'list',
              items: [
                'Oculta el futuro: trabaja siempre en modo replay, nunca sobre el gráfico completo.',
                'Decide antes de avanzar: escribe entrada, stop y objetivo antes de ver la siguiente vela.',
                'No cambies las reglas a mitad de la prueba. Si quieres probar una variante, empieza otra muestra.',
                'Desconfía de los ajustes a medida: añadir filtros hasta que el histórico salga perfecto suele producir reglas que fallan en el futuro.',
              ],
            },
          ],
        },
        {
          heading: 'Leer los resultados',
          blocks: [
            {
              type: 'formula',
              label: 'Esperanza',
              expr: 'Esperanza = (% acierto × ganancia media) − (% fallo × pérdida media)',
              note: 'Expresada en R, te dice cuánto ganas o pierdes de media por operación, en unidades de riesgo.',
            },
            {
              type: 'example',
              title: 'Resultado de 40 operaciones del setup de retroceso',
              rows: [
                ['Operaciones', '40: 16 ganadoras y 24 perdedoras'],
                ['Porcentaje de acierto', '16 ÷ 40 = 40%'],
                ['Ganancia media / pérdida media', '+2R / −1R'],
                ['Esperanza', '(0.40 × 2R) − (0.60 × 1R) = 0.80R − 0.60R = +0.20R'],
                ['En dinero, con $100 de riesgo', '+$20 por operación, de media'],
              ],
              note: 'Con R:R 1:2, el acierto mínimo para no perder es del 33.3%, y este 40% lo supera. Es prometedor, pero 40 operaciones siguen siendo una muestra modesta: sigue sumando antes de confiar plenamente.',
            },
          ],
        },
      ],
      keyPoints: [
        'El backtesting mide si tus reglas tuvieron ventaja en el pasado; no garantiza el futuro.',
        'Reúne al menos 30–50 operaciones por setup y prueba un solo setup cada vez.',
        'Usa el modo replay y decide antes de avanzar para evitar el sesgo retrospectivo.',
        'Registra todas las operaciones en R y calcula la esperanza.',
      ],
      quiz: [
        {
          q: '¿Cuántas operaciones de un mismo setup conviene registrar, como mínimo, antes de sacar conclusiones?',
          options: ['5', 'Entre 30 y 50', '10', 'Con 1 basta si sale bien'],
          answer: 1,
          explain:
            'Con muestras pequeñas el azar domina. Entre 30 y 50 operaciones es un mínimo razonable para empezar a ver si hay ventaja.',
        },
        {
          q: '¿Qué es el sesgo retrospectivo en un backtest?',
          options: [
            'Ver como evidentes las operaciones porque ya sabes qué pasó después',
            'Operar solo en la sesión asiática',
            'Usar el modo replay',
            'Arriesgar más del 1%',
          ],
          answer: 0,
          explain:
            'Con el futuro a la vista, todo parece obvio. Por eso se trabaja en replay y se decide antes de avanzar.',
        },
        {
          q: 'En tu backtest, 20 de 50 operaciones ganan +2R y 30 pierden −1R. ¿Cuál es la esperanza?',
          options: ['−0.20R', '+0.40R', '+0.20R', '0R'],
          answer: 2,
          explain: 'Acierto del 40%: (0.40 × 2R) − (0.60 × 1R) = 0.80R − 0.60R = +0.20R por operación.',
        },
        {
          q: '¿Por qué debes anotar también los setups válidos que «no te gustaban»?',
          options: [
            'Para que el backtest salga mejor',
            'No hace falta anotarlos',
            'Para operar más',
            'Porque si solo anotas los que te convencen, pruebas tu intuición y no tus reglas',
          ],
          answer: 3,
          explain:
            'El backtest debe medir las reglas tal como están escritas. Filtrar a ojo introduce un criterio que no podrás repetir en directo.',
        },
      ],
      practice: {
        goal: 'Empieza tu muestra: registra en el Diario operaciones de un único setup, siempre con las mismas reglas.',
        steps: [
          'Elige un setup de este nivel (el de retroceso o el de ruptura encajan con el R:R de 2 que exige esta práctica) y escribe sus reglas y su checklist antes de empezar.',
          'Usa el modo replay para entrenar el ojo: recorre el histórico y localiza varios ejemplos del setup antes de operar.',
          'Abre operaciones solo cuando la checklist se cumpla por completo, con un riesgo de como máximo el 1% y un R:R de al menos 2.',
          'Empieza siempre las notas con el nombre del setup (por ejemplo, «Setup: retroceso») y añade contexto, gatillo e invalidación.',
          'No cambies las reglas durante la muestra. Si se te ocurre una mejora, apúntala para la revisión.',
          'Fíjate un primer bloque de 10 operaciones. Después, revisa en el Diario el porcentaje de acierto, el R:R medio y el drawdown máximo, y sigue sumando hasta llegar a 30–50.',
        ],
        rules: { maxRiskPct: 1, minRR: 2, requireNotes: true },
      },
    },
  ],
};
