import type { Level } from './types';

export const nivel1: Level = {
  id: 'n1',
  number: 1,
  title: 'Fundamentos del oro',
  subtitle: 'De cero a tu primera operación',
  description:
    'Entenderás qué es XAU/USD, cómo se cotiza y cuánto vale cada movimiento del precio. Al terminar abrirás tu primera operación en el simulador con stop loss, take profit y un riesgo controlado.',
  lessons: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n1-que-es-el-oro',
      title: 'Qué es el oro y qué significa XAU/USD',
      summary: 'Sabrás por qué el oro se negocia en los mercados, cómo leer el símbolo XAU/USD y cómo se gana cuando sube o cuando baja.',
      minutes: 7,
      sections: [
        {
          heading: 'El oro como activo financiero',
          blocks: [
            {
              type: 'p',
              text: 'El oro se ha usado durante miles de años como dinero y como forma de guardar valor. Hoy, además de en joyería y en la industria, se compra y se vende a diario en los mercados financieros: lo negocian bancos centrales, fondos de inversión, empresas y particulares.',
            },
            {
              type: 'p',
              text: 'Cuando en esta academia hablamos de **operar oro** no nos referimos a comprar un lingote y guardarlo en una caja fuerte. Hablamos de **especular con su precio**: abrir una posición que gana o pierde dinero según el precio suba o baje.',
            },
            {
              type: 'callout',
              tone: 'key',
              title: 'Primer término: activo',
              text: 'Un **activo** es cualquier cosa que se puede comprar y vender en un mercado y cuyo precio cambia con el tiempo. El oro es un activo; también lo son las acciones, las divisas o el petróleo.',
            },
          ],
        },
        {
          heading: 'Qué significa XAU/USD',
          blocks: [
            {
              type: 'p',
              text: 'En las plataformas de trading el oro aparece con el símbolo **XAU/USD** (a veces escrito XAUUSD). **XAU** es el código internacional del oro: «Au» es su símbolo químico, del latín aurum, y la X indica que no es la moneda de ningún país. **USD** es el dólar estadounidense.',
            },
            {
              type: 'p',
              text: 'Juntos significan: **precio de 1 onza troy de oro expresado en dólares**. Si ves 3350.40, quiere decir que, en ese momento, una onza de oro cuesta 3350.40 dólares.',
            },
            {
              type: 'callout',
              tone: 'tip',
              title: '¿Qué es una onza troy?',
              text: 'Es la unidad tradicional para pesar metales preciosos y equivale a unos **31.1 gramos**. No la confundas con la onza «normal» de cocina, que pesa unos 28.35 gramos.',
            },
            {
              type: 'example',
              title: 'Leer una cotización (precios de ejemplo)',
              rows: [
                ['Símbolo', 'XAU/USD'],
                ['Precio que ves', '3350.40'],
                ['Qué significa', '1 onza troy de oro = $3,350.40'],
                ['Si el precio pasa a 3360.40', 'La onza vale $10 más que antes'],
                ['Si el precio pasa a 3345.40', 'La onza vale $5 menos que antes'],
              ],
              note: 'Fíjate en el formato: los precios se escriben con punto decimal y sin separador de miles, igual que en la plataforma.',
            },
          ],
        },
        {
          heading: 'Qué mueve el precio del oro',
          blocks: [
            {
              type: 'p',
              text: 'Como cualquier activo, el precio del oro sube cuando hay más gente queriendo comprar que vender, y baja en el caso contrario. Detrás de esa oferta y demanda hay varios factores que conviene conocer:',
            },
            {
              type: 'list',
              items: [
                '**Tipos de interés.** El oro no paga intereses. Cuando los tipos suben, mantener oro resulta menos atractivo frente a otras inversiones, y eso suele presionar su precio.',
                '**La fuerza del dólar.** Como el oro cotiza en dólares, un dólar más fuerte tiende a frenarlo y un dólar débil tiende a impulsarlo.',
                '**Miedo e incertidumbre.** En crisis, conflictos o sustos financieros, muchos inversores buscan refugio en el oro.',
                '**Demanda física y bancos centrales.** Las compras de joyería, de lingotes y de las reservas de los bancos centrales también influyen.',
                '**Datos económicos de EE. UU.** Empleo, inflación y decisiones de la Reserva Federal pueden provocar movimientos bruscos en minutos.',
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              title: 'Tendencias, no reglas fijas',
              text: 'Estas relaciones se cumplen a menudo, pero no siempre: a veces el oro y el dólar suben a la vez. No necesitas predecir la economía para empezar. Lo que sí necesitas desde el primer día es **controlar cuánto puedes perder** en cada operación.',
            },
          ],
        },
        {
          heading: 'Ganar si sube o si baja: comprar y vender',
          blocks: [
            {
              type: 'p',
              text: 'En XAU/USD puedes buscar beneficio tanto si el precio sube como si baja. Si **compras**, abres una **posición larga** (en inglés, «long»): ganas si el precio sube. Si **vendes**, abres una **posición corta** («short»): ganas si el precio baja. No necesitas tener oro para vender; la plataforma lo gestiona como un contrato sobre el precio.',
            },
            {
              type: 'table',
              headers: ['Acción', 'Qué esperas', 'Ganas si…', 'Pierdes si…'],
              rows: [
                ['Comprar (largo)', 'Que suba', 'El precio sube', 'El precio baja'],
                ['Vender (corto)', 'Que baje', 'El precio baja', 'El precio sube'],
              ],
            },
            {
              type: 'example',
              title: 'Dos operaciones de ejemplo',
              rows: [
                ['Compra en 3340.00 y cierre en 3346.00', 'El precio subió $6: a tu favor'],
                ['Venta en 3340.00 y cierre en 3346.00', 'El precio subió $6: en tu contra'],
                ['Venta en 3340.00 y cierre en 3332.00', 'El precio bajó $8: a tu favor'],
              ],
              note: 'Cuánto dinero supone cada dólar de movimiento depende del tamaño de tu posición. Lo calcularás en la lección de lotes.',
            },
          ],
        },
        {
          heading: 'Cuándo se puede operar y qué riesgo implica',
          blocks: [
            {
              type: 'p',
              text: 'El oro se negocia de **lunes a viernes casi las 24 horas**, con una pausa diaria corta (de alrededor de una hora; el momento exacto depende del bróker). El fin de semana el mercado está cerrado, y el lunes puede abrir a un precio distinto del cierre del viernes. A ese salto se le llama **hueco** o «gap».',
            },
            {
              type: 'callout',
              tone: 'warning',
              title: 'El riesgo es real',
              text: 'El oro puede moverse muchos dólares en un solo día. Operar con dinero real implica la posibilidad de perderlo. Esta academia es **formación**, no asesoramiento financiero: aprende y practica primero en el simulador.',
            },
            {
              type: 'p',
              text: 'Durante todo el curso usarás el **simulador** de la app: una cuenta de práctica (demo) que empieza con $10,000 ficticios. Puedes equivocarte tantas veces como necesites sin que cueste un euro ni un dólar.',
            },
          ],
        },
      ],
      keyPoints: [
        'XAU/USD es el precio de 1 onza troy de oro (unos 31.1 g) expresado en dólares.',
        'Si compras ganas cuando el precio sube; si vendes ganas cuando baja.',
        'Tipos de interés, dólar, incertidumbre y demanda influyen en el precio, pero no son reglas fijas.',
        'Se opera de lunes a viernes casi 24 horas, con una pausa diaria corta y cierre el fin de semana.',
      ],
      quiz: [
        {
          q: 'Ves la cotización XAU/USD 3350.40. ¿Qué significa?',
          options: [
            'Que 1 gramo de oro cuesta $3,350.40',
            'Que 1 onza troy de oro cuesta $3,350.40',
            'Que 100 onzas de oro cuestan $3,350.40',
            'Que 1 kilo de oro cuesta $3,350.40',
          ],
          answer: 1,
          explain: 'XAU/USD indica el precio de una onza troy de oro en dólares estadounidenses.',
        },
        {
          q: 'Abres una venta (posición corta) en XAU/USD. ¿Cuándo ganas?',
          options: [
            'Cuando el precio baja',
            'Cuando el precio sube',
            'Nunca: con el oro solo se puede ganar comprando',
          ],
          answer: 0,
          explain: 'Al vender, ganas si el precio baja por debajo de tu precio de entrada. No necesitas tener oro: operas sobre su precio.',
        },
        {
          q: '¿Cuál de estas afirmaciones sobre el dólar y el oro es la más acertada?',
          options: [
            'Siempre se mueven en direcciones opuestas',
            'No tienen ninguna relación',
            'Un dólar fuerte suele presionar el oro a la baja, pero no es una regla fija',
          ],
          answer: 2,
          explain: 'Como el oro cotiza en dólares, a menudo se mueven en sentidos opuestos, pero hay periodos en los que suben o bajan juntos.',
        },
        {
          q: '¿Qué es un hueco (gap) en el precio?',
          options: [
            'La comisión que cobra el bróker al abrir',
            'Un salto de precio entre un cierre y la siguiente apertura, por ejemplo del viernes al lunes',
            'La pausa diaria del mercado',
          ],
          answer: 1,
          explain: 'Cuando el mercado está cerrado no hay cotizaciones; si al reabrir el precio es distinto, en el gráfico aparece un salto llamado hueco o gap.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n1-como-se-cotiza',
      title: 'Cómo se cotiza: bid, ask y spread',
      summary: 'Aprenderás por qué hay dos precios, qué es el spread y por qué cada operación empieza con una pequeña pérdida.',
      minutes: 7,
      sections: [
        {
          heading: 'Dos precios, no uno',
          blocks: [
            {
              type: 'p',
              text: 'Al mirar el gráfico parece que el oro tiene un único precio, pero en realidad siempre hay **dos**:',
            },
            {
              type: 'list',
              items: [
                '**Bid** (precio de venta): el precio al que **tú puedes vender**. Es lo que el mercado está dispuesto a pagarte.',
                '**Ask** (precio de compra): el precio al que **tú puedes comprar**. Es lo que el mercado te pide.',
                'El ask siempre está algo **por encima** del bid.',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              title: 'Truco para recordarlo',
              text: 'Compras al precio de arriba (ask) y vendes al de abajo (bid). Igual que en una casa de cambio: siempre te compran un poco más barato de lo que te venden.',
            },
          ],
        },
        {
          heading: 'El spread: el coste de entrar',
          blocks: [
            {
              type: 'p',
              text: 'La diferencia entre el ask y el bid se llama **spread** (horquilla). Es el principal coste de cada operación: lo pagas al entrar, ganes o pierdas después.',
            },
            {
              type: 'formula',
              label: 'Spread',
              expr: 'Spread = Ask − Bid',
              note: 'Se mide en dólares de precio por onza.',
            },
            {
              type: 'example',
              title: 'Calcular el spread',
              rows: [
                ['Bid', '3350.10'],
                ['Ask', '3350.40'],
                ['Spread', '3350.40 − 3350.10 = 0.30'],
                ['En dinero', '$0.30 por cada onza'],
              ],
            },
            {
              type: 'p',
              text: 'En el simulador de esta app el spread es **fijo de 0.30**. En las cuentas reales suele variar: se ensancha cuando hay poca actividad (la pausa diaria, la apertura del lunes) o justo cuando se publican noticias importantes.',
            },
          ],
        },
        {
          heading: 'Por qué cada operación empieza en negativo',
          blocks: [
            {
              type: 'p',
              text: 'Cuando compras, entras al **ask**. Pero si quisieras cerrar en ese mismo instante, tendrías que vender al **bid**, que está más abajo. Por eso, nada más abrir, tu operación muestra una pequeña pérdida igual al spread.',
            },
            {
              type: 'example',
              title: 'Una compra recién abierta',
              rows: [
                ['Compras al ask', '3350.40'],
                ['Bid en ese momento', '3350.10'],
                ['Si cerraras ahora', 'Venderías a 3350.10'],
                ['Resultado por onza', '−$0.30'],
                ['Con 10 onzas', '10 × −$0.30 = −$3.00'],
              ],
              note: 'El precio tiene que subir 0.30 solo para que quedes en cero. A partir de ahí, empiezas a ganar.',
            },
            {
              type: 'p',
              text: 'Con una venta ocurre lo mismo, pero al revés: entras al bid y, para cerrar, tienes que comprar al ask.',
            },
          ],
        },
        {
          heading: 'Qué precio se usa en cada momento',
          blocks: [
            {
              type: 'table',
              headers: ['Operación', 'Abres al…', 'Cierras al…'],
              rows: [
                ['Compra', 'Ask (el más alto)', 'Bid (el más bajo)'],
                ['Venta', 'Bid (el más bajo)', 'Ask (el más alto)'],
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              title: 'Las ventas y el gráfico',
              text: 'Muchas plataformas dibujan el gráfico con el precio **bid**. Como una venta se cierra al **ask**, que está 0.30 por encima, su stop puede activarse aunque en el gráfico parezca que el precio «no ha llegado». Deja siempre algo de margen por el spread.',
            },
          ],
        },
        {
          heading: 'El spread en la práctica',
          blocks: [
            {
              type: 'p',
              text: 'El spread pesa más cuanto más pequeño es tu objetivo. En operaciones que buscan pocos dólares de movimiento, el coste de entrar se come una parte importante del beneficio.',
            },
            {
              type: 'example',
              title: 'Peso del spread según el objetivo',
              rows: [
                ['Objetivo de $2', '0.30 ÷ 2 = 15% del objetivo se va en spread'],
                ['Objetivo de $5', '0.30 ÷ 5 = 6%'],
                ['Objetivo de $10', '0.30 ÷ 10 = 3%'],
              ],
              note: 'Por eso, al empezar, conviene evitar objetivos minúsculos.',
            },
            {
              type: 'p',
              text: 'Algunos brókers cobran además una **comisión** por operación, y casi todos aplican un **swap**: un pequeño cargo o abono por mantener una posición abierta de un día para otro. En el simulador nos centramos en el spread fijo de 0.30.',
            },
            {
              type: 'callout',
              tone: 'tip',
              text: 'En cuentas reales, evita abrir operaciones justo en la pausa diaria o en la apertura del lunes: es cuando el spread suele ser más amplio.',
            },
          ],
        },
      ],
      keyPoints: [
        'Bid es el precio al que vendes; ask es el precio al que compras.',
        'Spread = ask − bid: es el coste de entrar en cada operación.',
        'Toda operación nace con una pequeña pérdida igual al spread.',
        'En el simulador el spread es fijo de 0.30; en cuentas reales puede ensancharse.',
      ],
      quiz: [
        {
          q: 'El bid es 3348.20 y el ask es 3348.50. ¿Cuál es el spread?',
          options: ['0.20', '0.50', '3348.50', '0.30'],
          answer: 3,
          explain: 'Spread = ask − bid = 3348.50 − 3348.20 = 0.30.',
        },
        {
          q: '¿A qué precio se abre una compra?',
          options: [
            'Al ask',
            'Al bid',
            'Al precio de cierre del día anterior',
          ],
          answer: 0,
          explain: 'Compras al ask, el precio más alto de los dos. Para cerrar esa compra venderás al bid.',
        },
        {
          q: '¿Por qué una operación recién abierta muestra una pequeña pérdida?',
          options: [
            'Porque el precio siempre se mueve en tu contra al abrir',
            'Porque la plataforma cobra intereses por adelantado',
            'Porque entras a un precio y la posición se valora al otro: la diferencia es el spread',
          ],
          answer: 2,
          explain: 'Una compra entra al ask y se valoraría al bid si la cerraras ahora. Esa diferencia es el spread.',
        },
        {
          q: '¿Cuándo suele ensancharse el spread en una cuenta real?',
          options: [
            'Nunca: siempre es igual',
            'En la pausa diaria, en la apertura del lunes o con noticias fuertes',
            'Solo cuando el precio sube',
          ],
          answer: 1,
          explain: 'Cuando hay poca actividad o mucha incertidumbre, los precios de compra y venta se separan más.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n1-lotes-y-valor',
      title: 'Lotes, onzas y cuánto vale cada movimiento',
      summary: 'Sabrás qué es un lote, cuánto ganas o pierdes por cada dólar que se mueve el oro y por qué en esta academia medimos en dólares y no en pips.',
      minutes: 9,
      sections: [
        {
          heading: 'Qué es un lote',
          blocks: [
            {
              type: 'p',
              text: 'En trading no decides «cuánto dinero meto», sino **qué tamaño de posición abres**. Ese tamaño se mide en **lotes**. En XAU/USD, **1 lote estándar = 100 onzas** de oro.',
            },
            {
              type: 'table',
              headers: ['Lotes', 'Nombre habitual', 'Onzas'],
              rows: [
                ['1.00', 'Lote estándar', '100'],
                ['0.10', 'Minilote', '10'],
                ['0.01', 'Microlote', '1'],
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: 'En el simulador puedes elegir desde **0.01 hasta 10 lotes**. Empezar con 0.01 (una sola onza) es la forma de aprender con el menor impacto posible.',
            },
          ],
        },
        {
          heading: 'Cuánto vale cada dólar de movimiento',
          blocks: [
            {
              type: 'p',
              text: 'El precio de XAU/USD es por onza. Si el oro se mueve $1 y tienes 100 onzas, tu posición cambia $100. Si tienes 1 onza, cambia $1. Así de directo.',
            },
            {
              type: 'formula',
              label: 'Valor de cada $1 de movimiento',
              expr: 'Valor por $1 = lotes × 100',
              note: 'El resultado son los dólares que gana o pierde tu cuenta por cada dólar que se mueve el precio.',
            },
            {
              type: 'table',
              headers: ['Lotes', 'Onzas', 'Valor por cada $1', 'Valor por cada $0.10'],
              rows: [
                ['1.00', '100', '$100', '$10'],
                ['0.50', '50', '$50', '$5'],
                ['0.10', '10', '$10', '$1'],
                ['0.01', '1', '$1', '$0.10'],
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: 'El precio del oro (3000, 3300 o 3500) no cambia el valor de cada dólar de movimiento. Lo que importa es **cuántos lotes** tienes.',
            },
          ],
        },
        {
          heading: 'Calcular la ganancia o la pérdida',
          blocks: [
            {
              type: 'formula',
              label: 'Resultado de una operación',
              expr: 'Resultado = movimiento en $ × lotes × 100',
              note: 'El movimiento es la distancia entre el precio de entrada y el de salida. Es positivo si fue a tu favor y negativo si fue en tu contra.',
            },
            {
              type: 'example',
              title: 'Compra de 0.10 lotes que sale bien',
              rows: [
                ['Entrada (compra)', '3340.00'],
                ['Salida', '3346.50'],
                ['Movimiento', '+$6.50 a tu favor'],
                ['Valor por $1', '0.10 × 100 = $10'],
                ['Resultado', '6.50 × $10 = +$65'],
              ],
              note: 'Son precios de ejecución, así que el spread ya está incluido.',
            },
            {
              type: 'example',
              title: 'Venta de 0.05 lotes que sale mal',
              rows: [
                ['Entrada (venta)', '3352.00'],
                ['Salida', '3356.00'],
                ['Movimiento', '$4.00 en tu contra (el precio subió)'],
                ['Valor por $1', '0.05 × 100 = $5'],
                ['Resultado', '4 × $5 = −$20'],
              ],
            },
          ],
        },
        {
          heading: 'Puntos y pips: por qué aquí hablamos en dólares',
          blocks: [
            {
              type: 'p',
              text: 'En foros y vídeos oirás hablar de **pips** y **puntos**. El problema es que, en el oro, las plataformas no se ponen de acuerdo. Muchas llaman **punto** a $0.01 (el cambio mínimo del precio) y **pip** a $0.10; otras usan esas palabras para cantidades distintas. Dos personas pueden decir «50 pips» y estar hablando de movimientos diferentes.',
            },
            {
              type: 'example',
              title: 'El mismo movimiento con distintos nombres',
              rows: [
                ['El precio pasa de 3350.00 a 3355.00', 'Movimiento de $5'],
                ['Contado en puntos de $0.01', '5 ÷ 0.01 = 500 puntos'],
                ['Contado en pips de $0.10', '5 ÷ 0.10 = 50 pips'],
                ['Como lo diremos en esta academia', '«Un movimiento de $5»'],
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              title: 'Nuestra regla',
              text: 'En esta academia medimos siempre las distancias en **dólares de precio**: «un stop a $5», «un objetivo a $10». Así no hay confusión, uses la plataforma que uses.',
            },
          ],
        },
        {
          heading: 'El tamaño es tu volante',
          blocks: [
            {
              type: 'p',
              text: 'Con una cuenta de $10,000, abrir 1 lote significa ganar o perder $100 por cada dólar que se mueva el oro. Un movimiento de $20 en tu contra, algo que el oro puede hacer en pocas horas, costaría $2,000.',
            },
            {
              type: 'example',
              title: 'Un movimiento de $20 en contra con distintos tamaños',
              rows: [
                ['Con 1.00 lote', '20 × $100 = −$2,000 (20% de $10,000)'],
                ['Con 0.10 lotes', '20 × $10 = −$200 (2%)'],
                ['Con 0.01 lotes', '20 × $1 = −$20 (0.2%)'],
              ],
              note: 'El mercado hace lo mismo en los tres casos. Lo que cambia la historia es el tamaño que elegiste.',
            },
            {
              type: 'p',
              text: 'En el nivel 2 aprenderás a calcular el tamaño exacto a partir de cuánto quieres arriesgar. Por ahora, quédate con la idea: **el tamaño decide cuánto te afecta cada movimiento**.',
            },
          ],
        },
      ],
      keyPoints: [
        '1 lote estándar = 100 onzas; 0.10 lotes = 10 onzas; 0.01 lotes = 1 onza.',
        'Valor por cada $1 de movimiento = lotes × 100.',
        'Resultado = movimiento en $ × lotes × 100.',
        'En esta academia medimos las distancias en dólares de precio, no en pips ni puntos.',
      ],
      quiz: [
        {
          q: '¿Cuántas onzas son 0.10 lotes de XAU/USD?',
          options: ['1', '10', '100', '0.10'],
          answer: 1,
          explain: '1 lote = 100 onzas, así que 0.10 lotes = 0.10 × 100 = 10 onzas.',
        },
        {
          q: 'Tienes una posición de 0.20 lotes y el precio se mueve $3 a tu favor. ¿Cuánto ganas?',
          options: ['$6', '$600', '$60', '$20'],
          answer: 2,
          explain: 'Valor por $1 = 0.20 × 100 = $20. Resultado = 3 × $20 = $60.',
        },
        {
          q: '¿Por qué en esta academia medimos las distancias en dólares de precio?',
          options: [
            'Porque las plataformas no se ponen de acuerdo en cuánto vale un pip o un punto en el oro',
            'Porque los pips solo existen en las acciones',
            'Porque el dólar es más estable que el oro',
          ],
          answer: 0,
          explain: 'Unas plataformas llaman pip a $0.10 y otras a otra cantidad. Hablar de «un stop a $5» evita cualquier confusión.',
        },
        {
          q: 'Vendes 0.05 lotes en 3310.00 y cierras en 3316.00. ¿Cuál es el resultado?',
          options: ['+$30', '−$300', '−$3', '−$30'],
          answer: 3,
          explain: 'En una venta, si el precio sube vas perdiendo. Subió $6: 6 × (0.05 × 100) = 6 × $5 = −$30.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n1-apalancamiento-margen',
      title: 'Apalancamiento y margen sin sustos',
      summary: 'Entenderás qué es el apalancamiento, cómo se calcula el margen y por qué el apalancamiento no cambia tu riesgo, pero sí puede tentarte a abrir posiciones demasiado grandes.',
      minutes: 9,
      sections: [
        {
          heading: 'Qué es el apalancamiento',
          blocks: [
            {
              type: 'p',
              text: 'El **apalancamiento** te permite abrir posiciones mucho mayores que el dinero que tienes en la cuenta. El bróker no te pide el valor completo de la posición: solo una parte, que queda bloqueada como garantía. Esa parte se llama **margen**.',
            },
            {
              type: 'p',
              text: 'El apalancamiento se expresa como una proporción: 1:20, 1:50, 1:100… Con **1:100**, por cada $1 de margen controlas $100 de posición.',
            },
            {
              type: 'callout',
              tone: 'tip',
              text: 'El apalancamiento máximo depende del bróker, del país y del tipo de cliente. En algunas jurisdicciones, el máximo para el oro en clientes particulares es 1:20.',
            },
          ],
        },
        {
          heading: 'Valor de la posición y margen',
          blocks: [
            {
              type: 'formula',
              label: 'Valor de la posición',
              expr: 'Valor = lotes × 100 × precio',
            },
            {
              type: 'formula',
              label: 'Margen necesario',
              expr: 'Margen = valor de la posición ÷ apalancamiento',
            },
            {
              type: 'example',
              title: '0.10 lotes a 3350.00 con apalancamiento 1:100',
              rows: [
                ['Onzas', '0.10 × 100 = 10 onzas'],
                ['Valor de la posición', '10 × 3350.00 = $33,500'],
                ['Apalancamiento', '1:100'],
                ['Margen', '33,500 ÷ 100 = $335'],
              ],
              note: 'Con $10,000 en la cuenta, esos $335 quedan reservados como garantía mientras la operación esté abierta. No es un coste: se libera al cerrar.',
            },
            {
              type: 'example',
              title: 'La misma posición con 1:20',
              rows: [
                ['Valor de la posición', '$33,500'],
                ['Margen', '33,500 ÷ 20 = $1,675'],
              ],
            },
          ],
        },
        {
          heading: 'Lo más importante: el apalancamiento no cambia tu riesgo',
          blocks: [
            {
              type: 'p',
              text: 'Es muy común pensar que más apalancamiento significa más riesgo. Pero lo que decide cuánto puedes perder en una operación es el **tamaño de la posición** y la **distancia al stop loss** (la orden que cierra la operación si va en tu contra; la verás en la próxima lección).',
            },
            {
              type: 'example',
              title: 'Dos cuentas, mismo riesgo',
              rows: [
                ['Posición', '0.10 lotes en ambas'],
                ['Stop loss', 'A $5 de la entrada'],
                ['Pérdida si se activa el stop', '5 × 0.10 × 100 = $50'],
                ['Margen con 1:100', '$335'],
                ['Margen con 1:20', '$1,675'],
                ['Conclusión', 'Pierdes $50 en los dos casos'],
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: 'El apalancamiento cambia el **margen** (cuánto dinero queda bloqueado), no el **riesgo**. El riesgo lo fijas tú con el tamaño y el stop.',
            },
            {
              type: 'p',
              text: '¿Dónde está el peligro, entonces? En que un apalancamiento alto te **permite** abrir posiciones enormes con poco dinero. La verdadera trampa es la tentación de abrir 2 lotes con una cuenta de $10,000 «porque se puede».',
            },
          ],
        },
        {
          heading: 'Equity, margen libre y stop out',
          blocks: [
            {
              type: 'list',
              items: [
                '**Balance**: el dinero de la cuenta sin contar las operaciones abiertas.',
                '**Equity** (patrimonio): el balance más o menos lo que van ganando o perdiendo las operaciones abiertas.',
                '**Margen usado**: la suma del margen de todas tus posiciones abiertas.',
                '**Margen libre**: equity − margen usado. Es lo que te queda para abrir otras posiciones o para soportar pérdidas.',
              ],
            },
            {
              type: 'example',
              title: 'Una cuenta con una posición abierta',
              rows: [
                ['Balance', '$10,000'],
                ['Posición abierta', '0.10 lotes, ahora perdiendo $150'],
                ['Equity', '10,000 − 150 = $9,850'],
                ['Margen usado (1:100)', '$335'],
                ['Margen libre', '9,850 − 335 = $9,515'],
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              title: 'Margin call y stop out',
              text: 'Si las pérdidas abiertas se comen casi todo el margen libre, el bróker te avisa (**margin call**) y, si la situación empeora, cierra tus posiciones automáticamente (**stop out**). Los umbrales exactos varían según el bróker. Con un stop loss y un tamaño razonable nunca deberías acercarte a ese punto.',
            },
          ],
        },
        {
          heading: 'Un ejemplo de lo que no hay que hacer',
          blocks: [
            {
              type: 'example',
              title: 'Abrir demasiado porque el margen lo permite',
              rows: [
                ['Cuenta', '$10,000'],
                ['Posición', '2.00 lotes (200 onzas)'],
                ['Valor a 3350.00', '200 × 3350.00 = $670,000'],
                ['Margen con 1:100', '670,000 ÷ 100 = $6,700'],
                ['Movimiento en contra de $25', '25 × 200 = −$5,000'],
                ['Impacto en la cuenta', 'Pierdes el 50% del balance'],
              ],
              note: 'El margen alcanzaba; la pérdida fue devastadora. Que el bróker te deje abrir una posición no significa que debas hacerlo.',
            },
            {
              type: 'p',
              text: 'En el simulador, el panel de órdenes te muestra el **riesgo en $ y en %** antes de pulsar Comprar o Vender. Úsalo como freno: si el número te asusta, el tamaño es demasiado grande.',
            },
          ],
        },
      ],
      keyPoints: [
        'Con apalancamiento 1:100, cada $1 de margen controla $100 de posición.',
        'Margen = valor de la posición ÷ apalancamiento (0.10 lotes a 3350.00 con 1:100 = $335).',
        'El apalancamiento cambia el margen, no el riesgo: el riesgo depende del tamaño y del stop.',
        'El peligro real es usar el apalancamiento para abrir posiciones demasiado grandes.',
      ],
      quiz: [
        {
          q: 'El precio es 3200.00 y abres 0.10 lotes con apalancamiento 1:100. ¿Qué margen necesitas?',
          options: ['$32', '$3,200', '$320', '$32,000'],
          answer: 2,
          explain: 'Valor = 0.10 × 100 × 3200.00 = $32,000. Margen = 32,000 ÷ 100 = $320.',
        },
        {
          q: 'Dos personas abren 0.10 lotes con un stop a $5. Una usa 1:100 y otra 1:30. ¿Quién arriesga más?',
          options: [
            'Las dos arriesgan lo mismo: $50',
            'La que usa 1:100',
            'La que usa 1:30',
          ],
          answer: 0,
          explain: 'El riesgo es distancia al stop × lotes × 100 = 5 × 0.10 × 100 = $50 en ambos casos. El apalancamiento solo cambia el margen bloqueado.',
        },
        {
          q: '¿Qué es el margen?',
          options: [
            'La comisión que pagas por cada operación ganadora',
            'El dinero que el bróker reserva como garantía mientras la posición está abierta',
            'La diferencia entre el bid y el ask',
          ],
          answer: 1,
          explain: 'El margen es una garantía bloqueada, no un coste. Se libera al cerrar la operación.',
        },
        {
          q: '¿Qué ocurre en un stop out?',
          options: [
            'El bróker te concede más apalancamiento',
            'La operación se cierra con ganancia',
            'Se activa tu take profit',
            'El bróker cierra posiciones automáticamente porque el margen ya no alcanza',
          ],
          answer: 3,
          explain: 'Cuando las pérdidas abiertas dejan la cuenta sin margen suficiente, el bróker cierra posiciones para limitar las pérdidas antes de que la cuenta se quede sin fondos.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n1-tipos-de-ordenes',
      title: 'Tipos de órdenes, stop loss y take profit',
      summary: 'Conocerás las órdenes a mercado y pendientes, y aprenderás a colocar un stop loss y un take profit para saber de antemano cuánto puedes ganar o perder.',
      minutes: 9,
      sections: [
        {
          heading: 'Órdenes a mercado',
          blocks: [
            {
              type: 'p',
              text: 'Una **orden** es la instrucción que le das a la plataforma para abrir o cerrar una posición. La más sencilla es la **orden a mercado**: compras o vendes ahora mismo, al mejor precio disponible (al ask si compras, al bid si vendes).',
            },
            {
              type: 'callout',
              tone: 'tip',
              title: 'Deslizamiento',
              text: 'Cuando el mercado se mueve muy rápido, el precio al que se ejecuta tu orden puede ser algo distinto del que veías al pulsar. A esa diferencia se le llama **deslizamiento** («slippage»).',
            },
            {
              type: 'p',
              text: 'En el simulador de esta app abrirás las operaciones a mercado, con los botones **Comprar** y **Vender**.',
            },
          ],
        },
        {
          heading: 'Órdenes pendientes',
          blocks: [
            {
              type: 'p',
              text: 'Una **orden pendiente** se queda esperando hasta que el precio llega a un nivel que tú eliges. Si el precio nunca llega, la operación no se abre. Hay cuatro tipos:',
            },
            {
              type: 'table',
              headers: ['Orden', 'Qué hace', 'Cuándo se usa'],
              rows: [
                ['Buy Limit', 'Compra por debajo del precio actual', 'Quieres comprar más barato, en una bajada'],
                ['Sell Limit', 'Vende por encima del precio actual', 'Quieres vender más caro, en una subida'],
                ['Buy Stop', 'Compra por encima del precio actual', 'Quieres comprar si el precio rompe hacia arriba'],
                ['Sell Stop', 'Vende por debajo del precio actual', 'Quieres vender si el precio rompe hacia abajo'],
              ],
            },
            {
              type: 'example',
              title: 'Una Buy Limit de ejemplo',
              rows: [
                ['Precio actual', '3350.00'],
                ['Colocas una Buy Limit en', '3342.00'],
                ['Si el precio baja hasta 3342.00', 'Se abre la compra automáticamente'],
                ['Si el precio nunca baja tanto', 'No se abre nada'],
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              title: 'Para no confundirte',
              text: '**Limit** = esperas un precio mejor (comprar más bajo o vender más alto). **Stop** = esperas que el precio confirme un movimiento (comprar más alto o vender más bajo).',
            },
          ],
        },
        {
          heading: 'Stop loss: tu salida de emergencia',
          blocks: [
            {
              type: 'p',
              text: 'El **stop loss** (SL) es una orden que cierra tu posición automáticamente si el precio va en tu contra hasta un nivel. Sirve para **decidir tu pérdida máxima antes de entrar**, con la cabeza fría.',
            },
            {
              type: 'p',
              text: 'En una **compra**, el stop loss va **por debajo** del precio de entrada. En una **venta**, va **por encima**.',
            },
            {
              type: 'example',
              title: 'Stop loss en una compra',
              rows: [
                ['Compra en', '3350.00'],
                ['Stop loss en', '3345.00'],
                ['Distancia al stop', '$5'],
                ['Tamaño', '0.10 lotes'],
                ['Pérdida si se activa', '5 × 0.10 × 100 = $50'],
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              text: 'Nunca alejes el stop loss cuando el precio se acerca a él «para darle más espacio». Es la forma más habitual de convertir una pérdida pequeña en una grande. Ten en cuenta también que, en un hueco o en un movimiento muy brusco, el stop puede ejecutarse a un precio algo peor.',
            },
          ],
        },
        {
          heading: 'Take profit y relación riesgo/beneficio',
          blocks: [
            {
              type: 'p',
              text: 'El **take profit** (TP) cierra la posición automáticamente cuando el precio alcanza tu objetivo de ganancia. En una compra va **por encima** de la entrada; en una venta, **por debajo**.',
            },
            {
              type: 'figure',
              name: 'risk-reward',
              caption: 'Entrada, stop loss y take profit: arriesgas una distancia para intentar ganar el doble (R:R 1:2).',
            },
            {
              type: 'example',
              title: 'Una compra completa',
              rows: [
                ['Compra en', '3350.00'],
                ['Stop loss', '3345.00 (riesgo de $5)'],
                ['Take profit', '3360.00 (objetivo de $10)'],
                ['Relación riesgo/beneficio', '10 ÷ 5 = 2 → 1:2'],
                ['Con 0.10 lotes', 'Arriesgas $50 para intentar ganar $100'],
              ],
            },
            {
              type: 'p',
              text: 'La **relación riesgo/beneficio** (R:R) compara lo que arriesgas con lo que buscas ganar. La estudiarás a fondo en el nivel 2.',
            },
          ],
        },
        {
          heading: 'El caso de la venta',
          blocks: [
            {
              type: 'example',
              title: 'Una venta completa',
              rows: [
                ['Venta en', '3340.00'],
                ['Stop loss', '3346.00 ($6 por encima)'],
                ['Take profit', '3328.00 ($12 por debajo)'],
                ['Relación riesgo/beneficio', '12 ÷ 6 = 2 → 1:2'],
                ['Con 0.05 lotes', 'Riesgo 6 × $5 = $30; objetivo 12 × $5 = $60'],
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              title: 'Obligatorios en el simulador',
              text: 'En el simulador no puedes abrir una operación sin stop loss y take profit. Es a propósito: definir la salida antes de entrar es el hábito más importante que vas a construir en esta academia.',
            },
          ],
        },
      ],
      keyPoints: [
        'Una orden a mercado entra ya; una orden pendiente espera a que el precio llegue a un nivel.',
        'Limit busca un precio mejor; Stop espera la confirmación del movimiento.',
        'El stop loss limita la pérdida y el take profit asegura el objetivo, ambos definidos antes de entrar.',
        'En una compra el SL va debajo y el TP encima; en una venta, al revés.',
        'En el simulador, el stop loss y el take profit son obligatorios.',
      ],
      quiz: [
        {
          q: 'El precio está en 3350.00 y quieres comprar solo si baja hasta 3340.00. ¿Qué orden usas?',
          options: ['Buy Stop', 'Sell Limit', 'Buy Limit', 'Sell Stop'],
          answer: 2,
          explain: 'Una Buy Limit compra por debajo del precio actual: esperas un precio mejor.',
        },
        {
          q: 'Abres una venta en 3320.00. ¿Dónde va el stop loss?',
          options: [
            'Por encima de la entrada, por ejemplo en 3326.00',
            'Por debajo de la entrada, por ejemplo en 3314.00',
            'En el mismo precio de entrada',
          ],
          answer: 0,
          explain: 'En una venta pierdes si el precio sube, así que el stop loss se coloca por encima de la entrada.',
        },
        {
          q: 'Compras 0.10 lotes en 3300.00 con el stop loss en 3296.00. ¿Cuánto pierdes si se activa?',
          options: ['$4', '$40', '$400'],
          answer: 1,
          explain: 'Distancia = $4. Pérdida = 4 × 0.10 × 100 = $40.',
        },
        {
          q: '¿Cuál de estas prácticas con el stop loss es la más peligrosa?',
          options: [
            'Colocarlo antes de entrar',
            'Calcular la pérdida posible antes de abrir',
            'Anotarlo en tu diario',
            'Alejarlo cuando el precio se acerca para «darle más espacio»',
          ],
          answer: 3,
          explain: 'Mover el stop en contra de tu plan rompe tu límite de pérdida y puede convertir una pérdida pequeña en una grande.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n1-sesiones',
      title: 'Cuándo se mueve el oro: las sesiones del mercado',
      summary: 'Conocerás las sesiones de Asia, Londres y Nueva York, cuándo suele haber más movimiento y cómo afectan las noticias, las pausas y los fines de semana.',
      minutes: 8,
      sections: [
        {
          heading: 'Un mercado que sigue al sol',
          blocks: [
            {
              type: 'p',
              text: 'El oro se negocia casi 24 horas de lunes a viernes porque los grandes centros financieros del mundo se van pasando el relevo a medida que avanza el día. Cada uno de esos tramos se llama **sesión**.',
            },
            {
              type: 'figure',
              name: 'sessions',
              caption: 'Las tres grandes sesiones en hora UTC (invierno): Asia, Londres y Nueva York, con el solape Londres–Nueva York.',
            },
            {
              type: 'callout',
              tone: 'tip',
              title: '¿Qué es UTC?',
              text: '**UTC** es la hora universal de referencia. Para convertirla a la tuya: Madrid es UTC+1 en invierno (UTC+2 en verano); Ciudad de México, UTC−6; Bogotá y Lima, UTC−5; Buenos Aires, UTC−3.',
            },
          ],
        },
        {
          heading: 'Las tres sesiones principales',
          blocks: [
            {
              type: 'table',
              headers: ['Sesión', 'Horario aprox. (UTC, invierno)', 'Carácter habitual'],
              rows: [
                ['Asia (Tokio)', '00:00–09:00', 'Movimientos más tranquilos, a menudo dentro de un rango'],
                ['Londres', '08:00–17:00', 'Entra mucho volumen; a menudo marca la dirección del día'],
                ['Nueva York', '13:00–22:00', 'Datos de EE. UU. y movimientos fuertes'],
                ['Solape Londres–Nueva York', '13:00–17:00', 'Normalmente la franja más volátil para el oro'],
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              title: 'Horario de verano',
              text: 'Estos horarios se desplazan **una hora** cuando Europa y EE. UU. cambian al horario de verano: en hora UTC, Londres y Nueva York empiezan una hora antes. Además, Europa y EE. UU. no cambian de hora el mismo día, así que durante unas semanas al año el desfase entre ellas es distinto.',
            },
          ],
        },
        {
          heading: 'Por qué importa la hora',
          blocks: [
            {
              type: 'p',
              text: 'La **volatilidad** es cuánto se mueve el precio en un periodo de tiempo. Más volatilidad significa más oportunidades, pero también que tu stop puede alcanzarse antes y que el deslizamiento es mayor.',
            },
            {
              type: 'example',
              title: 'El mismo stop en dos momentos distintos',
              rows: [
                ['Stop a $3 en una sesión asiática tranquila', 'Puede aguantar horas sin ser tocado'],
                ['Stop a $3 en el solape Londres–Nueva York', 'Un movimiento normal puede alcanzarlo en minutos'],
                ['Conclusión', 'Adapta la distancia del stop, y con ella el tamaño, al momento del día'],
              ],
            },
            {
              type: 'p',
              text: 'No existe una «mejor hora» universal: depende de tu estilo y de cuándo puedes estar delante de la pantalla. Pero conocer las sesiones te evita sorpresas.',
            },
          ],
        },
        {
          heading: 'Noticias económicas: picos de volatilidad',
          blocks: [
            {
              type: 'p',
              text: 'Los datos económicos importantes de EE. UU. suelen publicarse a las **8:30, hora de Nueva York** (13:30 UTC en invierno; 12:30 UTC en verano). El más conocido es el informe de empleo, el **NFP** («Non-Farm Payrolls», nóminas no agrícolas), que normalmente sale el primer viernes de cada mes. También mueven mucho el oro los datos de inflación y las decisiones de tipos de interés de la Reserva Federal.',
            },
            {
              type: 'list',
              items: [
                'Consulta un **calendario económico** antes de empezar a operar cada día.',
                'Si estás empezando, evita abrir operaciones justo antes de un dato importante.',
                'Recuerda que, alrededor de las noticias, el spread real puede ensancharse y el stop ejecutarse a peor precio.',
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              text: 'Un dato importante puede mover el oro muchos dólares en cuestión de minutos, en cualquier dirección. Ningún análisis previo te protege de eso; lo que te protege es un stop loss y un tamaño pequeño.',
            },
          ],
        },
        {
          heading: 'Pausas, fines de semana y huecos',
          blocks: [
            {
              type: 'p',
              text: 'Cada día hay una **pausa corta**, de alrededor de una hora, poco después del cierre de Nueva York (el horario exacto depende del bróker). El fin de semana el mercado cierra. Al reabrir, el precio puede saltar y dejar un **hueco** en el gráfico.',
            },
            {
              type: 'example',
              title: 'Un hueco de fin de semana',
              rows: [
                ['Tienes una venta abierta con stop en', '3334.00'],
                ['Cierre del viernes', '3330.00'],
                ['Primer precio del lunes', '3338.00'],
                ['Qué pasa con tu stop', 'Se ejecuta al primer precio disponible, cerca de 3338.00'],
                ['Diferencia con lo previsto', '3338.00 − 3334.00 = $4 peor por onza'],
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              title: 'Obsérvalo tú mismo',
              text: 'En el simulador, usa el marco temporal **H1** (velas de una hora) y el **modo replay** para ver cómo cambia el tamaño de las velas cuando abren Londres y Nueva York.',
            },
          ],
        },
      ],
      keyPoints: [
        'Sesiones aproximadas (UTC, invierno): Asia 00:00–09:00, Londres 08:00–17:00, Nueva York 13:00–22:00.',
        'El solape Londres–Nueva York (13:00–17:00 UTC) suele ser la franja más volátil para el oro.',
        'Con el horario de verano, estos horarios se desplazan una hora.',
        'Los grandes datos de EE. UU., como el NFP, salen a las 8:30 de Nueva York y pueden mover mucho el precio.',
        'Pausas y fines de semana pueden dejar huecos y spreads más amplios.',
      ],
      quiz: [
        {
          q: '¿Qué franja suele ser la más volátil para el oro?',
          options: [
            'La sesión asiática',
            'La pausa diaria',
            'El solape Londres–Nueva York',
            'El sábado por la tarde',
          ],
          answer: 2,
          explain: 'Entre las 13:00 y las 17:00 UTC (en invierno) coinciden Londres y Nueva York, y además salen muchos datos de EE. UU.',
        },
        {
          q: 'Un dato se publica a las 8:30 de Nueva York. ¿Qué hora UTC es en invierno?',
          options: ['08:30', '13:30', '17:30', '22:30'],
          answer: 1,
          explain: 'En invierno Nueva York está en UTC−5, así que 8:30 + 5 horas = 13:30 UTC.',
        },
        {
          q: '¿Qué puede pasar con tu stop loss si hay un hueco el lunes?',
          options: [
            'Que se ejecute a un precio peor que el previsto',
            'Que se cancele automáticamente',
            'Que se ejecute siempre exactamente en su precio',
          ],
          answer: 0,
          explain: 'Si el precio salta por encima (o por debajo) de tu stop sin cotizar en medio, se ejecuta al primer precio disponible.',
        },
        {
          q: '¿Por qué te conviene conocer las sesiones del mercado?',
          options: [
            'Porque en cada sesión el oro cotiza en una moneda distinta',
            'Porque fuera de la sesión de Londres no se puede operar',
            'Porque en Nueva York el spread siempre es cero',
            'Porque la volatilidad cambia según la hora y afecta a tus stops',
          ],
          answer: 3,
          explain: 'El mismo stop puede ser cómodo en un momento tranquilo y demasiado ajustado en una franja volátil.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n1-primera-operacion',
      title: 'Tu primera operación en el simulador',
      summary: 'Abrirás tu primera operación paso a paso: tamaño, stop loss, take profit, motivo escrito y lectura del resultado.',
      minutes: 8,
      sections: [
        {
          heading: 'Qué vas a hacer y cómo funciona el simulador',
          blocks: [
            {
              type: 'p',
              text: 'Ha llegado el momento de juntar todo lo aprendido. Vas a abrir tu primera operación en una cuenta de práctica de **$10,000**, sin dinero real. El objetivo no es ganar: es **seguir el proceso completo** y entender el resultado.',
            },
            {
              type: 'list',
              items: [
                'Instrumento: **XAU/USD**, con un spread fijo de **0.30**.',
                'Tamaño: desde **0.01 hasta 10 lotes**.',
                'El **stop loss** y el **take profit** son obligatorios.',
                'Al pulsar **Comprar** o **Vender**, el simulador reproduce una ventana de **velas H1 históricas reales** y comprueba qué se alcanza primero, el SL o el TP, durante un máximo de **200 velas H1**.',
                'Si no se alcanza ninguno, la operación se cierra al **último precio** de esa ventana.',
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              title: 'Reglas de esta práctica',
              text: 'Riesgo máximo del **2%** del balance y **motivo escrito obligatorio**. El simulador lo comprueba automáticamente.',
            },
          ],
        },
        {
          heading: 'Paso 1: prepara el gráfico',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                'Abre el simulador y selecciona el marco temporal **H1**: cada vela representa una hora.',
                'Observa las últimas velas. ¿El precio sube, baja o va de lado?',
                'Con la herramienta **línea horizontal**, marca el último máximo y el último mínimo que veas claros.',
                'Decide la dirección: comprar o vender.',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: 'Si todavía no sabes interpretar el gráfico, no pasa nada: lo aprenderás en los próximos niveles. Hoy lo que cuenta es el proceso, no acertar la dirección.',
            },
          ],
        },
        {
          heading: 'Paso 2: tamaño, stop y objetivo',
          blocks: [
            {
              type: 'p',
              text: 'Elige un tamaño de **0.01 lotes**: una onza, es decir, $1 por cada dólar que se mueva el precio. Después coloca el stop loss y el take profit.',
            },
            {
              type: 'example',
              title: 'Una compra de práctica (precios de ejemplo)',
              rows: [
                ['Dirección', 'Compra'],
                ['Entrada (ask)', '3350.40'],
                ['Stop loss', '3345.40 (a $5)'],
                ['Take profit', '3360.40 (a $10)'],
                ['Tamaño', '0.01 lotes'],
                ['Riesgo', '5 × 0.01 × 100 = $5 (0.05% de $10,000)'],
                ['Beneficio posible', '10 × 0.01 × 100 = $10'],
                ['R:R', '10 ÷ 5 → 1:2'],
              ],
            },
            {
              type: 'p',
              text: 'Antes de pulsar nada, mira el panel de órdenes: verás el **riesgo en $ y en %**, la **relación R:R** y el **checklist del setup**. Si el riesgo supera el 2%, reduce el tamaño o acerca el stop.',
            },
            {
              type: 'callout',
              tone: 'warning',
              text: 'Un stop demasiado ajustado, por ejemplo a $0.50, puede saltar por el movimiento normal del precio y por el propio spread de 0.30. Deja un margen razonable.',
            },
          ],
        },
        {
          heading: 'Paso 3: escribe por qué',
          blocks: [
            {
              type: 'p',
              text: 'En el campo **«¿Por qué abres esta operación?»** escribe tu motivo en una o dos frases. Hacerlo te obliga a pensar antes de actuar y te deja un registro del que aprender después.',
            },
            {
              type: 'table',
              headers: ['Motivos útiles', 'Motivos que no sirven'],
              rows: [
                ['«El precio rebotó dos veces cerca de 3340.00; compro con el stop debajo de ese mínimo.»', '«Presiento que va a subir.»'],
                ['«Practico el proceso: entrada a mercado, SL a $5, TP a $10.»', '«Quiero recuperar lo de ayer.»'],
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: 'En tu primera operación es perfectamente válido escribir que estás practicando el proceso. Lo importante es ser honesto contigo.',
            },
          ],
        },
        {
          heading: 'Paso 4: pulsa y lee el resultado',
          blocks: [
            {
              type: 'p',
              text: 'Pulsa **Comprar** o **Vender**. El simulador reproducirá las velas y te mostrará cómo terminó la operación:',
            },
            {
              type: 'table',
              headers: ['Resultado', 'Qué significa', 'Con el ejemplo anterior'],
              rows: [
                ['Se alcanza el TP', 'El precio llegó primero a tu objetivo', '+$10'],
                ['Se alcanza el SL', 'El precio llegó primero a tu stop', '−$5'],
                ['Ninguno en 200 velas H1', 'Se cierra al último precio', 'Una ganancia o pérdida menor, según dónde termine'],
              ],
            },
            {
              type: 'p',
              text: 'Después, abre el **Diario**: ahí verás la operación y tus estadísticas (porcentaje de acierto, P&L, R:R medio, riesgo medio, drawdown máximo y curva de capital). Además encontrarás **retos**, como hacer 5 operaciones con riesgo de como máximo el 2%.',
            },
            {
              type: 'callout',
              tone: 'key',
              text: 'Una sola operación no dice nada sobre ti como trader: puede salir bien por suerte o mal con un plan correcto. Lo que construye resultados es repetir el proceso con disciplina.',
            },
          ],
        },
      ],
      keyPoints: [
        'Empieza con 0.01 lotes: $1 por cada dólar que se mueve el precio.',
        'Coloca stop loss y take profit antes de entrar y revisa el riesgo en $ y en % en el panel.',
        'Escribe siempre el motivo de la operación.',
        'El simulador cierra en SL, en TP o, si no toca ninguno en 200 velas H1, al último precio.',
        'Un resultado aislado no significa nada; el proceso sí.',
      ],
      quiz: [
        {
          q: 'Con 0.01 lotes y el stop a $8 de la entrada, ¿cuánto arriesgas?',
          options: ['$0.80', '$8', '$80', '$800'],
          answer: 1,
          explain: 'Riesgo = 8 × 0.01 × 100 = $8.',
        },
        {
          q: '¿Qué hace el simulador si en 200 velas H1 no se alcanza ni el SL ni el TP?',
          options: [
            'Cierra la operación al último precio',
            'La deja abierta indefinidamente',
            'La anula como si no hubiera existido',
          ],
          answer: 0,
          explain: 'Si ninguna de las dos salidas se alcanza dentro de la ventana, la operación se cierra al último precio disponible.',
        },
        {
          q: '¿Cuál de estos es un buen motivo para abrir una operación?',
          options: [
            '«Presiento que va a subir»',
            '«Necesito recuperar lo que perdí ayer»',
            '«El precio rebotó dos veces en 3340.00; compro con el stop bajo ese mínimo»',
            '«Un amigo me dijo que comprara»',
          ],
          answer: 2,
          explain: 'Un buen motivo describe lo que ves y dónde dejaría de ser válida tu idea. Las corazonadas y las ganas de recuperar no son un plan.',
        },
        {
          q: 'Tu primera operación termina en el stop loss. ¿Qué conclusión es la correcta?',
          options: [
            'El método no funciona y hay que cambiarlo',
            'Hay que duplicar el tamaño en la siguiente para recuperar',
            'La próxima vez es mejor no poner stop',
            'Una sola operación no demuestra nada: revisa si seguiste el proceso',
          ],
          answer: 3,
          explain: 'Las pérdidas forman parte del trading. Lo que debes evaluar es si respetaste tu plan, no el resultado aislado.',
        },
      ],
      practice: {
        goal: 'Abre tu primera operación en el simulador siguiendo el proceso completo, con un riesgo de como máximo el 2% del balance y escribiendo el motivo.',
        steps: [
          'Abre el simulador, elige el marco temporal H1 y observa las últimas velas de XAU/USD.',
          'Decide la dirección (comprar o vender) y marca con una línea horizontal el nivel que usarás como referencia.',
          'En el panel de órdenes, elige un tamaño de 0.01 lotes.',
          'Coloca el stop loss (por ejemplo, a $5 de la entrada) y el take profit (por ejemplo, a $10).',
          'Comprueba que el riesgo no supera el 2% y revisa la relación R:R y el checklist del setup.',
          'Escribe en «¿Por qué abres esta operación?» el motivo de tu entrada.',
          'Pulsa Comprar o Vender y observa cómo se reproducen las velas.',
          'Lee el resultado y revísalo después en el Diario.',
        ],
        rules: { maxRiskPct: 2, requireNotes: true },
      },
    },
  ],
};
