import type { Level } from './types';

export const nivel3: Level = {
  id: 'n3',
  number: 3,
  title: "Análisis técnico",
  subtitle: "Leer el gráfico con criterio",
  description:
    "Aprenderás a leer el gráfico del oro con método: velas, estructura, zonas, indicadores y varias temporalidades. Al terminar sabrás convertir esa lectura en un plan de operación con entrada, stop, objetivo y tamaño justificados.",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. Velas japonesas
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n3-velas',
      title: "Velas japonesas: qué cuenta cada vela",
      summary:
        "Aprenderás a leer la apertura, el máximo, el mínimo y el cierre de cada vela y qué te dicen su cuerpo y sus mechas.",
      minutes: 8,
      sections: [
        {
          heading: "Una vela, cuatro precios",
          blocks: [
            {
              type: 'p',
              text: "Hasta ahora has usado el gráfico sobre todo para colocar el stop y el objetivo. En este nivel aprenderás a **leerlo**. La unidad básica de lectura es la **vela japonesa**: un dibujo que resume todo lo que hizo el precio durante un periodo de tiempo.",
            },
            {
              type: 'p',
              text: "Cada vela guarda cuatro precios, que se suelen abreviar como **OHLC** por sus iniciales en inglés:",
            },
            {
              type: 'list',
              items: [
                "**Apertura** (open): el primer precio del periodo.",
                "**Máximo** (high): el precio más alto que se alcanzó.",
                "**Mínimo** (low): el precio más bajo que se alcanzó.",
                "**Cierre** (close): el último precio del periodo.",
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: "La **temporalidad** decide cuánto tiempo resume cada vela. En **H1** cada vela es una hora; en **M15**, quince minutos; en **D1**, un día completo de negociación. En el simulador cambias de temporalidad con los botones M1, M5, M15, H1, H4, D1 y W1.",
            },
          ],
        },
        {
          heading: "Cuerpo y mechas",
          blocks: [
            {
              type: 'figure',
              name: 'candle-anatomy',
              caption:
                "Anatomía de una vela alcista y una bajista: el cuerpo va de la apertura al cierre y las mechas marcan el máximo y el mínimo.",
            },
            {
              type: 'p',
              text: "El **cuerpo** es el rectángulo entre la apertura y el cierre. Si el cierre queda por encima de la apertura, la vela es **alcista**; si queda por debajo, es **bajista**. Cada plataforma usa sus colores, pero lo habitual es verde o blanco para las alcistas y rojo o negro para las bajistas.",
            },
            {
              type: 'p',
              text: "Las **mechas** (también llamadas sombras) son las líneas finas por encima y por debajo del cuerpo. Muestran hasta dónde llegó el precio y desde dónde fue **rechazado** antes del cierre.",
            },
            {
              type: 'example',
              title: "Medir una vela H1 alcista",
              rows: [
                ["Apertura", "3342.10"],
                ["Máximo", "3349.80"],
                ["Mínimo", "3338.50"],
                ["Cierre", "3347.60"],
                ["Cuerpo (cierre − apertura)", "$5.50"],
                ["Mecha superior (máximo − cierre)", "$2.20"],
                ["Mecha inferior (apertura − mínimo)", "$3.60"],
                ["Rango total (máximo − mínimo)", "$11.30"],
              ],
              note: "Cuerpo + mechas = rango total: 5.50 + 2.20 + 3.60 = 11.30. Es una vela alcista con un cuerpo amplio: los compradores dominaron la hora y el cierre quedó cerca del máximo.",
            },
          ],
        },
        {
          heading: "Qué cuenta cada forma",
          blocks: [
            {
              type: 'p',
              text: "No hace falta memorizar decenas de nombres. Basta con hacerte tres preguntas ante cada vela: ¿quién ganó (color)?, ¿con cuánta claridad (tamaño del cuerpo)? y ¿dónde hubo rechazo (mechas)?",
            },
            {
              type: 'table',
              headers: ["Lo que ves", "Lo que suele indicar"],
              rows: [
                ["Cuerpo grande, mechas cortas", "Un lado dominó todo el periodo: hay **convicción** en esa dirección."],
                ["Cuerpo pequeño, mechas a ambos lados", "**Indecisión**: compradores y vendedores se neutralizaron."],
                ["Mecha superior larga", "El precio subió pero fue rechazado: hubo **presión vendedora** arriba."],
                ["Mecha inferior larga", "El precio cayó pero fue recomprado: hubo **presión compradora** abajo."],
                ["Vela mucho más grande que las anteriores", "Entró actividad fuera de lo normal: una noticia, la apertura de una sesión o la ruptura de una zona."],
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Compara siempre una vela con sus vecinas. Una vela H1 de $6 puede ser grande en la tranquila sesión asiática y completamente normal durante el solapamiento de Londres y Nueva York.",
            },
          ],
        },
        {
          heading: "Una vela no está terminada hasta que cierra",
          blocks: [
            {
              type: 'p',
              text: "La última vela del gráfico está **en formación**: su máximo, su mínimo y su cierre todavía pueden cambiar. Una vela H1 que a los 20 minutos parece un rechazo perfecto puede terminar convertida en una vela bajista grande.",
            },
            {
              type: 'p',
              text: "Por eso la regla práctica es sencilla: **saca conclusiones solo de velas cerradas**. Si estás mirando H1, espera al cambio de hora antes de decidir.",
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "Las velas de distintas temporalidades cuentan la misma historia a escalas distintas. Una vela H1 con una mecha inferior larga puede contener, en M15, una caída fuerte seguida de una recuperación igual de fuerte. Si una vela te parece importante, baja de temporalidad y mira cómo se formó.",
            },
          ],
        },
        {
          heading: "De la vela a la secuencia",
          blocks: [
            {
              type: 'p',
              text: "Una vela aislada dice poco. Lo que de verdad informa es la **secuencia**. Por ejemplo, varias velas alcistas con cuerpos cada vez más pequeños y mechas superiores cada vez más largas sugieren que el impulso se está agotando, aunque el precio todavía siga subiendo.",
            },
            {
              type: 'list',
              ordered: true,
              items: [
                "Mira las últimas 10–20 velas, no solo la última.",
                "Fíjate en si los cuerpos crecen o se encogen.",
                "Observa dónde aparecen las mechas largas: ¿en zonas que ya habías marcado?",
                "Pregúntate qué lado ha controlado el precio en ese tramo.",
              ],
            },
            {
              type: 'p',
              text: "En las próximas lecciones combinarás esta lectura con patrones concretos, con la estructura del mercado y con zonas de soporte y resistencia. La vela es el alfabeto; ahora toca aprender a formar frases.",
            },
          ],
        },
      ],
      keyPoints: [
        "Cada vela resume cuatro precios: apertura, máximo, mínimo y cierre.",
        "El cuerpo muestra quién ganó el periodo; las mechas, dónde hubo rechazo.",
        "El tamaño de una vela solo tiene sentido comparado con las que la rodean.",
        "Saca conclusiones solo de velas cerradas.",
        "Una secuencia de velas dice mucho más que una vela suelta.",
      ],
      quiz: [
        {
          q: "Una vela H1 abre en 3320.00, sube hasta 3326.40, baja hasta 3318.00 y cierra en 3324.50. ¿Cómo es?",
          options: [
            "Bajista, con una mecha inferior larga",
            "Alcista, con un cuerpo de $4.50",
            "Alcista, con un cuerpo de $8.40",
            "Bajista, con un cuerpo de $1.90",
          ],
          answer: 1,
          explain:
            "El cierre (3324.50) queda por encima de la apertura (3320.00), así que es alcista. Cuerpo = 3324.50 − 3320.00 = $4.50. Los $8.40 son el rango total (3326.40 − 3318.00) y los $1.90, la mecha superior.",
        },
        {
          q: "¿Qué suele indicar una mecha superior muy larga?",
          options: [
            "Que los compradores controlaron el cierre",
            "Que el mercado estuvo cerrado parte del periodo",
            "Que el precio subió pero fue rechazado y vendido desde arriba",
            "Que es siempre una señal de venta",
          ],
          answer: 2,
          explain:
            "La mecha superior marca precios que se alcanzaron pero no se sostuvieron: hubo presión vendedora en la parte alta. Es información, no una orden automática de venta.",
        },
        {
          q: "Son las 10:40, miras H1 y la vela actual parece un rechazo muy claro. ¿Qué haces?",
          options: [
            "Esperar al cierre de la vela, a las 11:00, antes de sacar conclusiones",
            "Entrar ya, porque el patrón está claro",
            "Cambiar a M1 y operar allí",
            "Ignorar las velas y mirar solo indicadores",
          ],
          answer: 0,
          explain:
            "Una vela en formación todavía puede cambiar por completo. Las conclusiones se sacan de velas cerradas.",
        },
        {
          q: "Una vela tiene un rango de $6. ¿Es una vela grande?",
          options: [
            "Sí, cualquier vela de más de $5 es grande",
            "No, en el oro todas las velas son mayores",
            "Solo si es alcista",
            "Depende de la temporalidad, de la sesión y de las velas que la rodean",
          ],
          answer: 3,
          explain:
            "El tamaño es relativo: $6 puede ser mucho en una hora tranquila de la sesión asiática y poco en una vela D1 o durante un dato importante.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 2. Patrones de velas
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n3-patrones-velas',
      title: "Patrones de velas que sí sirven",
      summary:
        "Conocerás cuatro patrones útiles (envolvente, martillo o pin bar, doji y vela interior) y, sobre todo, cuándo merecen tu atención.",
      minutes: 10,
      sections: [
        {
          heading: "Primero el lugar, después el patrón",
          blocks: [
            {
              type: 'p',
              text: "Un **patrón de velas** es una combinación de una a tres velas que refleja un cambio en el equilibrio entre compradores y vendedores. Existen docenas con nombres llamativos, pero en la práctica bastan unos pocos, siempre que los leas en su contexto.",
            },
            {
              type: 'callout',
              tone: 'key',
              title: "La regla de esta lección",
              text: "**El lugar importa más que el patrón.** Un martillo perfecto en mitad de la nada es ruido. Un martillo normalito sobre una zona de soporte, a favor de la tendencia, es información.",
            },
            {
              type: 'p',
              text: "Antes de fijarte en la forma de las velas, pregúntate: ¿estoy en una **zona** relevante (soporte, resistencia, retroceso)? ¿Hacia dónde va la **tendencia** de fondo? ¿Hay alguna **noticia** importante cerca? Si las respuestas no acompañan, el patrón pierde casi todo su valor.",
            },
            {
              type: 'p',
              text: "Y recuerda: ningún patrón es infalible. Son herramientas de **probabilidad**: inclinan un poco la balanza, no garantizan el resultado.",
            },
          ],
        },
        {
          heading: "La envolvente",
          blocks: [
            {
              type: 'p',
              text: "Una **envolvente alcista** son dos velas: una bajista y, a continuación, una alcista cuyo **cuerpo** cubre por completo el cuerpo de la anterior. Cuenta que los vendedores tenían el control y que los compradores lo recuperaron con fuerza en el periodo siguiente.",
            },
            {
              type: 'p',
              text: "La **envolvente bajista** es la imagen inversa: una vela alcista seguida de una bajista que envuelve su cuerpo. Interesa sobre todo bajo una resistencia o al final de un rebote dentro de una tendencia bajista.",
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Cuanto más grande sea la vela envolvente respecto a las anteriores, y cuanto más cerca de su extremo cierre, más clara es la señal. Una envolvente que apenas cubre a una vela diminuta dice muy poco.",
            },
          ],
        },
        {
          heading: "Martillo y pin bar",
          blocks: [
            {
              type: 'p',
              text: "Un **pin bar** es una vela con una mecha muy larga (como referencia, al menos el doble del cuerpo) y el cuerpo pequeño en el extremo contrario. La mecha larga marca un **rechazo**: el precio fue a explorar un nivel y lo devolvieron con fuerza.",
            },
            {
              type: 'list',
              items: [
                "**Martillo** o pin bar alcista: mecha inferior larga y cuerpo arriba. Interesa después de una caída, sobre un soporte.",
                "**Estrella fugaz** o pin bar bajista: mecha superior larga y cuerpo abajo. Interesa después de una subida, bajo una resistencia.",
              ],
            },
            {
              type: 'p',
              text: "El color del cuerpo importa menos que la mecha y el lugar, aunque un martillo que además cierra alcista resulta algo más convincente.",
            },
          ],
        },
        {
          heading: "Doji y vela interior",
          blocks: [
            {
              type: 'p',
              text: "Un **doji** es una vela cuya apertura y cierre son prácticamente iguales: el cuerpo casi no existe. Indica **indecisión**. Por sí solo no es señal de compra ni de venta; tras una subida larga hacia una resistencia puede avisar de que el impulso se frena, pero necesita la confirmación de la vela siguiente.",
            },
            {
              type: 'p',
              text: "Una **vela interior** (inside bar) es una vela cuyo máximo y mínimo quedan dentro del rango de la vela anterior, llamada **vela madre**. Refleja **compresión**: el mercado hace una pausa. Muchos traders esperan a que el precio rompa el máximo o el mínimo de la vela madre para ver hacia dónde se resuelve.",
            },
            {
              type: 'table',
              headers: ["Patrón", "Qué refleja", "Dónde suele interesar"],
              rows: [
                ["Envolvente", "Cambio brusco de control", "En una zona, tras un retroceso a favor de la tendencia"],
                ["Martillo / pin bar", "Rechazo de un nivel", "Sobre un soporte (alcista) o bajo una resistencia (bajista)"],
                ["Doji", "Indecisión", "Al final de un movimiento largo, como aviso"],
                ["Vela interior", "Pausa y compresión", "Dentro de una tendencia, antes de la posible continuación"],
              ],
            },
          ],
        },
        {
          heading: "Del patrón a la operación",
          blocks: [
            {
              type: 'p',
              text: "Veamos cómo encaja un patrón en un plan completo. Supón que el oro está en tendencia alcista en H1 y retrocede hasta una zona de soporte que habías marcado entre 3300.00 y 3304.00.",
            },
            {
              type: 'example',
              title: "Pin bar alcista en zona de soporte (ejemplo)",
              rows: [
                ["Contexto", "Tendencia alcista en H1; retroceso a la zona 3300.00–3304.00"],
                ["Patrón", "Pin bar con mínimo en 3301.20, máximo en 3306.20 y cierre en 3305.60"],
                ["Entrada (compra al superar el máximo del pin bar)", "3306.50"],
                ["Stop loss (bajo la mecha y la zona)", "3299.50 → $7.00 de distancia"],
                ["Take profit", "3320.50 → $14.00 de distancia"],
                ["R:R", "14.00 ÷ 7.00 = 1:2"],
                ["Riesgo: 1% de $10,000", "$100"],
                ["Lotes", "100 ÷ (7.00 × 100) = 0.142… → 0.14 lotes"],
                ["Riesgo real", "0.14 × 100 × 7.00 = $98"],
              ],
              note: "Redondea siempre el tamaño hacia abajo: así nunca superas el riesgo planificado. Si el precio alcanza el objetivo, la ganancia sería 0.14 × 100 × 14.00 = $196.",
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "Si ese mismo pin bar se forma justo antes de un dato importante, o en mitad de un rango sin zona clara, no es el mismo patrón aunque lo parezca. **Contexto primero.**",
            },
          ],
        },
      ],
      keyPoints: [
        "El lugar importa más que el patrón: busca patrones en zonas y a favor de la tendencia.",
        "Envolvente: cambio brusco de control. Pin bar: rechazo de un nivel.",
        "El doji indica indecisión y la vela interior, compresión: ninguno es una señal por sí solo.",
        "Un patrón solo es útil dentro de un plan con stop, objetivo y tamaño calculados.",
      ],
      quiz: [
        {
          q: "Ves un martillo perfecto en mitad de un rango, lejos de cualquier zona. ¿Cuánto peso le das?",
          options: [
            "Mucho: el martillo es una señal alcista fiable",
            "Poco: sin una zona relevante, el patrón aporta poca información",
            "Lo uso para vender: los martillos en rango anuncian caídas",
            "Tanto que duplico el tamaño, porque el patrón es perfecto",
          ],
          answer: 1,
          explain:
            "El contexto pesa más que la forma. Un patrón en mitad de un rango, sin zona ni tendencia que lo respalden, es casi ruido.",
        },
        {
          q: "¿Qué define a una envolvente alcista?",
          options: [
            "Una vela alcista cuyo cuerpo cubre por completo el cuerpo de la vela bajista anterior",
            "Dos dojis seguidos",
            "Una vela con una mecha superior muy larga",
            "Una vela que queda dentro del rango de la anterior",
          ],
          answer: 0,
          explain:
            "La envolvente alcista es una vela bajista seguida de una alcista cuyo cuerpo la envuelve: muestra que los compradores recuperaron el control.",
        },
        {
          q: "Una vela interior (inside bar) refleja sobre todo…",
          options: [
            "Un rechazo violento de un nivel",
            "El final seguro de la tendencia",
            "Una pausa o compresión del mercado",
            "Que hay una noticia en curso",
          ],
          answer: 2,
          explain:
            "Su rango cabe dentro del de la vela madre: el mercado se comprime. La dirección se suele decidir cuando el precio rompe el máximo o el mínimo de la vela madre.",
        },
        {
          q: "Con $10,000 de balance, un riesgo del 1% y un stop a $8, ¿cuántos lotes abres?",
          options: ["0.08", "1.25", "0.80", "0.12"],
          answer: 3,
          explain:
            "Lotes = 100 ÷ (8 × 100) = 0.125. Redondeando hacia abajo, 0.12 lotes, con un riesgo real de 0.12 × 100 × 8 = $96.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 3. Estructura de mercado
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n3-estructura',
      title: "Estructura de mercado: tendencias y rangos",
      summary:
        "Aprenderás a leer la tendencia a partir de los máximos y mínimos, a reconocer un rango y a detectar cuándo se rompe la estructura.",
      minutes: 10,
      sections: [
        {
          heading: "Los puntos de giro",
          blocks: [
            {
              type: 'p',
              text: "Si quitas todos los indicadores del gráfico, lo que queda es el precio subiendo y bajando en ondas. Los extremos de esas ondas se llaman **máximos y mínimos de swing**, o puntos de giro.",
            },
            {
              type: 'p',
              text: "Un **máximo de swing** es un pico con velas más bajas a ambos lados; un **mínimo de swing** es un valle con velas más altas a ambos lados. Encadenar esos puntos es la forma más directa de saber qué está haciendo el mercado. A esa lectura la llamamos **estructura de mercado**.",
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "No marques cada pequeño pico. Para empezar, fíjate solo en los giros que se ven claramente sin hacer zoom: son los mismos que ve la mayoría de traders en esa temporalidad.",
            },
          ],
        },
        {
          heading: "Tendencia alcista y tendencia bajista",
          blocks: [
            {
              type: 'figure',
              name: 'trend-structure',
              caption:
                "En una tendencia alcista, cada máximo supera al anterior y cada mínimo queda por encima del anterior.",
            },
            {
              type: 'p',
              text: "Una **tendencia alcista** encadena **máximos crecientes** (cada pico más alto que el anterior) y **mínimos crecientes** (cada valle más alto que el anterior). Los compradores defienden cada retroceso a un precio más alto.",
            },
            {
              type: 'p',
              text: "Una **tendencia bajista** es la imagen inversa: **máximos decrecientes** y **mínimos decrecientes**. Los vendedores aparecen cada vez más abajo.",
            },
            {
              type: 'table',
              headers: ["Estructura", "Máximos", "Mínimos", "Sesgo habitual"],
              rows: [
                ["Alcista", "Crecientes", "Crecientes", "Buscar compras en los retrocesos"],
                ["Bajista", "Decrecientes", "Decrecientes", "Buscar ventas en los rebotes"],
                ["Rango", "Similares", "Similares", "Operar los extremos o esperar"],
              ],
            },
          ],
        },
        {
          heading: "Rangos: cuando nadie manda",
          blocks: [
            {
              type: 'figure',
              name: 'range',
              caption: "Un rango: el precio rebota entre un techo y un suelo sin una dirección clara.",
            },
            {
              type: 'p',
              text: "En un **rango** (mercado lateral), los máximos se repiten en una zona parecida y los mínimos también. Ni compradores ni vendedores consiguen imponerse. El oro pasa mucho tiempo así, por ejemplo durante la sesión asiática o en las horas previas a un dato importante.",
            },
            {
              type: 'p',
              text: "En un rango, las estrategias de tendencia sufren: compras arriba y vendes abajo. Hay dos opciones razonables: operar desde los **extremos** del rango hacia el lado contrario, o **esperar** a que el precio salga del rango y defina una dirección.",
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "El centro de un rango es la peor zona para abrir: el stop lógico queda lejos y el objetivo cerca, así que el R:R casi nunca compensa.",
            },
          ],
        },
        {
          heading: "Ruptura de estructura",
          blocks: [
            {
              type: 'p',
              text: "Una tendencia no cambia de un día para otro: primero se rompe su lógica. Llamamos **ruptura de estructura** al momento en que el precio deja de respetar el patrón de máximos y mínimos.",
            },
            {
              type: 'list',
              items: [
                "En tendencia alcista, el aviso llega cuando una vela **cierra por debajo del último mínimo creciente**.",
                "En tendencia bajista, cuando una vela **cierra por encima del último máximo decreciente**.",
                "Superar un máximo en tendencia alcista (o perforar un mínimo en bajista) no es un cambio: es **continuación**.",
              ],
            },
            {
              type: 'example',
              title: "Secuencia alcista que se rompe (ejemplo en H1)",
              rows: [
                ["Mínimo 1", "3280.00"],
                ["Máximo 1", "3312.00"],
                ["Mínimo 2 (creciente)", "3295.00"],
                ["Máximo 2 (creciente)", "3328.00"],
                ["Mínimo 3 (creciente)", "3306.00"],
                ["Máximo 3 (creciente)", "3341.00"],
                ["Después", "Una vela H1 cierra en 3302.00, por debajo del mínimo 3"],
              ],
              note: "Mientras el precio respetaba 3306.00, la tendencia seguía intacta. El cierre en 3302.00 rompe la estructura alcista: todavía no confirma una tendencia bajista, pero sí avisa de que ya no tiene sentido buscar compras como antes.",
            },
            {
              type: 'callout',
              tone: 'key',
              text: "Fíjate en los **cierres**, no solo en las mechas. Una mecha que perfora un mínimo y vuelve a cerrar por encima puede ser solo un barrido de stops; un cierre claro por debajo tiene mucho más peso.",
            },
          ],
        },
        {
          heading: "Estructura y temporalidad",
          blocks: [
            {
              type: 'p',
              text: "La estructura depende de la temporalidad. El oro puede estar en tendencia alcista en D1 mientras en H1 marca máximos y mínimos decrecientes: eso suele ser un **retroceso** dentro de la tendencia mayor.",
            },
            {
              type: 'p',
              text: "Para empezar, define la estructura en la temporalidad en la que vas a operar (por ejemplo, H1) y comprueba qué hace la temporalidad superior (H4 o D1). En la última lección de este nivel verás cómo combinarlas con método.",
            },
            {
              type: 'list',
              ordered: true,
              items: [
                "Activa H1 y localiza los últimos 3 o 4 puntos de giro.",
                "Decide: ¿alcista, bajista o rango?",
                "Marca con una **línea horizontal** el último mínimo creciente (o el último máximo decreciente): es tu nivel de alerta.",
                "Si se rompe con un cierre, replantea tu sesgo antes de buscar la siguiente operación.",
              ],
            },
          ],
        },
      ],
      keyPoints: [
        "Tendencia alcista: máximos y mínimos crecientes. Bajista: máximos y mínimos decrecientes.",
        "En un rango los extremos se repiten; el centro es la peor zona para abrir.",
        "Un cierre por debajo del último mínimo creciente rompe la estructura alcista (y al revés en bajista).",
        "La estructura cambia según la temporalidad: un retroceso en H1 puede formar parte de una tendencia en D1.",
      ],
      quiz: [
        {
          q: "Máximos: 3310.00, 3322.00, 3335.00. Mínimos: 3290.00, 3301.00, 3315.00. ¿Qué estructura es?",
          options: ["Bajista", "Rango", "Alcista", "No se puede saber sin indicadores"],
          answer: 2,
          explain:
            "Cada máximo supera al anterior y cada mínimo queda por encima del anterior: máximos y mínimos crecientes, es decir, tendencia alcista.",
        },
        {
          q: "En una tendencia alcista, ¿qué te avisa de una ruptura de estructura?",
          options: [
            "Un nuevo máximo por encima del anterior",
            "Una vela que cierra por debajo del último mínimo creciente",
            "Una vela alcista grande",
            "Un doji en la sesión asiática",
          ],
          answer: 1,
          explain:
            "La tendencia alcista vive de defender mínimos cada vez más altos. Cerrar por debajo del último mínimo creciente rompe esa lógica.",
        },
        {
          q: "¿Por qué el centro de un rango suele ser una mala zona para abrir?",
          options: [
            "Porque el stop lógico queda lejos y el objetivo cerca, así que el R:R no compensa",
            "Porque el simulador no permite operar allí",
            "Porque el spread es mayor en el centro",
            "Porque en un rango el precio siempre rompe hacia arriba",
          ],
          answer: 0,
          explain:
            "Desde el centro, el stop razonable está más allá de un extremo y el objetivo en el otro extremo, a una distancia parecida o menor: el R:R es pobre.",
        },
        {
          q: "D1 está en tendencia alcista y H1 marca máximos y mínimos decrecientes. ¿Cuál es la lectura más razonable?",
          options: [
            "El oro ha entrado en una tendencia bajista de largo plazo",
            "Los datos del gráfico están mal",
            "Hay que ignorar ambas temporalidades",
            "H1 probablemente está haciendo un retroceso dentro de la tendencia mayor",
          ],
          answer: 3,
          explain:
            "Las temporalidades menores muestran los retrocesos de las mayores. Una estructura bajista en H1 dentro de una tendencia alcista en D1 suele ser un retroceso.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Soportes y resistencias
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n3-soportes-resistencias',
      title: "Soportes, resistencias y zonas",
      summary:
        "Aprenderás a marcar zonas de soporte y resistencia útiles, a valorar su calidad y a aprovechar el cambio de rol cuando se rompen.",
      minutes: 10,
      sections: [
        {
          heading: "Donde el precio ya se frenó antes",
          blocks: [
            {
              type: 'p',
              text: "Un **soporte** es una zona de precio donde la demanda ha frenado las caídas en el pasado. Una **resistencia** es una zona donde la oferta ha frenado las subidas.",
            },
            {
              type: 'figure',
              name: 'support-resistance',
              caption: "El precio rebota varias veces en un soporte y en una resistencia.",
            },
            {
              type: 'p',
              text: "¿Por qué funcionan? Porque el mercado tiene memoria: en esos niveles quedaron órdenes pendientes, operaciones que alguien quiere cerrar sin pérdida y, sobre todo, miles de traders mirando los mismos precios. No es magia, es comportamiento colectivo, y por eso **a veces falla**.",
            },
          ],
        },
        {
          heading: "Zonas, no líneas exactas",
          blocks: [
            {
              type: 'p',
              text: "Un error clásico es dibujar una línea al céntimo, por ejemplo en 3350.00, y esperar que el precio gire exactamente allí. En la realidad el precio gira en una **franja**: unas veces se queda $1 antes y otras la atraviesa $2 con una mecha.",
            },
            {
              type: 'p',
              text: "Por eso es mejor pensar en **zonas**. Dibuja un rectángulo que cubra las mechas y los cuerpos donde el precio se giró. En H1, en el oro, una zona razonable suele medir unos pocos dólares (por ejemplo, entre $2 y $5), según lo volátil que esté el mercado.",
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "En el simulador, usa la herramienta **rectángulo** para las zonas y la **línea horizontal** para niveles concretos, como un número redondo. Con pocas zonas bien elegidas verás el gráfico mucho más claro.",
            },
          ],
        },
        {
          heading: "Cómo reconocer una zona de calidad",
          blocks: [
            {
              type: 'table',
              headers: ["Criterio", "Por qué suma"],
              rows: [
                ["Varios toques claros", "Más participantes la han visto funcionar."],
                ["Reacción fuerte al tocarla", "Indica que había muchas órdenes esperando allí."],
                ["Visible en una temporalidad mayor", "Una zona de H4 o D1 pesa más que una de M5."],
                ["Número redondo (3300, 3350, 3400)", "Mucha gente coloca órdenes en precios redondos."],
                ["Reciente", "Los niveles de los últimos días pesan más que los de hace meses."],
              ],
            },
            {
              type: 'p',
              text: "No hace falta que se cumplan todos. Pero si una zona no cumple casi ninguno, probablemente no merece estar en tu gráfico.",
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "Cuando una zona se golpea muchas veces en poco tiempo, las órdenes que la defendían se van consumiendo y aumenta la probabilidad de que acabe cediendo. Muchos toques seguidos no siempre son señal de fortaleza.",
            },
          ],
        },
        {
          heading: "El cambio de rol",
          blocks: [
            {
              type: 'p',
              text: "Cuando el precio rompe una resistencia con claridad, esa zona suele convertirse en **soporte**: quienes vendieron allí pueden querer salir, y quienes se quedaron fuera de la subida aprovechan la vuelta para comprar. Es el **cambio de rol**. Lo mismo ocurre al revés: un soporte roto tiende a actuar como resistencia.",
            },
            {
              type: 'figure',
              name: 'breakout-retest',
              caption: "Ruptura de una resistencia y retesteo desde arriba, donde pasa a actuar como soporte.",
            },
            {
              type: 'example',
              title: "Retesteo de una resistencia rota (ejemplo en H1)",
              rows: [
                ["Resistencia previa", "Zona 3348.00–3352.00, con tres rechazos"],
                ["Ruptura", "Una vela H1 cierra en 3358.00"],
                ["Retesteo", "El precio vuelve a 3352.00 y forma un martillo"],
                ["Entrada (compra)", "3353.00"],
                ["Stop loss (bajo la zona, con margen)", "3346.50 → $6.50"],
                ["Take profit", "3366.00 → $13.00"],
                ["R:R", "13.00 ÷ 6.50 = 1:2"],
                ["Lotes con riesgo de $100 (1% de $10,000)", "100 ÷ (6.50 × 100) = 0.153… → 0.15 lotes"],
                ["Riesgo real", "0.15 × 100 × 6.50 = $97.50"],
              ],
              note: "El stop va **más allá de la zona**, no en su borde: si el precio vuelve a cerrar con fuerza por debajo de 3348.00, la idea del cambio de rol ha fallado.",
            },
          ],
        },
        {
          heading: "Errores habituales",
          blocks: [
            {
              type: 'list',
              items: [
                "Llenar el gráfico de líneas: si todo es soporte, nada lo es.",
                "Colocar el stop justo en la línea, donde suelen llegar las mechas.",
                "Comprar contra una resistencia o vender contra un soporte sin un motivo muy claro.",
                "Olvidar actualizar las zonas: revísalas al empezar cada sesión.",
              ],
            },
            {
              type: 'p',
              text: "Las zonas serán la base de casi todo lo que viene: los patrones, Fibonacci y las medias móviles ganan fuerza cuando coinciden con una zona bien marcada. A esa coincidencia de motivos la llamamos **confluencia**.",
            },
          ],
        },
      ],
      keyPoints: [
        "Soporte: zona donde la demanda frenó caídas. Resistencia: zona donde la oferta frenó subidas.",
        "Piensa en zonas de unos pocos dólares, no en líneas al céntimo.",
        "Varios toques, reacción fuerte, temporalidad mayor y números redondos dan calidad a una zona.",
        "Una resistencia rota suele actuar como soporte, y al revés: es el cambio de rol.",
        "El stop va más allá de la zona, con margen.",
      ],
      quiz: [
        {
          q: "¿Por qué es mejor marcar zonas que líneas exactas?",
          options: [
            "Porque el simulador no tiene líneas horizontales",
            "Porque el precio gira en una franja y rara vez en un céntimo concreto",
            "Porque las zonas garantizan el rebote",
            "Porque así el stop puede ir dentro de la zona",
          ],
          answer: 1,
          explain:
            "El precio reacciona en franjas: a veces se queda antes y a veces se pasa con una mecha. La zona refleja mejor esa realidad.",
        },
        {
          q: "El precio rompe con claridad una resistencia en 3400.00 y vuelve a ella desde arriba. ¿Qué papel puede tomar esa zona?",
          options: [
            "Ninguno: una zona rota deja de existir",
            "Sigue siendo resistencia",
            "Puede actuar como soporte (cambio de rol)",
            "Se convierte en el centro de un rango",
          ],
          answer: 2,
          explain:
            "Una resistencia rota con claridad suele actuar como soporte en el retesteo. No siempre funciona, pero es una de las situaciones más vigiladas.",
        },
        {
          q: "¿Dónde colocarías el stop de una compra en una zona de soporte entre 3320.00 y 3324.00?",
          options: [
            "Por debajo de 3320.00, con algo de margen",
            "En 3322.00, en mitad de la zona",
            "Exactamente en 3324.00",
            "No hace falta stop si la zona es buena",
          ],
          answer: 0,
          explain:
            "El stop va más allá de la zona: si el precio cierra claramente por debajo de ella, la idea ha fallado. Dentro de la zona lo alcanzaría el ruido normal.",
        },
        {
          q: "¿Cuál de estos criterios NO suele dar calidad a una zona?",
          options: [
            "Varios toques claros",
            "Una reacción fuerte al tocarla",
            "Que sea visible en H4 o D1",
            "Que la dibujaras en M1 hace tres meses y no la hayas revisado",
          ],
          answer: 3,
          explain:
            "Una zona de M1 antigua y sin revisar casi no tiene peso. Los toques, la reacción fuerte y la temporalidad mayor sí suman calidad.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 5. Líneas de tendencia y canales
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n3-lineas-tendencia',
      title: "Líneas de tendencia y canales",
      summary:
        "Aprenderás a trazar líneas de tendencia y canales que tengan sentido, a usarlos como zonas dinámicas y a interpretar su ruptura.",
      minutes: 9,
      sections: [
        {
          heading: "Una zona que se mueve",
          blocks: [
            {
              type: 'p',
              text: "Los soportes y resistencias horizontales funcionan muy bien en rangos. Pero en una tendencia los retrocesos no se detienen siempre a la misma altura: cada mínimo queda más arriba. Una **línea de tendencia** une esos puntos y te da una zona **dinámica**, inclinada, que acompaña al precio.",
            },
            {
              type: 'list',
              items: [
                "En **tendencia alcista**, la línea une dos o más **mínimos crecientes** y queda por debajo del precio.",
                "En **tendencia bajista**, une dos o más **máximos decrecientes** y queda por encima del precio.",
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: "Con dos puntos puedes trazar una línea; el **tercer toque** es el que la confirma. Hasta entonces, la línea es solo una hipótesis.",
            },
          ],
        },
        {
          heading: "Cómo trazarla bien",
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                "Identifica primero la estructura: sin máximos y mínimos crecientes (o decrecientes) no hay línea de tendencia que trazar.",
                "Elige mínimos de swing claros, no pequeños altibajos.",
                "Usa un criterio constante: por mechas o por cuerpos, pero no mezcles los dos.",
                "No fuerces la línea para que toque todos los puntos. Si tienes que ajustarla cada pocas velas, no describe bien el mercado.",
                "Desconfía de las líneas muy empinadas: ese ritmo rara vez se mantiene mucho tiempo.",
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "En el simulador, selecciona **línea de tendencia**, haz clic en el primer mínimo y después en el segundo. Prueba a trazarla en H4 y luego baja a H1: las líneas de temporalidades mayores suelen ser más respetadas.",
            },
          ],
        },
        {
          heading: "Canales",
          blocks: [
            {
              type: 'p',
              text: "Si trazas una paralela a la línea de tendencia pasando por los máximos (en tendencia alcista) o por los mínimos (en bajista), obtienes un **canal**. El canal muestra el ritmo de la tendencia: el precio oscila entre la línea base y la paralela.",
            },
            {
              type: 'table',
              headers: ["Zona del canal", "Uso habitual en tendencia alcista"],
              rows: [
                ["Línea inferior (base)", "Zona para buscar compras, con confirmación"],
                ["Centro del canal", "Sin ventaja clara: mejor esperar"],
                ["Línea superior", "Zona de objetivo o de toma de beneficios"],
              ],
            },
            {
              type: 'p',
              text: "En un canal bajista la lógica se invierte: se buscan ventas cerca de la línea superior y los objetivos se sitúan cerca de la inferior.",
            },
          ],
        },
        {
          heading: "Ejemplo de operación en la línea",
          blocks: [
            {
              type: 'example',
              title: "Compra en el tercer toque de una línea alcista (ejemplo en H1)",
              rows: [
                ["Puntos de la línea", "Mínimos en 3270.00 y 3289.00"],
                ["Tercer toque", "El precio retrocede hasta la línea, en torno a 3307.00, y forma una envolvente alcista"],
                ["Entrada (compra)", "3308.00"],
                ["Stop loss (bajo la línea y el último mínimo)", "3302.00 → $6.00"],
                ["Take profit (línea superior del canal)", "3320.00 → $12.00"],
                ["R:R", "12.00 ÷ 6.00 = 1:2"],
                ["Lotes con riesgo de $100", "100 ÷ (6.00 × 100) = 0.166… → 0.16 lotes"],
                ["Riesgo real", "0.16 × 100 × 6.00 = $96"],
              ],
              note: "La línea por sí sola no basta: aquí suma porque coincide con una estructura alcista intacta y con una vela de confirmación.",
            },
          ],
        },
        {
          heading: "Cuando la línea se rompe",
          blocks: [
            {
              type: 'p',
              text: "Romper una línea de tendencia **no significa automáticamente** que la tendencia haya terminado. A menudo el precio pasa a un rango, o sigue subiendo con una pendiente más suave.",
            },
            {
              type: 'p',
              text: "Lo que confirma el cambio es la **estructura**: si después de romper la línea el precio también cierra por debajo del último mínimo creciente, el escenario alcista pierde validez.",
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "No abras ventas solo porque una línea alcista se ha roto. Espera a que el precio marque un máximo decreciente o una ruptura de estructura: la línea rota es un aviso, no una señal.",
            },
          ],
        },
      ],
      keyPoints: [
        "Una línea de tendencia une mínimos crecientes (alcista) o máximos decrecientes (bajista).",
        "Dos puntos trazan la línea; el tercer toque la confirma.",
        "Un canal añade una paralela y muestra el ritmo de la tendencia.",
        "Romper la línea es un aviso; la estructura es la que confirma el cambio.",
      ],
      quiz: [
        {
          q: "En una tendencia alcista, ¿qué puntos une la línea de tendencia?",
          options: [
            "Los máximos crecientes",
            "Los mínimos crecientes",
            "Las aperturas de cada sesión",
            "Los cierres de las velas bajistas",
          ],
          answer: 1,
          explain:
            "En tendencia alcista la línea va por debajo del precio y une los mínimos crecientes, que es donde los compradores defienden la tendencia.",
        },
        {
          q: "Tienes que mover tu línea de tendencia cada pocas velas para que encaje. ¿Qué indica eso?",
          options: [
            "Que la línea no describe bien el mercado y conviene replantearla",
            "Que la tendencia es muy fuerte",
            "Que debes aumentar el tamaño",
            "Que es momento de vender",
          ],
          answer: 0,
          explain:
            "Una línea útil se respeta sin ajustes constantes. Si hay que forzarla, el mercado no está siguiendo ese ritmo.",
        },
        {
          q: "El precio rompe una línea alcista, pero no ha cerrado por debajo del último mínimo creciente. ¿Qué es lo más sensato?",
          options: [
            "Vender de inmediato con tamaño doble",
            "Ignorar la ruptura por completo",
            "Tomarlo como aviso y observar qué hace la estructura",
            "Mover la línea para que no se rompa",
          ],
          answer: 2,
          explain:
            "La ruptura de la línea avisa de un cambio de ritmo, pero la estructura sigue alcista mientras se respete el último mínimo creciente.",
        },
        {
          q: "En un canal alcista, ¿qué zona suele ofrecer la peor relación entre riesgo y beneficio para comprar?",
          options: [
            "La línea base",
            "Un soporte que coincide con la línea base",
            "Un retroceso a la base con una envolvente alcista",
            "La línea superior del canal",
          ],
          answer: 3,
          explain:
            "Comprar en la línea superior deja el objetivo muy cerca y el stop lógico muy lejos. La base del canal ofrece mejor R:R.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 6. Medias móviles (con práctica)
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n3-medias-moviles',
      title: "Medias móviles: MA20 y MA50",
      summary:
        "Aprenderás qué calcula una media móvil, cómo leer la tendencia con la MA20 y la MA50 y por qué conviene usarlas como filtro y no como gatillo.",
      minutes: 10,
      sections: [
        {
          heading: "Qué es una media móvil",
          blocks: [
            {
              type: 'p',
              text: "Una **media móvil** es el precio medio de las últimas N velas, recalculado en cada vela nueva. Al promediar, suaviza los altibajos y deja ver la dirección de fondo.",
            },
            {
              type: 'formula',
              label: "Media móvil simple de 20 periodos",
              expr: "MA20 = (suma de los últimos 20 cierres) ÷ 20",
              note: "Cada vez que cierra una vela nueva, entra su cierre y sale el más antiguo. Por eso la media «se mueve».",
            },
            {
              type: 'p',
              text: "En H1, la **MA20** resume aproximadamente el último día de negociación (20 horas) y la **MA50**, algo más de dos días. La MA20 reacciona antes; la MA50 es más lenta y estable.",
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Existen variantes, como la **media exponencial**, que da más peso a las velas recientes y reacciona algo más rápido. La forma de usarlas es la misma.",
            },
          ],
        },
        {
          heading: "Leer la tendencia con dos medias",
          blocks: [
            {
              type: 'table',
              headers: ["Lo que ves en H1", "Lectura"],
              rows: [
                ["Precio por encima de ambas, MA20 sobre MA50 y las dos con pendiente al alza", "Tendencia alcista: buscar compras"],
                ["Precio por debajo de ambas, MA20 bajo MA50 y las dos con pendiente a la baja", "Tendencia bajista: buscar ventas"],
                ["Medias planas y entrelazadas, con el precio cruzándolas a menudo", "Rango o mercado sin dirección: las medias aportan poco"],
              ],
            },
            {
              type: 'p',
              text: "La **pendiente** importa tanto como la posición. Una MA50 plana con el precio por encima no es una tendencia: es un mercado que flota sobre su media.",
            },
          ],
        },
        {
          heading: "Las medias como zonas dinámicas",
          blocks: [
            {
              type: 'figure',
              name: 'pullback-setup',
              caption: "Retroceso hacia una zona dentro de una tendencia y continuación del movimiento.",
            },
            {
              type: 'p',
              text: "En una tendencia sana, los retrocesos suelen llegar a la zona de la **MA20**, o al espacio entre la MA20 y la MA50, antes de continuar. No es una línea exacta: trátala como una zona más, igual que un soporte.",
            },
            {
              type: 'p',
              text: "La mejor situación es la **confluencia**: un retroceso que llega a la MA20 justo donde también hay un soporte horizontal o una línea de tendencia.",
            },
          ],
        },
        {
          heading: "Cruces: útiles pero lentos",
          blocks: [
            {
              type: 'p',
              text: "Cuando la MA20 cruza por encima de la MA50 se habla de **cruce alcista**; cuando cruza por debajo, de **cruce bajista**. Son fáciles de ver, pero tienen un problema: llegan **tarde**, porque las medias se calculan con precios pasados.",
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "En un rango, las medias se cruzan una y otra vez y cada cruce parece una señal. Si operas todos los cruces, el mercado lateral te irá restando con muchas pérdidas pequeñas. Usa las medias para **filtrar la dirección**, no como gatillo de entrada.",
            },
          ],
        },
        {
          heading: "Un ejemplo completo",
          blocks: [
            {
              type: 'example',
              title: "Compra en un retroceso a la MA20 (ejemplo en H1)",
              rows: [
                ["Contexto", "Precio, MA20 y MA50 al alza; MA20 en 3331.00 y MA50 en 3324.50"],
                ["Señal", "El precio retrocede a la MA20 y cierra una vela alcista en 3332.00"],
                ["Entrada (compra)", "3332.00"],
                ["Stop loss (bajo el último mínimo de swing)", "3322.00 → $10.00"],
                ["Take profit", "3352.00 → $20.00"],
                ["R:R", "20.00 ÷ 10.00 = 1:2"],
                ["Lotes con riesgo de $100 (1% de $10,000)", "100 ÷ (10.00 × 100) = 0.10 lotes"],
                ["Resultado si llega al objetivo", "0.10 × 100 × 20.00 = $200"],
              ],
              note: "El stop no va «en la media», sino bajo el último mínimo de swing, que es donde la idea alcista dejaría de tener sentido.",
            },
            {
              type: 'callout',
              tone: 'key',
              text: "En la práctica de esta lección el simulador acepta hasta un 2% de riesgo, pero arriesgar un 1% sigue siendo una buena costumbre.",
            },
          ],
        },
      ],
      keyPoints: [
        "Una media móvil promedia los últimos N cierres y suaviza el ruido.",
        "Precio sobre ambas medias, MA20 sobre MA50 y pendiente al alza: tendencia alcista (y al revés).",
        "En los retrocesos, las medias funcionan como zonas dinámicas, mejor si coinciden con otra zona.",
        "Los cruces llegan tarde y fallan mucho en rangos: usa las medias como filtro, no como gatillo.",
      ],
      quiz: [
        {
          q: "¿Qué combinación describe mejor una tendencia alcista en H1?",
          options: [
            "Medias planas y entrelazadas",
            "Precio sobre ambas medias, MA20 sobre MA50 y las dos subiendo",
            "MA20 bajo MA50 y precio por debajo de ambas",
            "Precio cruzando la MA50 cada pocas velas",
          ],
          answer: 1,
          explain:
            "Posición y pendiente deben coincidir: precio arriba, media rápida sobre la lenta y ambas inclinadas al alza.",
        },
        {
          q: "¿Por qué las medias móviles van con retraso?",
          options: [
            "Porque se calculan con precios pasados",
            "Porque el simulador las dibuja tarde",
            "Porque solo funcionan en D1",
            "Porque dependen del volumen",
          ],
          answer: 0,
          explain:
            "Una media resume cierres que ya ocurrieron. Por eso confirma la tendencia, pero nunca la anticipa.",
        },
        {
          q: "Las medias se han cruzado cinco veces en dos días y están planas. ¿Qué haces?",
          options: [
            "Operar cada cruce",
            "Aumentar el tamaño para recuperar",
            "Reconocer que es un rango y no usar las medias para decidir la dirección",
            "Vender siempre que el precio toque la MA50",
          ],
          answer: 2,
          explain:
            "Medias planas y cruces repetidos indican un mercado sin dirección. Ahí las medias generan señales falsas.",
        },
        {
          q: "En una compra por retroceso a la MA20, ¿dónde tiene más sentido el stop?",
          options: [
            "Exactamente sobre la MA20",
            "A $1 de la entrada, para arriesgar poco",
            "Por encima del precio de entrada",
            "Más allá del último mínimo de swing, donde la idea alcista deja de ser válida",
          ],
          answer: 3,
          explain:
            "El stop se coloca donde la idea queda invalidada. La media es una zona aproximada; un stop sobre ella lo alcanzaría el ruido normal.",
        },
      ],
      practice: {
        goal: "Identificar la tendencia con la MA20 y la MA50 en H1 y abrir una operación a favor de esa tendencia.",
        steps: [
          "Abre el simulador y selecciona la temporalidad **H1**.",
          "Activa **MA20** y **MA50** con los botones de indicadores situados encima del gráfico.",
          "Clasifica el momento: alcista (precio sobre ambas medias, MA20 sobre MA50 y pendiente al alza), bajista (lo contrario) o sin dirección (medias planas y entrelazadas). Si no hay dirección clara, usa el **modo replay** para buscar otro momento.",
          "Busca un retroceso hacia la zona de la MA20 y una vela cerrada que muestre que el precio retoma la dirección de la tendencia.",
          "Pulsa **Comprar** si la tendencia es alcista o **Vender** si es bajista. Coloca el **Stop Loss** más allá del último mínimo (o máximo) de swing y el **Take Profit** en una zona lógica.",
          "Ajusta los lotes y comprueba en el panel de la orden que el riesgo no supera el **2%** (mejor si te quedas en el 1%).",
          "En «¿Por qué abres esta operación?» escribe la posición y la pendiente de las medias, y dónde has colocado el stop y por qué.",
          "Cuando termine la simulación, revisa el resultado en el **Diario**: ¿la tendencia continuó o el mercado giró?",
        ],
        rules: { requireNotes: true, maxRiskPct: 2 },
      },
    },

    // ─────────────────────────────────────────────────────────────
    // 7. RSI y MACD
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n3-rsi-macd',
      title: "RSI y MACD: el impulso sin obsesionarse",
      summary:
        "Aprenderás a leer el RSI y el MACD como medidores de impulso y a usarlos como confirmación, no como señal aislada.",
      minutes: 11,
      sections: [
        {
          heading: "Qué mide un indicador de impulso",
          blocks: [
            {
              type: 'p',
              text: "El **impulso** (momentum) es la fuerza con la que se mueve el precio. Un precio que sube con velas cada vez más pequeñas sigue subiendo, pero con menos fuerza. Los **osciladores** como el RSI y el MACD intentan medir eso.",
            },
            {
              type: 'p',
              text: "Ambos se dibujan en un panel debajo del gráfico. En el simulador los activas con los botones **RSI** y **MACD** situados encima del gráfico.",
            },
            {
              type: 'callout',
              tone: 'key',
              text: "Todos los indicadores se calculan con precios pasados, así que **van con retraso**. Un indicador no sabe lo que va a pasar: resume de otra forma lo que ya ha pasado.",
            },
          ],
        },
        {
          heading: "El RSI",
          blocks: [
            {
              type: 'p',
              text: "El **RSI** (índice de fuerza relativa) compara el tamaño medio de las subidas con el de las bajadas en un número de velas, normalmente **14**. El resultado se mueve entre 0 y 100.",
            },
            {
              type: 'list',
              items: [
                "Por encima de **70**: zona de **sobrecompra**. El precio ha subido mucho y deprisa.",
                "Por debajo de **30**: zona de **sobreventa**. El precio ha caído mucho y deprisa.",
                "Alrededor de **50**: equilibrio entre subidas y bajadas.",
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "**Sobrecomprado no significa que vaya a caer.** En una tendencia alcista fuerte, el RSI puede pasar muchas velas por encima de 70 mientras el precio sigue subiendo. Vender solo porque el RSI marca 75 es ponerse delante de un tren.",
            },
            {
              type: 'p',
              text: "Una lectura más útil en tendencia: en las tendencias alcistas el RSI suele moverse en la parte alta de la escala y sus caídas tienden a frenarse en torno a 40–50; en las bajistas ocurre al revés.",
            },
          ],
        },
        {
          heading: "Divergencias",
          blocks: [
            {
              type: 'p',
              text: "Una **divergencia** aparece cuando el precio y el indicador cuentan historias distintas:",
            },
            {
              type: 'list',
              items: [
                "**Divergencia bajista**: el precio marca un máximo más alto, pero el RSI marca un máximo más bajo. La subida pierde fuerza.",
                "**Divergencia alcista**: el precio marca un mínimo más bajo, pero el RSI marca un mínimo más alto. La caída pierde fuerza.",
              ],
            },
            {
              type: 'p',
              text: "Las divergencias avisan de que el impulso se debilita, pero **no dicen cuándo** girará el precio. Pueden encadenarse dos o tres seguidas mientras la tendencia continúa. Úsalas como aviso para ser más prudente o para buscar un giro en una zona ya marcada, nunca como orden de entrada por sí solas.",
            },
          ],
        },
        {
          heading: "El MACD",
          blocks: [
            {
              type: 'p',
              text: "El **MACD** se construye con medias exponenciales de 12, 26 y 9 periodos:",
            },
            {
              type: 'formula',
              label: "Componentes del MACD (12, 26, 9)",
              expr: "Línea MACD = media exponencial 12 − media exponencial 26 · Línea de señal = media exponencial 9 de la línea MACD · Histograma = línea MACD − línea de señal",
              note: "Cuando la media rápida se separa de la lenta, el impulso crece; cuando se acercan, el impulso se agota.",
            },
            {
              type: 'list',
              items: [
                "Línea MACD por encima de cero: la media rápida está sobre la lenta (sesgo alcista).",
                "Línea MACD cruzando por encima de la línea de señal: el impulso alcista se acelera.",
                "Histograma que se encoge: el movimiento actual pierde fuerza.",
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Como el MACD está hecho de medias, acumula todavía más retraso que el precio. Igual que las medias móviles, en un rango genera muchos cruces sin valor.",
            },
          ],
        },
        {
          heading: "Confirmación, no señal",
          blocks: [
            {
              type: 'table',
              headers: ["Uso útil", "Uso peligroso"],
              rows: [
                ["Confirmar que el impulso acompaña en una zona que ya marcaste", "Comprar o vender solo porque el RSI cruza 30 o 70"],
                ["Detectar que una subida pierde fuerza cerca de una resistencia", "Operar contra una tendencia fuerte por una divergencia"],
                ["Ver si el histograma del MACD acompaña a una ruptura", "Añadir indicadores hasta que todos «coincidan»"],
              ],
            },
            {
              type: 'example',
              title: "Venta en resistencia con impulso débil (ejemplo en H1)",
              rows: [
                ["Zona", "Resistencia 3398.00–3402.00, con dos rechazos previos"],
                ["Impulso", "Nuevo máximo en 3401.50 con el RSI más bajo que en el máximo anterior; histograma del MACD encogiéndose"],
                ["Confirmación", "Envolvente bajista que cierra en 3396.20"],
                ["Entrada (venta)", "3396.00"],
                ["Stop loss (sobre la zona, con margen)", "3404.00 → $8.00"],
                ["Take profit", "3380.00 → $16.00"],
                ["R:R", "16.00 ÷ 8.00 = 1:2"],
                ["Lotes con riesgo de $100", "100 ÷ (8.00 × 100) = 0.125 → 0.12 lotes"],
                ["Riesgo real", "0.12 × 100 × 8.00 = $96"],
              ],
              note: "El orden importa: primero la zona, después el patrón y los indicadores solo como confirmación. Sin la resistencia, la divergencia por sí sola no justificaría la venta.",
            },
          ],
        },
      ],
      keyPoints: [
        "El RSI (14) se mueve entre 0 y 100; 70 y 30 marcan sobrecompra y sobreventa, no giros seguros.",
        "Una divergencia avisa de que el impulso se debilita, pero no dice cuándo girará el precio.",
        "El MACD (12, 26, 9) compara medias exponenciales; su histograma muestra si el impulso crece o se agota.",
        "Los indicadores van con retraso: úsalos para confirmar lo que ya ves en el precio.",
      ],
      quiz: [
        {
          q: "El RSI lleva 15 velas por encima de 70 y el precio sigue marcando máximos crecientes. ¿Qué indica?",
          options: [
            "Que hay que vender ya",
            "Que el indicador está roto",
            "Que la tendencia alcista tiene fuerza: sobrecompra no implica giro",
            "Que el mercado está en rango",
          ],
          answer: 2,
          explain:
            "En tendencias fuertes el RSI puede quedarse mucho tiempo en sobrecompra. Lo que manda es la estructura del precio.",
        },
        {
          q: "El precio marca un máximo más alto y el RSI, un máximo más bajo. ¿Cómo se llama?",
          options: ["Divergencia bajista", "Divergencia alcista", "Cruce alcista", "Sobreventa"],
          answer: 0,
          explain:
            "Precio arriba e impulso abajo: la subida pierde fuerza. Es una divergencia bajista, un aviso, no una orden de venta.",
        },
        {
          q: "¿Qué parámetros usa el MACD estándar?",
          options: ["14, 70 y 30", "20 y 50", "20 y 2 desviaciones", "12, 26 y 9"],
          answer: 3,
          explain:
            "El MACD clásico usa medias exponenciales de 12 y 26 periodos, y una línea de señal de 9.",
        },
        {
          q: "¿Cuál es el papel más sensato del RSI y el MACD?",
          options: [
            "Ser la señal principal de entrada",
            "Confirmar lo que ya muestran la zona, la estructura y el precio",
            "Sustituir al stop loss",
            "Predecir el próximo dato económico",
          ],
          answer: 1,
          explain:
            "Como van con retraso, funcionan mejor como confirmación de un plan que ya se apoya en zonas y estructura.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 8. Volatilidad
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n3-volatilidad',
      title: "Volatilidad: Bandas de Bollinger y ATR",
      summary:
        "Aprenderás a medir cuánto se mueve el oro con las Bandas de Bollinger y el ATR, y a usar esa medida para colocar el stop y ajustar el tamaño.",
      minutes: 11,
      sections: [
        {
          heading: "Por qué medir la volatilidad",
          blocks: [
            {
              type: 'p',
              text: "La **volatilidad** es cuánto se mueve el precio en un periodo. El oro no se mueve siempre igual: suele estar más tranquilo en la sesión asiática, se activa con la apertura de Londres y suele moverse más durante el solapamiento con Nueva York (aproximadamente de 13:00 a 17:00 UTC en horario de invierno). Los días de datos importantes, todavía más.",
            },
            {
              type: 'p',
              text: "Medirla tiene una utilidad muy práctica: un stop de $4 puede ser razonable en un momento tranquilo y absurdo cuando cada vela H1 recorre $15. Si el stop no respeta la volatilidad, el ruido normal del mercado lo alcanzará.",
            },
          ],
        },
        {
          heading: "Las Bandas de Bollinger",
          blocks: [
            {
              type: 'p',
              text: "Las **Bandas de Bollinger** se dibujan alrededor del precio con tres líneas:",
            },
            {
              type: 'list',
              items: [
                "**Banda central**: una media móvil de **20** periodos.",
                "**Banda superior**: la central más **2 desviaciones típicas**.",
                "**Banda inferior**: la central menos 2 desviaciones típicas.",
              ],
            },
            {
              type: 'p',
              text: "La **desviación típica** mide cuánto se alejan los precios de su media. Cuando el mercado se agita, las bandas se **ensanchan**; cuando se calma, se **estrechan**. En el simulador las activas con el botón **Bandas de Bollinger**.",
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "Tocar una banda **no es una señal** por sí solo. En una tendencia fuerte, el precio puede «caminar» pegado a la banda superior durante muchas velas. Vender cada toque de la banda superior en una tendencia alcista es una forma rápida de acumular pérdidas.",
            },
          ],
        },
        {
          heading: "Compresión y expansión",
          blocks: [
            {
              type: 'p',
              text: "Los periodos de calma no duran para siempre. Cuando las bandas se estrechan mucho (una **compresión**), es frecuente que después llegue una **expansión**: un movimiento más amplio. El problema es que la compresión no dice hacia qué lado.",
            },
            {
              type: 'table',
              headers: ["Lo que ves", "Lectura habitual", "Qué hacer"],
              rows: [
                ["Bandas muy estrechas", "Calma; puede preceder a un movimiento fuerte", "Marcar los extremos y esperar a la ruptura"],
                ["Bandas abriéndose con velas grandes", "Expansión de la volatilidad", "Ampliar el stop y reducir el tamaño"],
                ["Precio caminando por una banda", "Tendencia con fuerza", "No operar en contra solo por el toque"],
              ],
            },
          ],
        },
        {
          heading: "El ATR y cómo estimarlo a ojo",
          blocks: [
            {
              type: 'p',
              text: "El **ATR** (rango verdadero medio) es la media del tamaño de las últimas velas, normalmente 14. Para cada vela usa el **rango verdadero**: el mayor entre el máximo menos el mínimo y la distancia desde el cierre anterior hasta el máximo o el mínimo, para contar también los huecos. Un ATR de $8 en H1 significa que, de media, cada vela H1 ha recorrido unos $8.",
            },
            {
              type: 'p',
              text: "El gráfico del simulador incluye las Bandas de Bollinger pero **no el ATR**. No pasa nada: puedes estimar el rango medio a ojo. Toma las últimas 10 velas de tu temporalidad, mide el máximo y el mínimo de cada una (con el cursor o con líneas horizontales) y calcula la media. Si hay una vela de noticia fuera de lo normal, tenla en cuenta: inflará la media.",
            },
            {
              type: 'example',
              title: "Estimar el rango medio de 10 velas H1 (ejemplo)",
              rows: [
                ["Rangos medidos", "6.20 · 8.40 · 5.10 · 9.80 · 7.30 · 4.60 · 12.50 · 6.90 · 7.70 · 5.50"],
                ["Suma", "$74.00"],
                ["Rango medio", "74.00 ÷ 10 = $7.40"],
                ["Stop a 1.5 veces el rango medio", "7.40 × 1.5 = $11.10 → unos $11"],
                ["Lotes con riesgo de $100", "100 ÷ (11.00 × 100) = 0.090… → 0.09 lotes"],
                ["Riesgo real", "0.09 × 100 × 11.00 = $99"],
              ],
              note: "La vela de $12.50 coincidió con un dato: sin ella, la media de las otras nueve sería de unos $6.83. Usar la cifra más alta te deja algo más de margen.",
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Muchos traders colocan el stop más allá de la zona y comprueban que esa distancia sea al menos de 1 a 1.5 veces el rango medio. No es una ley; es una forma de no dejar el stop dentro del ruido normal.",
            },
          ],
        },
        {
          heading: "Volatilidad y tamaño de posición",
          blocks: [
            {
              type: 'p',
              text: "Aquí se une este nivel con el anterior: si la volatilidad sube, el stop debe alejarse; y si el stop se aleja, los **lotes deben bajar** para que el riesgo en dólares siga siendo el mismo.",
            },
            {
              type: 'table',
              headers: ["Rango medio H1", "Stop (1.5 veces)", "Lotes para arriesgar $100", "Riesgo real"],
              rows: [
                ["$5", "$7.50", "0.13", "$97.50"],
                ["$10", "$15", "0.06", "$90"],
                ["$15", "$22.50", "0.04", "$90"],
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: "Con más volatilidad no arriesgas más dinero: operas **menos lotes** con un stop más amplio. El riesgo en dólares lo decides tú; la distancia del stop la marca el mercado.",
            },
          ],
        },
      ],
      keyPoints: [
        "Bandas de Bollinger: media de 20 periodos ± 2 desviaciones típicas; se ensanchan con la volatilidad.",
        "Tocar una banda no es una señal: en tendencia el precio puede caminar pegado a ella.",
        "El ATR es el rango medio de las velas; en el simulador puedes estimarlo a ojo con las últimas 10 velas.",
        "Más volatilidad = stop más amplio y menos lotes, con el mismo riesgo en dólares.",
      ],
      quiz: [
        {
          q: "¿Qué configuración tienen las Bandas de Bollinger estándar?",
          options: [
            "Media de 50 y 3 desviaciones",
            "Media de 20 y 2 desviaciones típicas",
            "RSI 14 con niveles 70 y 30",
            "Medias de 12 y 26",
          ],
          answer: 1,
          explain:
            "La configuración clásica es una media de 20 periodos con bandas a 2 desviaciones típicas por encima y por debajo.",
        },
        {
          q: "Las bandas llevan horas muy estrechas. ¿Qué es lo más razonable?",
          options: [
            "Comprar, porque una compresión siempre se resuelve al alza",
            "Vender, porque la calma anuncia caídas",
            "Marcar los extremos y esperar a ver hacia dónde se expande el precio",
            "Quitar el indicador: no aporta nada",
          ],
          answer: 2,
          explain:
            "La compresión suele preceder a una expansión, pero no indica la dirección. Esperar a la ruptura evita adivinar.",
        },
        {
          q: "Estimas un rango medio de $12 en H1 y quieres el stop a 1.5 veces esa cifra. Con un riesgo de $90, ¿cuántos lotes abres?",
          options: ["0.05", "0.50", "0.08", "0.18"],
          answer: 0,
          explain:
            "Stop = 12 × 1.5 = $18. Lotes = 90 ÷ (18 × 100) = 0.05, con un riesgo exacto de $90.",
        },
        {
          q: "Si la volatilidad se duplica y mantienes el mismo riesgo en dólares, ¿qué debe pasar con el tamaño?",
          options: [
            "Debe duplicarse",
            "Debe mantenerse igual",
            "Da igual: el stop no depende de la volatilidad",
            "Debe reducirse, porque el stop será más amplio",
          ],
          answer: 3,
          explain:
            "Un stop más amplio con el mismo riesgo en dólares exige menos lotes: lotes = riesgo ÷ (distancia × 100).",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 9. Fibonacci (con práctica)
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n3-fibonacci',
      title: "Retrocesos de Fibonacci",
      summary:
        "Aprenderás a trazar retrocesos de Fibonacci sobre un impulso, a leer los niveles 38.2%, 50% y 61.8% y a combinarlos con zonas para planificar entradas.",
      minutes: 11,
      sections: [
        {
          heading: "Impulsos y retrocesos",
          blocks: [
            {
              type: 'p',
              text: "Las tendencias no avanzan en línea recta. Después de un **impulso** (un tramo fuerte a favor de la tendencia) suele llegar un **retroceso**: el precio devuelve una parte del recorrido antes de, quizá, continuar.",
            },
            {
              type: 'p',
              text: "La pregunta práctica es: ¿hasta dónde puede retroceder? Los **retrocesos de Fibonacci** proponen unas zonas de referencia expresadas como porcentaje del impulso. Las más usadas son **38.2%**, **50%** y **61.8%**.",
            },
            {
              type: 'callout',
              tone: 'key',
              text: "Los porcentajes proceden de una conocida secuencia matemática (el 50% no forma parte de ella, pero se usa igual). No tienen nada de mágico: sirven de referencia en parte porque muchos traders los miran a la vez. Trátalos como **zonas** posibles, no como precios exactos.",
            },
          ],
        },
        {
          heading: "Cómo se traza",
          blocks: [
            {
              type: 'figure',
              name: 'fibonacci',
              caption: "Retroceso de Fibonacci trazado sobre un impulso alcista, con los niveles 38.2%, 50% y 61.8%.",
            },
            {
              type: 'list',
              items: [
                "En **tendencia alcista**, traza desde el **mínimo de swing** donde empezó el impulso hasta el **máximo de swing** donde terminó.",
                "En **tendencia bajista**, al revés: desde el máximo de swing hasta el mínimo de swing.",
                "Usa giros claros de la estructura, no velas cualesquiera.",
              ],
            },
            {
              type: 'formula',
              label: "Nivel de retroceso en tendencia alcista",
              expr: "Nivel = máximo − (máximo − mínimo) × porcentaje",
              note: "La herramienta lo calcula sola, pero conviene saber de dónde salen los niveles.",
            },
            {
              type: 'example',
              title: "Niveles de un impulso de $60 (ejemplo)",
              rows: [
                ["Mínimo de swing", "3300.00"],
                ["Máximo de swing", "3360.00"],
                ["Recorrido del impulso", "$60.00"],
                ["38.2%", "3360.00 − 22.92 = 3337.08"],
                ["50%", "3360.00 − 30.00 = 3330.00"],
                ["61.8%", "3360.00 − 37.08 = 3322.92"],
              ],
              note: "Un retroceso que se frena en el 38.2% suele indicar una tendencia con mucha fuerza; uno que llega al 61.8% es más profundo y la tendencia está más disputada.",
            },
          ],
        },
        {
          heading: "Confluencia: cuando el nivel coincide con algo más",
          blocks: [
            {
              type: 'p',
              text: "Un nivel de Fibonacci aislado es débil. Gana valor cuando coincide con otras referencias que ya conoces:",
            },
            {
              type: 'list',
              items: [
                "Una zona de **soporte o resistencia** previa (por ejemplo, una antigua resistencia rota).",
                "La **MA20** o la **MA50** en ese momento.",
                "Una **línea de tendencia**.",
                "Un **número redondo**.",
              ],
            },
            {
              type: 'p',
              text: "En el ejemplo anterior, si antes del impulso había una resistencia en 3328.00–3332.00, la zona entre el 50% (3330.00) y el 61.8% (3322.92) gana mucho interés: dos razones independientes señalan el mismo lugar.",
            },
          ],
        },
        {
          heading: "Ejemplo de plan completo",
          blocks: [
            {
              type: 'example',
              title: "Compra en el 50% con confluencia (ejemplo en H1)",
              rows: [
                ["Impulso", "De 3300.00 a 3360.00"],
                ["Zona de interés", "50% (3330.00) + antigua resistencia 3328.00–3332.00"],
                ["Confirmación", "Pin bar alcista que cierra en 3330.60"],
                ["Entrada (compra)", "3331.00"],
                ["Stop loss (bajo el 61.8% y la zona, con margen)", "3319.00 → $12.00"],
                ["Take profit (algo por debajo del máximo previo)", "3355.00 → $24.00"],
                ["R:R", "24.00 ÷ 12.00 = 1:2"],
                ["Lotes con riesgo de $100", "100 ÷ (12.00 × 100) = 0.083… → 0.08 lotes"],
                ["Riesgo real", "0.08 × 100 × 12.00 = $96"],
              ],
              note: "El objetivo queda algo por debajo del máximo de 3360.00 porque allí pueden aparecer vendedores. Si el precio cierra por debajo de 3319.00, ya no es un simple retroceso: la idea queda invalidada.",
            },
          ],
        },
        {
          heading: "Errores frecuentes",
          blocks: [
            {
              type: 'list',
              items: [
                "Trazar desde puntos que no son giros claros y obtener niveles que nadie más mira.",
                "Esperar un rebote exacto al céntimo en el 61.8%.",
                "Comprar en un nivel sin esperar ninguna reacción del precio.",
                "Mover el trazado después para que «encaje» con lo que ya pasó.",
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "Si el precio cae por debajo del mínimo donde empezó el impulso (el 100% del retroceso), la estructura alcista se ha roto. Ningún nivel de Fibonacci rescata una idea que la estructura ya ha invalidado.",
            },
          ],
        },
      ],
      keyPoints: [
        "En tendencia alcista, traza el Fibonacci del mínimo de swing al máximo; en bajista, al revés.",
        "38.2%, 50% y 61.8% son zonas de referencia, no precios exactos.",
        "Un nivel gana valor cuando coincide con un soporte, una resistencia o una media móvil.",
        "Si el precio rompe el origen del impulso, manda la estructura: la idea queda invalidada.",
      ],
      quiz: [
        {
          q: "En una tendencia alcista, ¿cómo trazas el Fibonacci?",
          options: [
            "Del máximo de swing al mínimo de swing",
            "Del mínimo de swing donde empieza el impulso al máximo donde termina",
            "Entre dos velas cualesquiera de la sesión asiática",
            "Desde el precio actual hasta el número redondo más cercano",
          ],
          answer: 1,
          explain:
            "En tendencia alcista se mide el impulso desde su origen (mínimo de swing) hasta su final (máximo de swing). Los niveles muestran cuánto de ese recorrido devuelve el precio.",
        },
        {
          q: "Un impulso va de 3200.00 a 3280.00. ¿Dónde está el 50%?",
          options: ["3260.00", "3230.56", "3240.00", "3249.44"],
          answer: 2,
          explain:
            "El 50% está a mitad del recorrido: 3280.00 − (80.00 × 0.5) = 3240.00. 3249.44 sería el 38.2% y 3230.56, el 61.8%.",
        },
        {
          q: "¿Qué hace más interesante un nivel del 61.8%?",
          options: [
            "Que coincida con una antigua resistencia rota que ahora puede actuar como soporte",
            "Que esté lejos de cualquier otra referencia",
            "Que el RSI esté exactamente en 50",
            "Que el impulso medido sea muy pequeño",
          ],
          answer: 0,
          explain:
            "La confluencia de motivos independientes, como un nivel de Fibonacci y un cambio de rol, da más peso a una zona.",
        },
        {
          q: "Compras en el 50% con stop bajo el 61.8%. Después, el precio cierra por debajo del mínimo donde empezó el impulso. ¿Qué significa?",
          options: [
            "Que debes ampliar el stop",
            "Que hay que volver a trazar el Fibonacci para que encaje",
            "Que es mejor comprar más barato",
            "Que la estructura alcista se ha roto y la idea queda invalidada",
          ],
          answer: 3,
          explain:
            "Perder el origen del impulso rompe la estructura alcista. No se amplía el stop ni se retraza para justificar la operación.",
        },
      ],
      practice: {
        goal: "Trazar un retroceso de Fibonacci sobre un impulso claro y planificar una entrada en la zona 38.2%–61.8% con un R:R de al menos 1:2.",
        steps: [
          "Abre el simulador en **H1** y busca un impulso claro y reciente. Si lo necesitas, usa el **modo replay** para situarte justo después de un impulso.",
          "Identifica el impulso: el mínimo de swing donde empezó y el máximo de swing donde terminó (en tendencia bajista, al revés).",
          "Selecciona la herramienta **Fibonacci**, pulsa sobre el mínimo de swing y arrastra hasta el máximo antes de soltar (en tendencia bajista, del máximo al mínimo).",
          "Comprueba si alguno de los niveles 38.2%, 50% o 61.8% coincide con un soporte, una resistencia o una media móvil, y marca esa zona con un **rectángulo**.",
          "Espera a que el precio llegue a la zona y muestre una vela cerrada de reacción a favor de la tendencia.",
          "Coloca el **Stop Loss** más allá del nivel 61.8% y de la zona, y el **Take Profit** al menos al doble de distancia. Comprueba en el panel de la orden que el R:R es de 2 o más y que el riesgo no supera el **2%**.",
          "En «¿Por qué abres esta operación?» anota el impulso medido, el nivel elegido y con qué otra referencia coincide.",
          "Lanza la operación y, al terminar, revisa en el **Diario** si el precio respetó la zona.",
        ],
        rules: { requireNotes: true, minRR: 2, maxRiskPct: 2 },
      },
    },

    // ─────────────────────────────────────────────────────────────
    // 10. Varias temporalidades (con práctica)
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n3-temporalidades',
      title: "Análisis en varias temporalidades",
      summary:
        "Aprenderás a combinar D1, H4, H1 y M15 de arriba abajo para operar a favor de la dirección mayor con entradas más precisas.",
      minutes: 12,
      sections: [
        {
          heading: "El mismo mercado, distintas historias",
          blocks: [
            {
              type: 'p',
              text: "Abre el oro en M15 y quizá veas una caída clara. Cambia a D1 y esa caída puede ser un pequeño retroceso dentro de una tendencia alcista. Ninguna de las dos lecturas es falsa: cada temporalidad cuenta una parte de la historia.",
            },
            {
              type: 'p',
              text: "El **análisis en varias temporalidades** consiste en ordenar esas historias para tomar decisiones coherentes. El enfoque más habitual es **de arriba abajo**: empiezas por las temporalidades mayores y bajas hasta la de entrada.",
            },
          ],
        },
        {
          heading: "Cada temporalidad, una pregunta",
          blocks: [
            {
              type: 'table',
              headers: ["Temporalidad", "Pregunta", "Qué marcas"],
              rows: [
                ["D1 / H4", "¿Hacia dónde va el mercado?", "Estructura, MA50 y zonas mayores"],
                ["H1", "¿Dónde me interesa actuar?", "Soportes y resistencias, Fibonacci, líneas de tendencia"],
                ["M15", "¿Cuándo entro?", "La reacción en la zona: un patrón de velas o una pequeña ruptura de estructura"],
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: "La temporalidad mayor manda. Si D1 y H4 son alcistas, en H1 y M15 buscas **compras** en los retrocesos; las ventas, en contra de la dirección mayor, exigen mucha más justificación.",
            },
            {
              type: 'p',
              text: "Una referencia útil es que entre una temporalidad y la siguiente haya un factor de aproximadamente 4 a 6: H4 → H1 → M15 cumple esa idea. Usar más de tres o cuatro temporalidades suele generar más dudas que claridad.",
            },
          ],
        },
        {
          heading: "Cuando las temporalidades no coinciden",
          blocks: [
            {
              type: 'p',
              text: "Lo normal es que no estén todas de acuerdo. Algunas situaciones típicas:",
            },
            {
              type: 'list',
              items: [
                "**D1 alcista, H1 bajista**: probablemente es un retroceso. No vendas por inercia; marca la zona donde ese retroceso podría terminar y espera allí.",
                "**D1 en rango**: los extremos del rango de D1 pesan más que cualquier señal de M15. Opera cerca de los extremos o espera.",
                "**Todo alcista, pero el precio está lejos de cualquier zona**: la dirección es clara, el momento no. Esperar también es una decisión.",
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Si después de revisar las temporalidades no sabes explicar en una frase la dirección y la zona, no hay operación. Pasa a otro momento.",
            },
          ],
        },
        {
          heading: "Un ejemplo de arriba abajo",
          blocks: [
            {
              type: 'example',
              title: "Análisis de arriba abajo (ejemplo)",
              rows: [
                ["D1", "Máximos y mínimos crecientes; precio sobre la MA50 → dirección alcista"],
                ["H4", "Retroceso hacia una antigua resistencia rota en 3318.00–3322.00"],
                ["H1", "La zona coincide con el 50% del último impulso → zona de compra"],
                ["M15", "En la zona, el precio marca un mínimo creciente y rompe el último máximo menor, en 3324.50"],
                ["Entrada (compra)", "3325.00"],
                ["Stop loss (bajo la zona, con margen)", "3315.00 → $10.00"],
                ["Take profit", "3345.00 → $20.00"],
                ["R:R", "20.00 ÷ 10.00 = 1:2"],
                ["Lotes con riesgo del 1% ($100)", "100 ÷ (10.00 × 100) = 0.10 lotes"],
              ],
              note: "El stop se decide con la zona de H1, no con el pequeño mínimo de M15: un stop de M15 muy ajustado quedaría dentro del ruido normal de una vela H1.",
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "El simulador resuelve cada operación recorriendo velas **H1** históricas. Aunque afines la entrada en M15, el stop y el objetivo tienen que tener sentido en H1.",
            },
          ],
        },
        {
          heading: "Una rutina de análisis",
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                "**D1**: estructura y MA50. Resume en una palabra: alcista, bajista o rango.",
                "**H4**: ¿retroceso o continuación? ¿Hay zonas mayores cerca?",
                "**H1**: marca una o dos zonas en la dirección mayor con rectángulos.",
                "**M15**: solo cuando el precio esté en la zona, busca la reacción.",
                "Calcula stop, objetivo y lotes antes de pulsar nada.",
              ],
            },
            {
              type: 'p',
              text: "Con práctica, esta rutina lleva pocos minutos. Y tiene un efecto secundario muy valioso: elimina muchas operaciones impulsivas que solo tenían sentido mirando una única temporalidad.",
            },
          ],
        },
      ],
      keyPoints: [
        "De arriba abajo: D1/H4 para la dirección, H1 para las zonas y M15 para el momento de entrada.",
        "La temporalidad mayor manda; operar en su contra exige mucha más justificación.",
        "Si las temporalidades no se alinean, no hay operación.",
        "El stop se decide con la zona de H1, no con el ruido de M15.",
      ],
      quiz: [
        {
          q: "En el enfoque de arriba abajo, ¿para qué usas M15?",
          options: [
            "Para decidir la dirección general",
            "Para afinar el momento de entrada dentro de una zona ya marcada",
            "Para marcar las zonas principales",
            "Para nada: solo sirve D1",
          ],
          answer: 1,
          explain:
            "M15 es la temporalidad de ejecución: muestra la reacción del precio en una zona que ya has elegido en H1, a favor de la dirección de D1/H4.",
        },
        {
          q: "D1 es alcista y H1 lleva varias horas cayendo. ¿Qué lectura es más razonable?",
          options: [
            "Vender con un tamaño grande",
            "Ignorar D1, porque H1 es más reciente",
            "H1 probablemente está retrocediendo: conviene buscar una zona de compra",
            "El análisis técnico no funciona",
          ],
          answer: 2,
          explain:
            "Una caída en H1 dentro de una tendencia alcista en D1 suele ser un retroceso. La idea es esperar a que termine en una zona, no venderlo.",
        },
        {
          q: "D1 es bajista, H4 alcista, H1 está en rango y no sabes resumir la dirección en una frase. ¿Qué haces?",
          options: [
            "No operar y buscar otro momento",
            "Comprar, porque H4 es alcista",
            "Vender, porque D1 es bajista",
            "Abrir una compra y una venta a la vez",
          ],
          answer: 0,
          explain:
            "Sin alineación ni una lectura clara no hay ventaja. No operar también es una decisión válida.",
        },
        {
          q: "Afinas la entrada en M15 con un stop de $2 bajo un pequeño mínimo. ¿Qué problema tiene en este simulador?",
          options: [
            "Ninguno: cuanto más ajustado, mejor",
            "Que el simulador no admite stops",
            "Que el R:R siempre será menor que 1",
            "Que el simulador resuelve con velas H1 y un stop tan ajustado puede quedar dentro del ruido normal de una vela",
          ],
          answer: 3,
          explain:
            "El resultado se calcula con velas H1 históricas. Un stop de $2 cabe holgadamente dentro del rango de una sola vela H1.",
        },
      ],
      practice: {
        goal: "Hacer un análisis de arriba abajo (D1/H4 → H1 → M15) y abrir una operación solo si las temporalidades están alineadas.",
        steps: [
          "En **D1** y después en **H4**, determina la dirección con la estructura de máximos y mínimos y con la **MA50**.",
          "Cambia a **H1** y marca con el **rectángulo** una o dos zonas en la dirección mayor (soportes en tendencia alcista, resistencias en bajista). Puedes apoyarte en la herramienta **Fibonacci**.",
          "Cambia a **M15** y espera a que el precio esté en la zona y muestre una reacción: un patrón de velas o una pequeña ruptura de estructura a favor de la dirección mayor.",
          "Coloca el **Stop Loss** más allá de la zona de H1 y el **Take Profit** al menos al doble de distancia. Comprueba en el panel de la orden que el R:R es de 2 o más y que el riesgo no supera el **1%**.",
          "En «¿Por qué abres esta operación?» escribe una línea por temporalidad: «D1: …, H4: …, H1: zona …, M15: entrada por …».",
          "Si las temporalidades no se alinean, no operes: busca otro momento con el **modo replay**. Saber no operar también forma parte del ejercicio.",
          "Cuando termine la simulación, revisa el **Diario** y compara lo que pasó con tu análisis.",
        ],
        rules: { requireNotes: true, minRR: 2, maxRiskPct: 1 },
      },
    },
  ],
};
