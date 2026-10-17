import type { Level } from './types';

export const nivel4: Level = {
  id: 'n4',
  number: 4,
  title: "Qué mueve al oro",
  subtitle: "Fundamentales y noticias",
  description:
    "Entenderás qué fuerzas mueven el precio del oro (tipos de interés, dólar, inflación, miedo y bancos centrales) y sabrás preparar tu operativa alrededor del calendario económico y de las noticias de impacto alto.",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. Por qué sube y baja el oro
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n4-por-que-sube-baja',
      title: "Por qué sube y baja el oro",
      summary:
        "Tendrás un mapa de los grandes motores del precio del oro y entenderás por qué ninguno funciona por sí solo.",
      minutes: 9,
      sections: [
        {
          heading: "Un activo distinto a los demás",
          blocks: [
            {
              type: 'p',
              text: "Una acción representa una empresa que genera beneficios; un bono paga intereses. El oro no hace ninguna de las dos cosas: **no genera rendimiento**. Su precio depende de cuánto lo desean en cada momento inversores, bancos centrales, joyeros e industria, frente a la cantidad disponible.",
            },
            {
              type: 'p',
              text: "La oferta cambia despacio: la producción de las minas varía poco de un año a otro y la mayor parte del oro extraído a lo largo de la historia sigue existiendo en forma de lingotes, monedas y joyas. Por eso, a corto y medio plazo, el precio lo mueve sobre todo la **demanda**: quién quiere comprar o vender, y por qué.",
            },
            {
              type: 'callout',
              tone: 'key',
              text: "XAU/USD es el precio de una onza troy de oro **en dólares**. Todo lo que afecta al dólar afecta también a este precio, aunque el oro en sí no haya cambiado.",
            },
          ],
        },
        {
          heading: "Los grandes motores",
          blocks: [
            {
              type: 'table',
              headers: ["Motor", "Qué es", "Efecto habitual en el oro"],
              rows: [
                ["Tipos de interés reales", "Rentabilidad de los bonos descontada la inflación esperada", "Si suben, suelen presionarlo a la baja"],
                ["Dólar", "Fortaleza del dólar frente a otras divisas", "Un dólar fuerte suele pesar sobre el oro"],
                ["Expectativas de inflación", "Cuánto cree el mercado que subirán los precios", "Si suben y los tipos no lo compensan, suelen apoyarlo"],
                ["Aversión al riesgo", "Miedo a crisis, conflictos o caídas de bolsa", "Suele aumentar la demanda de refugio"],
                ["Bancos centrales", "Compras de oro para sus reservas", "Demanda estable que lo sostiene a largo plazo"],
                ["Demanda física y joyería", "Joyas, lingotes y monedas, con gran peso de Asia", "Apoya en las caídas; se frena con precios muy altos"],
                ["ETFs de oro", "Fondos cotizados respaldados por oro físico", "Las entradas de dinero apoyan; las salidas presionan"],
              ],
            },
            {
              type: 'p',
              text: "Un **ETF** (fondo cotizado) es un fondo que se compra y se vende en bolsa como una acción. Los ETFs de oro guardan oro físico, así que sus entradas y salidas de dinero reflejan el apetito de los inversores por el metal.",
            },
          ],
        },
        {
          heading: "Corto plazo y largo plazo",
          blocks: [
            {
              type: 'p',
              text: "No todos los motores actúan a la misma velocidad:",
            },
            {
              type: 'list',
              items: [
                "**Minutos y horas**: datos económicos, decisiones de tipos, declaraciones de la Reserva Federal y movimientos del dólar. Es lo que verás en H1 y M15.",
                "**Semanas y meses**: cambios en las expectativas de tipos e inflación, episodios de crisis, flujos de los ETFs.",
                "**Años**: compras de los bancos centrales, demanda física y grandes tendencias de la economía mundial.",
              ],
            },
            {
              type: 'p',
              text: "Si operas en temporalidades cortas, los motores rápidos explican la mayoría de los movimientos bruscos. Los lentos forman el telón de fondo: ayudan a entender por qué una tendencia de meses se mantiene aunque haya días malos.",
            },
          ],
        },
        {
          heading: "Tendencias, no leyes",
          blocks: [
            {
              type: 'p',
              text: "Los efectos de la tabla son **habituales**, no automáticos. Los motores interactúan y a veces chocan entre sí. Por ejemplo, en un momento de pánico financiero el dólar puede subir como refugio y el oro también, porque ambos atraen a inversores asustados.",
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "Desconfía de cualquier explicación del tipo «si pasa X, el oro sube seguro». El precio refleja el equilibrio de muchas fuerzas a la vez y, además, reacciona a lo que el mercado **esperaba**, no solo a lo que ocurre.",
            },
            {
              type: 'p',
              text: "Muchas noticias ya están **descontadas**: si todo el mercado esperaba una bajada de tipos, el precio probablemente se movió antes del anuncio. Lo que mueve el precio es la **sorpresa**, la diferencia entre lo esperado y lo que finalmente sucede.",
            },
          ],
        },
        {
          heading: "Cómo usar esto si operas con el gráfico",
          blocks: [
            {
              type: 'p',
              text: "No necesitas convertirte en economista. Los fundamentales te sirven para dos cosas muy concretas:",
            },
            {
              type: 'list',
              items: [
                "**Contexto**: entender por qué el mercado se mueve como se mueve y no sorprenderte cuando un dato rompe una tendencia técnica.",
                "**Prudencia**: saber cuándo hay eventos capaces de mover el precio con violencia, para no tener posiciones abiertas en esos momentos sin haberlo decidido.",
              ],
            },
            {
              type: 'p',
              text: "Las entradas, los stops y los objetivos los seguirás decidiendo con el análisis técnico del nivel anterior. Un buen hábito: antes de cada sesión, escribe el contexto en una línea, por ejemplo «dólar fuerte esta semana, dato de inflación el miércoles».",
            },
          ],
        },
      ],
      keyPoints: [
        "El oro no genera rendimiento: su precio depende de la demanda frente a una oferta que cambia despacio.",
        "Motores principales: tipos reales, dólar, inflación esperada, aversión al riesgo, bancos centrales, demanda física y ETFs.",
        "Los efectos son tendencias habituales, no leyes: los motores interactúan y a veces chocan.",
        "El mercado reacciona a la sorpresa frente a lo esperado, no solo a la noticia.",
      ],
      quiz: [
        {
          q: "¿Por qué la demanda pesa más que la oferta en el precio del oro a corto plazo?",
          options: [
            "Porque las minas cierran los fines de semana",
            "Porque la producción minera cambia despacio y la mayor parte del oro extraído sigue existiendo",
            "Porque el oro no se puede vender",
            "Porque los bancos centrales fijan el precio cada día",
          ],
          answer: 1,
          explain:
            "La oferta nueva es pequeña comparada con todo el oro que ya existe y cambia poco de un año a otro. Las variaciones de la demanda explican la mayor parte de los movimientos.",
        },
        {
          q: "¿Qué efecto suele tener un dólar fuerte sobre XAU/USD?",
          options: [
            "Suele presionarlo a la baja",
            "Siempre lo hace subir",
            "Ninguno: son independientes",
            "Lo congela hasta el cierre",
          ],
          answer: 0,
          explain:
            "El oro cotiza en dólares: un dólar más fuerte lo encarece para quien compra con otras divisas y suele pesar sobre el precio. Es una tendencia, no una regla fija.",
        },
        {
          q: "Durante un episodio de pánico, sube el dólar y también el oro. ¿Cómo se explica?",
          options: [
            "Es un error en los datos",
            "El oro siempre sube con el dólar",
            "Ambos atraen demanda de refugio: las relaciones habituales son tendencias, no leyes",
            "Los ETFs están cerrados durante el pánico",
          ],
          answer: 2,
          explain:
            "En momentos de miedo, varios activos refugio pueden subir a la vez. La relación inversa habitual entre dólar y oro puede debilitarse.",
        },
        {
          q: "¿Qué es un ETF de oro?",
          options: [
            "Un tipo de joya de inversión",
            "Un indicador técnico",
            "Una reunión de la Reserva Federal",
            "Un fondo cotizado en bolsa respaldado por oro físico",
          ],
          answer: 3,
          explain:
            "Un ETF de oro se compra y se vende como una acción y guarda oro físico. Sus entradas y salidas reflejan el interés de los inversores.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 2. El dólar y los tipos reales
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n4-dolar-tipos',
      title: "El dólar y los tipos de interés reales",
      summary:
        "Entenderás por qué el oro compite con los bonos, qué son los tipos de interés reales y cómo suele relacionarse el oro con el dólar.",
      minutes: 10,
      sections: [
        {
          heading: "El coste de oportunidad de tener oro",
          blocks: [
            {
              type: 'p',
              text: "Imagina que tienes $10,000 para guardar un año. Puedes comprar un bono del Tesoro de EE. UU., que paga intereses, o comprar oro, que no paga nada. Lo que dejas de ganar por elegir el oro es su **coste de oportunidad**.",
            },
            {
              type: 'p',
              text: "Cuando los intereses son altos, ese coste es grande y el oro resulta menos atractivo. Cuando los intereses son bajos, tener oro «cuesta» poco. Esta es la idea central de la lección.",
            },
            {
              type: 'example',
              title: "Coste de oportunidad (ejemplo ilustrativo)",
              rows: [
                ["Capital", "$10,000"],
                ["Bono a un año al 4%", "$400 de intereses"],
                ["Oro durante un año", "$0 de intereses"],
                ["Coste de oportunidad de elegir el oro", "$400: el oro tendría que revalorizarse al menos un 4% para igualar al bono"],
              ],
              note: "Cifras redondas para ilustrar la idea, no datos de mercado. Ambas opciones tienen sus propios riesgos.",
            },
          ],
        },
        {
          heading: "Tipos nominales y tipos reales",
          blocks: [
            {
              type: 'p',
              text: "El interés que ves anunciado es el **tipo nominal**. Pero si la inflación se come parte de ese interés, lo que de verdad ganas en poder de compra es menos. Esa ganancia real es el **tipo de interés real**.",
            },
            {
              type: 'formula',
              label: "Tipo de interés real (aproximado)",
              expr: "Tipo real ≈ tipo nominal − inflación esperada",
              note: "Se usa la inflación esperada, no la pasada, porque al invertir te importa el poder de compra que perderás a partir de ahora.",
            },
            {
              type: 'table',
              headers: ["Tipo nominal", "Inflación esperada", "Tipo real", "Coste de oportunidad del oro"],
              rows: [
                ["4.5%", "2.5%", "2.0%", "Alto"],
                ["3.0%", "3.0%", "0.0%", "Bajo"],
                ["3.0%", "4.0%", "−1.0%", "Negativo: el bono pierde poder de compra"],
              ],
            },
            {
              type: 'p',
              text: "En EE. UU., el mercado sigue los tipos reales a través de los bonos del Tesoro protegidos contra la inflación (**TIPS**). Muchos analistas vigilan la rentabilidad real a 10 años como uno de los indicadores más relacionados con el oro.",
            },
          ],
        },
        {
          heading: "El dólar y el índice DXY",
          blocks: [
            {
              type: 'p',
              text: "El oro se cotiza en dólares. Si el dólar se fortalece, el oro se encarece para quien compra con euros, yenes o rupias, y eso puede frenar la demanda. Además, XAU/USD es un cociente: si cada dólar vale más, hacen falta menos dólares por onza.",
            },
            {
              type: 'p',
              text: "Para medir la fuerza del dólar se usa a menudo el **DXY**, un índice que compara el dólar con una cesta de grandes divisas en la que el euro tiene el mayor peso. Si el DXY sube, el dólar se fortalece frente a esa cesta.",
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Los tipos y el dólar suelen ir de la mano: si el mercado espera que la Reserva Federal (la **Fed**, el banco central de EE. UU.) suba los tipos o los mantenga altos, las rentabilidades de los bonos suben, el dólar atrae dinero y el oro tiende a sufrir. Por eso un mismo dato puede mover las tres cosas a la vez.",
            },
          ],
        },
        {
          heading: "Una tendencia, no una ley",
          blocks: [
            {
              type: 'p',
              text: "La relación inversa entre el oro y los tipos reales, y entre el oro y el dólar, es una de las más observadas en este mercado. Pero es una **tendencia**, no una ley física. Hay periodos en que se debilita o incluso se invierte:",
            },
            {
              type: 'list',
              items: [
                "En momentos de miedo intenso, el dólar y el oro pueden subir juntos porque ambos se buscan como refugio.",
                "Cuando dominan otros compradores, como los bancos centrales, el oro puede subir aunque los tipos reales sean altos. Muchos analistas han explicado así algunos periodos recientes.",
                "Si otra divisa importante se debilita por motivos propios, el DXY puede subir sin que cambie nada relevante para el oro.",
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "No operes la correlación como si fuera automática. Úsala para entender el contexto y para saber qué mirar cuando el oro hace algo que no esperabas.",
            },
          ],
        },
        {
          heading: "Cómo usarlo en tu día a día",
          blocks: [
            {
              type: 'table',
              headers: ["Si ocurre esto…", "Reacción habitual de tipos y dólar", "Reacción habitual del oro"],
              rows: [
                ["Dato de inflación por encima de lo previsto", "Se esperan tipos más altos: rentabilidades y dólar suben", "Suele caer, al menos al principio"],
                ["Dato de empleo más débil de lo previsto", "Se esperan tipos más bajos: rentabilidades y dólar bajan", "Suele subir"],
                ["La Fed suena más dura (inclinada a tipos altos) de lo esperado", "Rentabilidades y dólar suben", "Suele caer"],
                ["La Fed suena más blanda (inclinada a bajar tipos) de lo esperado", "Rentabilidades y dólar bajan", "Suele subir"],
              ],
            },
            {
              type: 'p',
              text: "Fíjate en un detalle: una inflación más alta podría parecer buena para el oro, que se considera una protección frente a ella. Pero a corto plazo suele pesar más lo que el mercado espera que haga la Fed con los tipos. Por eso el oro a menudo **cae** con un dato de inflación alto, al menos en la primera reacción.",
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Antes de tu sesión, echa un vistazo a la dirección del dólar y de las rentabilidades de los bonos de EE. UU. No te dará la entrada, pero te ayudará a saber si el viento sopla a favor o en contra.",
            },
          ],
        },
      ],
      keyPoints: [
        "El oro no paga intereses: cuando los tipos reales suben, aumenta su coste de oportunidad.",
        "Tipo real ≈ tipo nominal − inflación esperada.",
        "Un dólar fuerte y unas rentabilidades reales al alza suelen pesar sobre el oro.",
        "Es una tendencia, no una ley: la relación puede debilitarse o romperse.",
      ],
      quiz: [
        {
          q: "Si el tipo nominal es del 4% y la inflación esperada del 3%, ¿cuál es el tipo real aproximado?",
          options: ["7%", "1%", "−1%", "12%"],
          answer: 1,
          explain: "Tipo real ≈ 4% − 3% = 1%.",
        },
        {
          q: "¿Por qué unos tipos reales altos suelen perjudicar al oro?",
          options: [
            "Porque aumentan el coste de oportunidad de tener un activo que no paga intereses",
            "Porque obligan a cerrar las minas",
            "Porque prohíben comprar oro",
            "Porque reducen el spread",
          ],
          answer: 0,
          explain:
            "Si los bonos ofrecen una ganancia real atractiva, renunciar a ella para tener oro sale más caro y parte del dinero se aleja del metal.",
        },
        {
          q: "Sale un dato de inflación por encima de lo previsto. ¿Cuál es la primera reacción más habitual del oro?",
          options: [
            "Sube siempre con fuerza",
            "No se mueve",
            "Suele caer, porque el mercado espera tipos más altos",
            "Se suspende la cotización",
          ],
          answer: 2,
          explain:
            "A corto plazo domina la expectativa de una Fed más dura: suben las rentabilidades y el dólar, y el oro suele caer al principio.",
        },
        {
          q: "El oro sube durante una semana en la que el dólar también sube. ¿Qué conclusión es correcta?",
          options: [
            "Los datos están mal",
            "Hay que vender oro porque la correlación volverá seguro",
            "El dólar ya no influye en el oro",
            "La relación inversa es una tendencia, no una ley: otros motores pueden dominar",
          ],
          answer: 3,
          explain:
            "Refugio, compras de bancos centrales u otros factores pueden imponerse durante un tiempo a la relación habitual con el dólar.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 3. Inflación, crisis y refugio
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n4-inflacion-refugio',
      title: "Inflación, crisis y el oro como refugio",
      summary:
        "Entenderás qué significa que el oro sea un activo refugio, cómo se comportó en crisis pasadas y qué implica eso para tu operativa.",
      minutes: 10,
      sections: [
        {
          heading: "El oro y la inflación",
          blocks: [
            {
              type: 'p',
              text: "La **inflación** es la subida general de los precios: con el mismo dinero compras menos cosas. El oro tiene fama de proteger frente a ella porque su cantidad no se puede ampliar a voluntad, como sí ocurre con el dinero.",
            },
            {
              type: 'p',
              text: "A **largo plazo**, esa idea tiene bastante respaldo histórico. A **corto y medio plazo**, la relación es mucho más irregular. Lo que suele importar es cómo responden los bancos centrales: si la inflación sube pero los tipos suben todavía más, los tipos reales aumentan y el oro puede sufrir.",
            },
            {
              type: 'callout',
              tone: 'key',
              text: "El oro reacciona más a los **tipos reales** que a la inflación por sí sola. Inflación alta con tipos reales negativos suele ser un buen entorno para el oro; inflación alta con tipos reales subiendo con fuerza, no tanto.",
            },
          ],
        },
        {
          heading: "Qué es un activo refugio",
          blocks: [
            {
              type: 'p',
              text: "Un **activo refugio** es aquel al que acuden los inversores cuando tienen miedo: crisis financieras, recesiones, conflictos. Además del oro, suelen considerarse refugio los bonos del Tesoro de EE. UU., el dólar, el yen japonés y el franco suizo.",
            },
            {
              type: 'p',
              text: "El oro tiene una característica especial: **no depende de que nadie te pague**. Un bono depende de que el emisor cumpla; un depósito, de que el banco siga en pie. El oro físico no tiene ese **riesgo de contraparte** (el riesgo de que la otra parte no cumpla), y por eso atrae cuando se duda del sistema financiero.",
            },
          ],
        },
        {
          heading: "Lo que enseñan las crisis pasadas",
          blocks: [
            {
              type: 'p',
              text: "Sin entrar en cifras exactas, algunos episodios dejan lecciones claras:",
            },
            {
              type: 'list',
              items: [
                "**Años 70**: con inflación alta y el fin de la convertibilidad del dólar en oro en 1971, el oro vivió una de las mayores subidas de su historia.",
                "**Crisis financiera de 2008**: en la fase más aguda, el oro también cayó durante semanas, porque muchos inversores vendían lo que podían para conseguir liquidez. Después, con tipos muy bajos y estímulos de los bancos centrales, subió con fuerza durante los años siguientes.",
                "**Pandemia de 2020**: en marzo hubo una fase de pánico con caídas en casi todos los activos, el oro incluido. En los meses siguientes, con tipos en mínimos y estímulos enormes, el oro alcanzó máximos históricos ese verano.",
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              title: "La lección",
              text: "En el primer golpe de una crisis manda la **necesidad de liquidez**: se vende lo que se puede vender, y el oro se vende con facilidad. El papel de refugio suele aparecer **después**, cuando los bancos centrales responden y el miedo se asienta.",
            },
          ],
        },
        {
          heading: "Tensiones geopolíticas",
          blocks: [
            {
              type: 'p',
              text: "Conflictos, tensiones entre países o sustos políticos suelen provocar **subidas rápidas** del oro. Muchas veces, si la situación no empeora, esas subidas se deshacen en horas o días.",
            },
            {
              type: 'p',
              text: "Para un trader, eso significa que un titular puede generar velas enormes en minutos, en cualquier dirección y a cualquier hora, incluso fuera del calendario de datos programados.",
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "No persigas un pico de pánico. Comprar después de una vela de $20 provocada por un titular es entrar donde ya entró todo el mundo, con el stop lejos y un riesgo alto de que el movimiento se dé la vuelta.",
            },
          ],
        },
        {
          heading: "Qué implica para tu operativa",
          blocks: [
            {
              type: 'p',
              text: "Los periodos de incertidumbre traen **más volatilidad**. Aplicando lo que aprendiste en el nivel anterior: el stop debe respetar ese rango mayor y, para arriesgar lo mismo, operas menos lotes.",
            },
            {
              type: 'example',
              title: "Mismo riesgo, distinta volatilidad (ejemplo)",
              rows: [
                ["Riesgo por operación", "$100 (1% de $10,000)"],
                ["Mercado tranquilo: rango medio H1", "$8 → stop a 1.5 veces = $12"],
                ["Lotes en mercado tranquilo", "100 ÷ (12 × 100) = 0.083… → 0.08 lotes"],
                ["Mercado en tensión: rango medio H1", "$20 → stop a 1.5 veces = $30"],
                ["Lotes en mercado en tensión", "100 ÷ (30 × 100) = 0.033… → 0.03 lotes"],
              ],
              note: "En tensión operas casi tres veces menos lotes para arriesgar lo mismo. Si el stop necesario es tan amplio que ni el tamaño mínimo encaja en tu riesgo, la respuesta correcta es no operar.",
            },
            {
              type: 'list',
              items: [
                "Reduce el tamaño cuando el rango medio de las velas se dispara.",
                "Evita abrir justo después de un titular: espera a que el mercado se asiente.",
                "Recuerda que los titulares pueden darse la vuelta tan rápido como llegaron.",
              ],
            },
          ],
        },
      ],
      keyPoints: [
        "A largo plazo el oro tiende a conservar poder de compra; a corto plazo pesan más los tipos reales.",
        "Activo refugio: se busca en momentos de miedo; el oro físico no tiene riesgo de contraparte.",
        "En el primer golpe de una crisis manda la liquidez, y el oro también puede caer.",
        "Más incertidumbre = más volatilidad = stop más amplio y menos lotes.",
      ],
      quiz: [
        {
          q: "¿Qué entorno suele ser más favorable para el oro?",
          options: [
            "Inflación alta con tipos reales negativos",
            "Inflación baja con tipos reales subiendo con fuerza",
            "Tipos reales altos y dólar fuerte",
            "Bolsas tranquilas y tipos al alza",
          ],
          answer: 0,
          explain:
            "Con tipos reales negativos, guardar dinero en bonos pierde poder de compra y el coste de oportunidad del oro desaparece.",
        },
        {
          q: "¿Por qué el oro puede caer en la fase más aguda de una crisis?",
          options: [
            "Porque deja de ser un activo refugio para siempre",
            "Porque muchos inversores venden lo que pueden para conseguir liquidez",
            "Porque los bancos centrales prohíben comprarlo",
            "Porque el spread desaparece",
          ],
          answer: 1,
          explain:
            "En el primer momento, la prioridad es conseguir efectivo. El oro es fácil de vender y también sufre esas ventas.",
        },
        {
          q: "¿Qué es el riesgo de contraparte?",
          options: [
            "El riesgo de que el precio se mueva en tu contra",
            "El riesgo de que el spread se amplíe",
            "El riesgo de que quien debe pagarte no cumpla",
            "El riesgo de olvidar el stop loss",
          ],
          answer: 2,
          explain:
            "Un bono o un depósito dependen de que alguien cumpla. El oro físico no depende de nadie, y eso explica parte de su atractivo en las crisis.",
        },
        {
          q: "Un titular provoca una vela M15 de $20 al alza. ¿Qué es lo más prudente?",
          options: [
            "Comprar en el máximo para no quedarse fuera",
            "Vender sin stop porque seguro que gira",
            "Doblar el tamaño habitual",
            "Esperar a que el mercado se asiente y, si operas, adaptar el stop a la nueva volatilidad con menos lotes",
          ],
          answer: 3,
          explain:
            "Los picos por titulares pueden revertirse rápido. Esperar y ajustar stop y tamaño a la volatilidad protege tu cuenta.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Bancos centrales
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n4-bancos-centrales',
      title: "Bancos centrales: la Fed y las compras de oro",
      summary:
        "Entenderás por qué las reuniones de la Fed mueven el oro, cómo influyen las expectativas de tipos y por qué las compras de oro de los bancos centrales importan a largo plazo.",
      minutes: 10,
      sections: [
        {
          heading: "Dos papeles distintos",
          blocks: [
            {
              type: 'p',
              text: "Los bancos centrales influyen en el oro de dos maneras muy diferentes:",
            },
            {
              type: 'list',
              items: [
                "Como **responsables de la política monetaria**: deciden los tipos de interés y, con ello, mueven los tipos reales y el dólar.",
                "Como **compradores de oro**: muchos guardan oro en sus reservas, y algunos llevan años aumentándolas.",
              ],
            },
            {
              type: 'p',
              text: "El primer papel mueve el precio en horas o minutos. El segundo actúa despacio, a lo largo de años.",
            },
          ],
        },
        {
          heading: "La Fed y el FOMC",
          blocks: [
            {
              type: 'p',
              text: "La **Reserva Federal** (Fed) es el banco central de EE. UU. Como el oro cotiza en dólares, sus decisiones son las que más afectan a XAU/USD.",
            },
            {
              type: 'p',
              text: "Las decisiones sobre los tipos las toma el **FOMC** (Comité Federal de Mercado Abierto), que se reúne **8 veces al año**, aproximadamente cada seis semanas. El calendario de reuniones se publica con mucha antelación.",
            },
            {
              type: 'table',
              headers: ["Momento", "Qué ocurre"],
              rows: [
                ["14:00, hora de Nueva York", "Se publica la decisión de tipos y el comunicado"],
                ["Unos 30 minutos después", "Rueda de prensa del presidente de la Fed"],
                ["En 4 de las 8 reuniones", "Además, proyecciones económicas y de tipos de los miembros del comité"],
                ["Unas tres semanas después", "Se publican las actas de la reunión"],
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Las proyecciones se publican en las reuniones de marzo, junio, septiembre y diciembre. Esas reuniones suelen mover más el mercado, porque muestran hacia dónde creen los miembros de la Fed que irán los tipos. En horario de invierno, las 14:00 de Nueva York son las 19:00 UTC; con el horario de verano de EE. UU., las 18:00 UTC.",
            },
          ],
        },
        {
          heading: "Lo que importa son las expectativas",
          blocks: [
            {
              type: 'p',
              text: "El mercado no espera al anuncio para moverse. Con antelación, los mercados de futuros ya reflejan qué decisión se espera. Si la Fed hace exactamente lo previsto, la decisión en sí puede mover poco: lo que mueve es el **tono** y las pistas sobre lo que hará después.",
            },
            {
              type: 'list',
              items: [
                "Un mensaje **duro** (o restrictivo) apunta a tipos más altos, o altos durante más tiempo. Suele fortalecer el dólar y las rentabilidades, y pesar sobre el oro.",
                "Un mensaje **blando** (o expansivo) apunta a bajadas de tipos o a mantenerlos bajos. Suele debilitar el dólar y favorecer al oro.",
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "La primera reacción de las 14:00 puede darse la vuelta durante la rueda de prensa: basta una frase del presidente de la Fed para cambiar la lectura del mercado. Los días de Fed, el movimiento de los primeros minutos es especialmente poco fiable.",
            },
            {
              type: 'p',
              text: "Entre reunión y reunión, los miembros de la Fed dan discursos que también pueden mover el mercado. Las decisiones de otros bancos centrales, como el Banco Central Europeo, influyen en el oro sobre todo a través del dólar.",
            },
          ],
        },
        {
          heading: "Las compras de oro del sector oficial",
          blocks: [
            {
              type: 'p',
              text: "El **sector oficial** (bancos centrales y otras instituciones públicas) es uno de los grandes tenedores de oro del mundo. Desde hace años, en conjunto, los bancos centrales son **compradores netos** (compran más de lo que venden), y en los últimos años sus compras han sido especialmente intensas, según los datos que publican periódicamente organismos del sector como el World Gold Council.",
            },
            {
              type: 'p',
              text: "¿Por qué compran? Sobre todo para **diversificar sus reservas** y depender menos de una sola divisa, y porque el oro no depende de ningún gobierno ni tiene riesgo de contraparte. Muchos de los compradores más activos son bancos centrales de economías emergentes.",
            },
            {
              type: 'callout',
              tone: 'key',
              text: "Las compras de los bancos centrales son una **demanda estructural**: lenta, constante y poco sensible al precio a corto plazo. No la verás en una vela H1, pero ayuda a explicar por qué las caídas del oro han encontrado compradores en los últimos años.",
            },
          ],
        },
        {
          heading: "Cómo afecta a tu operativa",
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                "Marca en tu calendario las 8 reuniones del FOMC del año.",
                "Los días de Fed, no tengas posiciones abiertas a las 14:00 de Nueva York salvo que hayas decidido conscientemente asumir ese riesgo.",
                "No operes la primera reacción: espera al menos a que termine la rueda de prensa y a que cierre la vela H1.",
                "Recuerda que la demanda de los bancos centrales es un telón de fondo de largo plazo, no una señal de entrada.",
              ],
            },
          ],
        },
      ],
      keyPoints: [
        "La Fed influye en el oro a través de los tipos y del dólar; el FOMC se reúne 8 veces al año.",
        "La decisión se publica a las 14:00 de Nueva York y le sigue la rueda de prensa.",
        "Mueven la sorpresa y el tono frente a lo esperado: un mensaje duro suele pesar y uno blando suele apoyar.",
        "Las compras de oro de los bancos centrales son una demanda estructural de largo plazo.",
      ],
      quiz: [
        {
          q: "¿Cuántas veces al año se reúne el FOMC?",
          options: ["12", "4", "8", "Cada semana"],
          answer: 2,
          explain:
            "El FOMC celebra 8 reuniones programadas al año, aproximadamente cada seis semanas.",
        },
        {
          q: "La Fed decide exactamente lo que el mercado esperaba, pero anuncia que mantendrá los tipos altos más tiempo del previsto. ¿Reacción habitual del oro?",
          options: [
            "Suele caer, porque el mensaje es más duro de lo esperado",
            "Suele subir con fuerza",
            "No se mueve, porque la decisión era la esperada",
            "Se detiene la cotización",
          ],
          answer: 0,
          explain:
            "La decisión ya estaba descontada; la sorpresa está en el tono duro, que suele impulsar el dólar y las rentabilidades y pesar sobre el oro.",
        },
        {
          q: "¿Por qué compran oro muchos bancos centrales?",
          options: [
            "Para especular en M15",
            "Para diversificar sus reservas y depender menos de una sola divisa",
            "Para bajar los tipos de interés",
            "Porque la ley les obliga a comprar cada mes",
          ],
          answer: 1,
          explain:
            "El oro diversifica las reservas y no depende de ningún emisor. Es una demanda de largo plazo, poco sensible al precio a corto plazo.",
        },
        {
          q: "Son las 14:02 de Nueva York de un día de Fed y el oro ha subido $12 en dos minutos. ¿Qué haces?",
          options: [
            "Comprar ya, antes de que siga subiendo",
            "Vender, porque siempre se da la vuelta",
            "Abrir dos operaciones opuestas",
            "Esperar a que termine la rueda de prensa y a que cierre la vela H1",
          ],
          answer: 3,
          explain:
            "La primera reacción a la Fed es muy poco fiable y puede revertirse en la rueda de prensa. Esperar evita operar a ciegas.",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 5. Calendario económico
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n4-calendario',
      title: "El calendario económico: NFP, IPC y la Fed",
      summary:
        "Aprenderás a usar el calendario económico, a reconocer los datos que más mueven al oro y a interpretar la previsión frente al dato real.",
      minutes: 10,
      sections: [
        {
          heading: "Qué es el calendario económico",
          blocks: [
            {
              type: 'p',
              text: "El **calendario económico** es la lista de publicaciones programadas: datos de empleo, inflación y crecimiento, y decisiones de los bancos centrales. Para cada evento suele mostrar:",
            },
            {
              type: 'list',
              items: [
                "**Hora** de publicación (comprueba en qué zona horaria está configurado).",
                "**País** o divisa afectada. Para el oro, lo más importante es EE. UU. (USD).",
                "**Impacto** esperado: bajo, medio o alto, a menudo con colores o iconos.",
                "**Anterior**: el dato del periodo pasado, a veces revisado.",
                "**Previsión**: lo que espera el consenso de analistas.",
                "**Actual**: el dato real, que aparece en el momento de la publicación.",
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Hay muchos calendarios gratuitos en internet y casi todos muestran lo mismo. Lo importante es configurarlo en tu zona horaria y filtrar por impacto alto y por EE. UU.",
            },
          ],
        },
        {
          heading: "Los tres que más mueven al oro",
          blocks: [
            {
              type: 'table',
              headers: ["Evento", "Cuándo", "Por qué importa"],
              rows: [
                ["**NFP** (empleo no agrícola de EE. UU.)", "Normalmente el primer viernes del mes, a las 8:30 de Nueva York", "Mide la creación de empleo; junto a él salen la tasa de paro y los salarios. Pesa mucho en las expectativas de tipos."],
                ["**IPC** de EE. UU. (inflación; CPI en inglés)", "Una vez al mes, a las 8:30 de Nueva York", "Es la referencia de inflación más vigilada por el mercado."],
                ["**Decisión del FOMC**", "8 veces al año, a las 14:00 de Nueva York, con rueda de prensa después", "Fija los tipos y da pistas sobre su evolución."],
              ],
            },
            {
              type: 'p',
              text: "Otros datos con impacto: el índice **PCE** (la medida de inflación preferida por la Fed), el **PIB**, las **ventas minoristas**, las **peticiones semanales de subsidio por desempleo** (los jueves a las 8:30 de Nueva York) y los índices de actividad empresarial.",
            },
            {
              type: 'figure',
              name: 'sessions',
              caption: "Las sesiones del día: los datos de EE. UU. de las 8:30 de Nueva York salen al comienzo del solapamiento entre Londres y Nueva York.",
            },
            {
              type: 'callout',
              tone: 'key',
              text: "Las 8:30 de Nueva York son las **13:30 UTC** en horario de invierno y las **12:30 UTC** en verano. En España peninsular suelen ser las 14:30, salvo unas pocas semanas al año en que los cambios de hora de EE. UU. y de Europa no coinciden.",
            },
          ],
        },
        {
          heading: "Previsión contra dato real",
          blocks: [
            {
              type: 'p',
              text: "El precio no reacciona al dato en sí, sino a la **sorpresa**: la diferencia entre el dato real y la previsión. Un dato «bueno» que ya se esperaba puede no mover nada; un dato correcto pero peor de lo previsto puede mover mucho.",
            },
            {
              type: 'table',
              headers: ["Dato frente a la previsión", "Lectura del mercado", "Reacción habitual del oro"],
              rows: [
                ["NFP por encima", "Economía fuerte: tipos altos durante más tiempo; dólar al alza", "Suele bajar"],
                ["NFP por debajo", "Economía débil: posibles bajadas de tipos; dólar a la baja", "Suele subir"],
                ["IPC por encima", "Más inflación: la Fed podría endurecerse", "Suele bajar, al menos al principio"],
                ["IPC por debajo", "Menos presión para subir tipos", "Suele subir"],
              ],
            },
            {
              type: 'example',
              title: "Leer un NFP (cifras inventadas para el ejemplo)",
              rows: [
                ["Previsión", "150 mil empleos"],
                ["Dato real", "210 mil empleos"],
                ["Sorpresa", "+60 mil: más fuerte de lo esperado"],
                ["Dato anterior", "Revisado a la baja, de 165 mil a 120 mil"],
                ["Salarios", "En línea con la previsión"],
                ["Lectura posible", "Dato fuerte, pero matizado por la revisión: la reacción puede ser intensa al principio y corregirse después"],
              ],
              note: "Un mismo informe trae varias cifras. Si el empleo sorprende al alza pero el dato anterior se revisa a la baja o los salarios decepcionan, el mercado puede tardar minutos en decidir qué pesa más. Por eso la primera vela suele engañar.",
            },
          ],
        },
        {
          heading: "Niveles de impacto",
          blocks: [
            {
              type: 'p',
              text: "No todos los eventos merecen la misma atención:",
            },
            {
              type: 'list',
              items: [
                "**Alto**: NFP, IPC, decisiones y ruedas de prensa del FOMC; a veces también el PCE y el PIB. Pueden mover el oro muchos dólares en minutos.",
                "**Medio**: ventas minoristas, peticiones de subsidio, índices de actividad. Mueven, pero menos y no siempre.",
                "**Bajo**: datos secundarios. Rara vez cambian nada en el oro.",
              ],
            },
            {
              type: 'p',
              text: "El impacto real también depende del momento: si el mercado está pendiente sobre todo de la inflación, el IPC pesa todavía más; si la preocupación es el empleo, el NFP gana protagonismo.",
            },
          ],
        },
        {
          heading: "Tu rutina semanal",
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                "El domingo o el lunes, antes de empezar, abre el calendario y filtra por EE. UU. e impacto alto.",
                "Apunta el día y la hora de cada evento en **tu hora local**.",
                "Marca los días con NFP, IPC o Fed como días de prudencia.",
                "Antes de cada operación, comprueba si hay un evento de impacto alto en las próximas horas.",
                "Después de cada dato, anota la previsión, el dato real y cómo reaccionó el oro. Con el tiempo entenderás mucho mejor estas reacciones.",
              ],
            },
          ],
        },
      ],
      keyPoints: [
        "El calendario muestra hora, impacto, dato anterior, previsión y dato real.",
        "NFP: normalmente el primer viernes del mes a las 8:30 de Nueva York. IPC: mensual, a las 8:30. FOMC: 14:00 y rueda de prensa.",
        "El precio reacciona a la sorpresa frente a la previsión, no al dato aislado.",
        "Planifica la semana marcando los eventos de impacto alto en tu hora local.",
      ],
      quiz: [
        {
          q: "¿Cuándo se publica normalmente el NFP?",
          options: [
            "Todos los lunes a las 14:00 de Nueva York",
            "El primer viernes del mes a las 8:30 de Nueva York",
            "El último día del mes a medianoche",
            "Solo en las reuniones del FOMC",
          ],
          answer: 1,
          explain:
            "El informe de empleo de EE. UU. suele publicarse el primer viernes de cada mes a las 8:30, hora de Nueva York.",
        },
        {
          q: "La previsión del IPC era del 3.0% y el dato real sale en el 3.3%. ¿Cuál es la primera reacción más habitual del oro?",
          options: [
            "Suele subir, porque es una buena noticia",
            "No se mueve",
            "Suele bajar, porque aumenta la probabilidad de tipos más altos",
            "Se cierra el mercado",
          ],
          answer: 2,
          explain:
            "Una inflación por encima de lo previsto hace esperar una Fed más dura: suben el dólar y las rentabilidades, y el oro suele caer al principio.",
        },
        {
          q: "Un dato sale exactamente igual que la previsión. ¿Qué es lo más probable?",
          options: [
            "Una reacción limitada, porque ya estaba descontado",
            "Un movimiento enorme garantizado",
            "Que el oro suba siempre",
            "Que el calendario esté mal",
          ],
          answer: 0,
          explain:
            "Sin sorpresa, el mercado tiene poco que reajustar. Aun así, otros componentes del informe pueden mover el precio.",
        },
        {
          q: "¿A qué hora UTC sale un dato de las 8:30 de Nueva York en horario de invierno?",
          options: ["8:30 UTC", "12:30 UTC", "3:30 UTC", "13:30 UTC"],
          answer: 3,
          explain:
            "En invierno, Nueva York está 5 horas por detrás de UTC: 8:30 + 5 h = 13:30 UTC. En verano, la diferencia es de 4 horas (12:30 UTC).",
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 6. Operar alrededor de las noticias
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n4-operar-noticias',
      title: "Cómo actuar alrededor de las noticias",
      summary:
        "Aprenderás qué ocurre con el spread, el deslizamiento y los huecos durante una noticia, y unas reglas prácticas para protegerte.",
      minutes: 11,
      sections: [
        {
          heading: "Qué pasa en el mercado cuando sale un dato",
          blocks: [
            {
              type: 'p',
              text: "En los minutos previos a un dato de impacto alto, muchos participantes retiran sus órdenes y esperan. Hay menos **liquidez** (menos órdenes disponibles para cruzar) y, cuando el dato sale, el precio puede saltar varios dólares en segundos. Eso tiene consecuencias muy concretas:",
            },
            {
              type: 'list',
              items: [
                "**El spread se amplía**: la diferencia entre el precio de compra y el de venta puede multiplicarse durante unos minutos.",
                "**Deslizamiento** (slippage): tu orden se ejecuta a un precio peor que el que pediste, porque el precio se movió antes de poder ejecutarla.",
                "**Huecos** (gaps): el precio salta de un nivel a otro sin cotizar los precios intermedios.",
                "**Stops que se ejecutan peor**: al tocarse, un stop loss se convierte en una orden de cerrar al mejor precio disponible. Si el precio salta por encima de tu nivel, se cierra en el siguiente precio disponible, que puede estar bastante más lejos.",
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "El stop loss limita la pérdida en condiciones normales, pero **no garantiza el precio** en un salto brusco. Tu pérdida real puede ser mayor que la planificada.",
            },
          ],
        },
        {
          heading: "Cuánto puede costar",
          blocks: [
            {
              type: 'example',
              title: "Deslizamiento en un stop (ejemplo)",
              rows: [
                ["Posición", "Compra de 0.20 lotes en 3345.00"],
                ["Stop loss planificado", "3340.00 → $5.00 × 0.20 × 100 = $100 de riesgo"],
                ["Lo que pasa", "Un dato provoca un salto y el stop se ejecuta en 3336.00"],
                ["Pérdida real", "$9.00 × 0.20 × 100 = $180"],
                ["Desviación", "$80 más de lo planificado (1.8 veces el riesgo previsto)"],
              ],
            },
            {
              type: 'example',
              title: "Spread ampliado (ejemplo)",
              rows: [
                ["Spread normal", "0.30 → coste con 0.20 lotes: 0.30 × 0.20 × 100 = $6"],
                ["Spread durante la noticia (supuesto)", "1.50 → coste con 0.20 lotes: 1.50 × 0.20 × 100 = $30"],
              ],
              note: "El spread durante una noticia varía mucho según el momento y el proveedor; 1.50 es solo una cifra de ejemplo.",
            },
            {
              type: 'callout',
              tone: 'key',
              title: "Sobre el simulador",
              text: "El simulador de esta app usa un **spread fijo de 0.30** y resuelve las operaciones con velas H1, así que **no reproduce** el deslizamiento ni el spread ampliado de las noticias. En una cuenta real, los resultados alrededor de un dato serían peores que los que ves aquí.",
            },
          ],
        },
        {
          heading: "Reglas prácticas para protegerte",
          blocks: [
            {
              type: 'p',
              text: "Lo que sigue es material educativo, no una recomendación personal. Son reglas que muchos traders adoptan de una forma u otra; adáptalas a tu propio plan:",
            },
            {
              type: 'table',
              headers: ["Regla", "Por qué"],
              rows: [
                ["No abrir posiciones nuevas desde unos 30 minutos antes de un dato de impacto alto", "Evitas entrar justo cuando la liquidez desaparece"],
                ["No operar los primeros 15–30 minutos después del dato", "La primera reacción suele ser errática y a menudo se corrige"],
                ["Si operas un día de noticias, reducir el tamaño (por ejemplo, a la mitad)", "Compensa el riesgo de deslizamiento y de stops ejecutados peor"],
                ["Decidir antes del dato qué hacer con las posiciones abiertas", "Cerrar, reducir o mantener, pero nunca improvisar en el momento"],
                ["Ampliar el stop si la volatilidad lo exige, con menos lotes", "El ruido después del dato es mayor que el habitual"],
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Escribe tus reglas de noticias en tu plan de trading con números concretos. «Tener cuidado» no es una regla; «nada nuevo desde 30 minutos antes hasta 15 minutos después» sí lo es.",
            },
          ],
        },
        {
          heading: "Un día de NFP, paso a paso",
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                "**Por la mañana**: revisa el calendario, anota la previsión y marca en H1 las zonas importantes por encima y por debajo del precio.",
                "**30 minutos antes**: no abres nada nuevo. Si tienes una posición, aplicas lo que habías decidido: cerrarla, reducirla o mantenerla aceptando que el stop podría ejecutarse peor.",
                "**8:30 de Nueva York**: sale el dato. Observas, no actúas. Anotas la sorpresa frente a la previsión.",
                "**15–30 minutos después**: compruebas si el precio ha llegado a alguna de tus zonas y si la estructura en M15 se ha calmado.",
                "**Si hay operación**: tamaño reducido, stop más allá de la zona y adaptado a la nueva volatilidad, y R:R mínimo de 1:2.",
                "**Si no la hay**: no pasa nada. Ningún dato es obligatorio.",
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "Evita dejar **órdenes pendientes** (órdenes que se activan solas al llegar a un precio) justo por encima y por debajo del precio para «cazar» el movimiento del dato. Con el spread ampliado y el deslizamiento, es frecuente que se ejecuten a precios muy malos, o incluso las dos.",
            },
          ],
        },
        {
          heading: "Practicar sin riesgo",
          blocks: [
            {
              type: 'p',
              text: "El simulador es un buen lugar para **observar** cómo reacciona el oro a los datos, aunque no reproduzca sus costes reales. Con el **modo replay** (opción «Ir a» una fecha) puedes ir a un viernes de NFP pasado (normalmente el primero de cada mes) y ver qué hicieron las velas alrededor de las 13:30 UTC en invierno o de las 12:30 UTC en verano.",
            },
            {
              type: 'list',
              items: [
                "¿Cuánto midió la vela H1 del dato comparada con las anteriores?",
                "¿La primera dirección se mantuvo o se dio la vuelta en la hora siguiente?",
                "¿El precio respetó alguna de las zonas que habrías marcado por la mañana?",
              ],
            },
            {
              type: 'p',
              text: "Anota lo que observes. Tras estudiar unas cuantas noticias tendrás una idea mucho más realista de lo que significa operar en esos momentos, y probablemente valorarás más las reglas de esta lección.",
            },
          ],
        },
      ],
      keyPoints: [
        "Con noticias de impacto alto, el spread se amplía y aparecen deslizamientos y huecos.",
        "El stop loss no garantiza el precio en un salto brusco: la pérdida real puede superar la planificada.",
        "Reglas útiles: nada nuevo desde un rato antes del dato, esperar a que se asiente el primer movimiento y reducir el tamaño.",
        "El simulador usa un spread fijo y no reproduce estos costes: en real serían mayores.",
      ],
      quiz: [
        {
          q: "¿Qué es el deslizamiento?",
          options: [
            "Una comisión fija por operación",
            "La ejecución de una orden a un precio peor que el solicitado",
            "Un patrón de velas",
            "La diferencia entre el tipo nominal y el real",
          ],
          answer: 1,
          explain:
            "Cuando el precio se mueve muy deprisa, la orden se ejecuta en el siguiente precio disponible, que puede ser peor que el que pediste.",
        },
        {
          q: "Tienes 0.10 lotes con el stop a $6 de la entrada. Un dato provoca un hueco y el stop se ejecuta a $10 de la entrada. ¿Cuál es la pérdida real?",
          options: ["$100", "$60", "$1,000", "$10"],
          answer: 0,
          explain:
            "Pérdida = $10 × 0.10 × 100 = $100, en lugar de los $60 planificados ($6 × 0.10 × 100).",
        },
        {
          q: "¿Qué afirmación sobre el simulador de la app es correcta?",
          options: [
            "Reproduce exactamente el spread de las noticias",
            "Garantiza que en real los stops nunca tendrán deslizamiento",
            "Usa un spread fijo de 0.30 y no reproduce el deslizamiento de las noticias",
            "No permite poner stop loss",
          ],
          answer: 2,
          explain:
            "El simulador usa un spread fijo de 0.30 y velas H1. En una cuenta real, los costes alrededor de las noticias serían mayores.",
        },
        {
          q: "Faltan 10 minutos para el IPC de EE. UU. y ves una entrada que te gusta. Según las reglas de la lección, ¿qué haces?",
          options: [
            "Entrar con el doble de tamaño",
            "Entrar sin stop para que el hueco no lo salte",
            "Entrar y mover el stop durante el dato",
            "No abrir nada nuevo y esperar a que se asiente el primer movimiento tras el dato",
          ],
          answer: 3,
          explain:
            "Abrir justo antes de un dato de impacto alto expone a spread ampliado, huecos y deslizamiento. La regla es esperar.",
        },
      ],
    },
  ],
};
