import type { Level } from './types';

export const nivel6: Level = {
  id: 'n6',
  number: 6,
  title: 'Mentalidad y rendimiento',
  subtitle: 'Pensar y medir como un profesional',
  description:
    "Al terminar este nivel sabrás reconocer los sesgos que te hacen romper el plan, seguir una rutina con diario y leer tus estadísticas para mejorar con datos. También entenderás cómo funcionan las cuentas de fondeo y cómo dar el paso a una cuenta real de forma responsable.",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'n6-sesgos',
      title: 'Los sesgos que vacían cuentas',
      summary:
        'Reconocerás cinco sesgos que llevan a romper el plan y tendrás una regla concreta para neutralizar cada uno.',
      minutes: 10,
      sections: [
        {
          heading: 'Tu cerebro no está diseñado para operar',
          blocks: [
            {
              type: 'p',
              text: "Un **sesgo cognitivo** es un atajo mental que nos hace decidir de forma predecible, pero equivocada, en ciertas situaciones. En la vida diaria esos atajos son útiles; en el trading, donde cada decisión implica incertidumbre y dinero, pueden salir muy caros.",
            },
            {
              type: 'p',
              text: "No puedes eliminarlos a fuerza de voluntad. Lo que sí puedes hacer es reconocer cómo aparecen y tener **reglas escritas** que actúen antes de que el sesgo decida por ti.",
            },
            {
              type: 'callout',
              tone: 'key',
              text: "La pregunta útil no es «¿cómo dejo de sentir esto?», sino «¿qué regla me impide actuar cuando lo siento?».",
            },
          ],
        },
        {
          heading: 'FOMO: el miedo a quedarse fuera',
          blocks: [
            {
              type: 'p',
              text: "El **FOMO** (del inglés fear of missing out, miedo a perderse algo) aparece cuando ves una vela enorme y sientes que, si no entras ya, perderás la oportunidad.",
            },
            {
              type: 'list',
              items: [
                'Cómo se manifiesta: entras en mitad del movimiento, sin setup, con el stop lejos o sin calcular el tamaño.',
                'Por qué hace daño: compras donde otros ya están recogiendo beneficios, lejos de cualquier invalidación lógica y con un R:R malo.',
                'Regla: «Si la entrada no cumple la checklist, no existe. Si me he perdido el movimiento, espero un retroceso o un retesteo, o lo dejo pasar».',
              ],
            },
          ],
        },
        {
          heading: 'Operar por venganza',
          blocks: [
            {
              type: 'p',
              text: "Tras una pérdida, sobre todo si dolió, aparece el impulso de recuperarla cuanto antes. Es el **trading por venganza**: operar como si el mercado te debiera algo.",
            },
            {
              type: 'list',
              items: [
                'Cómo se manifiesta: abres otra operación justo después de un stop, a menudo más grande y sin setup.',
                'Por qué hace daño: encadenas decisiones en tu peor estado emocional y una pérdida normal se convierte en un mal día.',
                'Regla: «Después de un stop, pausa obligatoria de 30 minutos lejos de la pantalla. Después de dos pérdidas seguidas, se acabó el día. El tamaño nunca sube después de una pérdida».',
              ],
            },
          ],
        },
        {
          heading: 'Exceso de confianza tras una racha',
          blocks: [
            {
              type: 'p',
              text: "Después de varias operaciones ganadoras es fácil sentir que has descifrado el mercado. El **exceso de confianza** te empuja a saltarte la checklist o a subir el riesgo justo cuando más tranquilo te sientes.",
            },
            {
              type: 'example',
              title: 'Las mismas tres pérdidas con distinto riesgo (cuenta de $10,000)',
              rows: [
                ['Riesgo fijo de $100 (1%)', '3 pérdidas = −$300 (−3%)'],
                ['Riesgo subido a $300 (3%) «porque estoy en racha»', '3 pérdidas = −$900 (−9%)'],
              ],
              note: 'Una racha ganadora no cambia las probabilidades de la siguiente operación. Lo que sí cambia es cuánto te juegas si decides arriesgar más.',
            },
            {
              type: 'p',
              text: "Regla: «El riesgo por operación solo cambia en la revisión programada y con datos de al menos 30 operaciones, nunca por una racha, ni buena ni mala».",
            },
          ],
        },
        {
          heading: 'Aversión a la pérdida: mover el stop',
          blocks: [
            {
              type: 'p',
              text: "Perder duele más de lo que alegra ganar la misma cantidad. Esa **aversión a la pérdida** produce dos conductas muy dañinas: alejar el stop para no aceptar la pérdida y cerrar las ganadoras demasiado pronto por miedo a devolver lo ganado.",
            },
            {
              type: 'example',
              title: 'Lo que cuesta alejar el stop',
              rows: [
                ['Plan original', 'Compra de 0.10 lotes en 3320.00, stop en 3310.00, objetivo en 3340.00 → riesgo $100 (1%), R:R 1:2'],
                ['Stop alejado a 3300.00', 'Riesgo 0.10 × 100 × $20 = $200 (2%); R:R 1:1'],
              ],
              note: 'Sin decidirlo de antemano, has duplicado el riesgo y has reducido el R:R a la mitad.',
            },
            {
              type: 'p',
              text: "Regla: «El stop solo se mueve para reducir el riesgo, nunca para ampliarlo». En el simulador la operación corre sola hasta el SL o el TP, lo que te ayuda a entrenar justo esa disciplina.",
            },
          ],
        },
        {
          heading: 'Sesgo de confirmación',
          blocks: [
            {
              type: 'p',
              text: "El **sesgo de confirmación** te lleva a buscar solo lo que apoya tu idea y a ignorar lo que la contradice. Si ya has decidido que el oro va a subir, todas las noticias te parecen alcistas y cualquier soporte, sólido.",
            },
            {
              type: 'list',
              items: [
                'Cómo se manifiesta: cambias de indicador o de marco temporal hasta encontrar uno que te dé la razón, o ignoras un cierre por debajo del soporte.',
                'Regla: «Antes de entrar, escribo en las notas qué me demostraría que estoy equivocado y en qué precio». Si no encuentras nada que pueda invalidar tu idea, no la has analizado.',
              ],
            },
            {
              type: 'table',
              headers: ['Sesgo', 'Señal de alarma', 'Regla'],
              rows: [
                ['FOMO', '«Si no entro ya, me lo pierdo»', 'Sin checklist completa no hay entrada'],
                ['Venganza', 'Ganas de recuperar justo después de un stop', 'Pausa de 30 minutos; dos pérdidas seguidas, fin del día'],
                ['Exceso de confianza', 'Ganas de subir el riesgo tras una racha', 'El riesgo solo cambia en la revisión, con datos'],
                ['Aversión a la pérdida', 'Ganas de alejar el stop', 'El stop solo se mueve para reducir el riesgo'],
                ['Confirmación', 'Solo ves argumentos a favor', 'Escribe qué invalidaría la idea antes de entrar'],
              ],
            },
          ],
        },
      ],
      keyPoints: [
        'Los sesgos no se eliminan con fuerza de voluntad; se neutralizan con reglas escritas.',
        'El FOMO y la venganza se combaten con la checklist y con pausas obligatorias.',
        'El riesgo no cambia por una racha: solo en la revisión y con datos.',
        'El stop solo se mueve para reducir el riesgo, nunca para ampliarlo.',
        'Antes de entrar, escribe qué invalidaría tu idea.',
      ],
      quiz: [
        {
          q: 'Acabas de cerrar una operación en pérdida y sientes la urgencia de abrir otra para recuperarla. ¿Qué sesgo es y qué regla aplicas?',
          options: [
            'Exceso de confianza: subo el riesgo',
            'FOMO: entro ya',
            'Trading por venganza: pausa obligatoria y nunca subir el tamaño tras una pérdida',
            'Sesgo de confirmación: busco más indicadores',
          ],
          answer: 2,
          explain:
            'La urgencia por recuperar una pérdida es la señal típica del trading por venganza. La pausa rompe la cadena de decisiones en caliente.',
        },
        {
          q: 'Tras cinco ganadoras, pasas del 1% al 3% de riesgo en una cuenta de $10,000 y las tres siguientes operaciones pierden. ¿Cuál es la diferencia?',
          options: [
            'Pierdes unos $900 en lugar de $300',
            'Pierdes lo mismo',
            'Pierdes $300 en lugar de $100',
            'Tras una racha ganadora eso no puede pasar',
          ],
          answer: 0,
          explain:
            'Con $300 por operación, tres pérdidas suman $900 (un 9%); con $100, $300 (un 3%). La racha anterior no protege de la siguiente.',
        },
        {
          q: '¿Cuál es la regla correcta sobre el stop loss?',
          options: [
            'Se aleja si el precio se acerca',
            'Se quita si la operación va mal',
            'Se mueve a la mitad de distancia cuando hay dudas',
            'Solo se mueve para reducir el riesgo, nunca para ampliarlo',
          ],
          answer: 3,
          explain:
            'Alejar el stop aumenta el riesgo sin haberlo decidido de antemano y empeora el R:R. Esa es la trampa de la aversión a la pérdida.',
        },
        {
          q: '¿Qué hábito ayuda contra el sesgo de confirmación?',
          options: [
            'Buscar opiniones que coincidan con la tuya',
            'Escribir antes de entrar qué te demostraría que estás equivocado',
            'Añadir indicadores hasta que todos coincidan',
            'Operar solo cuando sale una noticia',
          ],
          answer: 1,
          explain:
            'Obligarte a definir la invalidación te hace mirar también los argumentos en contra, que es justo lo que el sesgo intenta evitar.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n6-rutina',
      title: 'La rutina del trader: antes, durante y después de operar',
      summary:
        'Diseñarás una rutina en tres fases que te ayuda a llegar preparado, a seguir el plan durante la sesión y a aprender de cada día.',
      minutes: 9,
      sections: [
        {
          heading: 'Por qué una rutina',
          blocks: [
            {
              type: 'p',
              text: "Una **rutina** es una secuencia fija de pasos que repites en cada sesión. Su objetivo es que llegues a la pantalla con las decisiones difíciles ya tomadas, para que durante la sesión solo tengas que ejecutar.",
            },
            {
              type: 'p',
              text: "Se parece a la lista de comprobación de un piloto antes de despegar: no la sigue porque no sepa volar, sino porque sabe que la memoria falla justo cuando hay presión.",
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Una rutina corta que cumples siempre vale más que una perfecta que abandonas a la semana. Empieza con **15 minutos antes y 15 minutos después** de cada sesión.",
            },
          ],
        },
        {
          heading: 'Antes: la checklist previa',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                'Estado personal: ¿has dormido bien?, ¿estás tranquilo? Si no, reduce el riesgo o no operes hoy.',
                'Calendario económico: anota las horas de los datos de alto impacto (empleo, inflación, decisiones de tipos de interés) y decide qué harás alrededor de ellos.',
                'Marcos temporales superiores: revisa D1 y H4 y marca la tendencia y los niveles clave.',
                'Escenarios: escribe uno o dos planes del tipo «si ocurre X, buscaré el setup Y».',
                'Límites del día: recuerda cuánto puedes perder hoy y cuántas operaciones puedes hacer.',
              ],
            },
            {
              type: 'example',
              title: 'Nota previa de una sesión',
              rows: [
                ['Estado', 'Descansado y sin prisa'],
                ['Calendario', 'Dato de inflación de EE. UU. a media sesión: nada nuevo 30 minutos antes ni 30 minutos después'],
                ['Contexto H4', 'Alcista; precio por encima de la MA50; zona de soporte en 3305.00 – 3310.00'],
                ['Escenario A', 'Si retrocede a 3305.00 – 3310.00 y cierra una vela de rechazo en H1: setup de retroceso, compra'],
                ['Escenario B', 'Si una vela de H1 cierra por debajo de 3300.00: tendencia en duda, no compro'],
                ['Límites', 'Máximo 2 operaciones y −2% ($200)'],
              ],
              note: 'Con los escenarios escritos, durante la sesión solo tienes que comprobar cuál se cumple, si es que alguno lo hace.',
            },
          ],
        },
        {
          heading: 'Durante: pocas reglas, muy claras',
          blocks: [
            {
              type: 'list',
              items: [
                'Solo opero los setups del plan, y solo si la checklist se cumple entera.',
                'Escribo el motivo en las notas antes de pulsar Comprar o Vender, nunca después.',
                'Compruebo en el panel de órdenes que el riesgo y el R:R son los del plan.',
                'No abro operaciones en la ventana que he marcado alrededor de los datos de alto impacto.',
                'Si alcanzo el límite de pérdidas o de operaciones, cierro la plataforma.',
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "Pasar horas mirando el gráfico sin un plan no es trabajar: es la forma más rápida de acabar viendo setups donde no los hay. Si no hay nada, aléjate y vuelve a una hora concreta.",
            },
          ],
        },
        {
          heading: 'Después: la revisión de la sesión',
          blocks: [
            {
              type: 'p',
              text: "La revisión es la parte que más se salta y la que más enseña. No se trata de lamentar las pérdidas, sino de comprobar si has seguido tu proceso.",
            },
            {
              type: 'list',
              ordered: true,
              items: [
                'Completa cada operación en tu diario: captura del gráfico, notas y emoción.',
                'Responde sí o no: ¿he seguido el plan en cada operación?',
                'Anota el error principal del día, si lo hubo, y una lección concreta.',
                'Mira el calendario del Diario para ver el resultado del día en su contexto.',
                'Deja preparados los niveles y escenarios para la próxima sesión.',
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: "Evalúa el día por **cómo has ejecutado**, no por el resultado. Un día con dos pérdidas siguiendo el plan es un buen día de trabajo; un día con una ganancia saltándote las reglas, no.",
            },
          ],
        },
        {
          heading: 'Tu rutina en una hoja',
          blocks: [
            {
              type: 'table',
              headers: ['Momento', 'Tareas', 'Tiempo aproximado'],
              rows: [
                ['Antes', 'Estado personal, calendario, D1 y H4, escenarios y límites', '15–20 min'],
                ['Durante', 'Esperar setups, checklist, notas, controlar riesgo y límites', 'Tu horario de trading'],
                ['Después', 'Diario, autoevaluación, lección y preparar la próxima sesión', '15 min'],
                ['Cada semana', 'Revisar estadísticas y el plan', '30–60 min'],
              ],
            },
            {
              type: 'p',
              text: "Pega esta hoja junto a la pantalla o guárdala junto a tu plan. Al principio te parecerá lenta; en pocas semanas la harás casi sin pensar.",
            },
          ],
        },
      ],
      keyPoints: [
        'La rutina convierte las decisiones difíciles en decisiones tomadas antes de la sesión.',
        'Antes: estado personal, calendario, contexto en D1 y H4, escenarios y límites.',
        'Durante: solo setups del plan, notas antes de entrar y respeto a los límites.',
        'Después: diario, autoevaluación del proceso y una lección concreta.',
      ],
      quiz: [
        {
          q: '¿Cuál es el objetivo principal de la rutina previa?',
          options: [
            'Encontrar el máximo número de operaciones',
            'Llegar a la sesión con las decisiones difíciles ya tomadas',
            'Predecir el precio de cierre del día',
            'Ver qué opinan otros traders',
          ],
          answer: 1,
          explain:
            'Con el contexto, los escenarios y los límites decididos de antemano, durante la sesión solo tienes que ejecutar.',
        },
        {
          q: '¿Cuándo escribes el motivo de la operación en las notas?',
          options: [
            'Antes de pulsar Comprar o Vender',
            'Al final de la semana',
            'Solo si la operación pierde',
            'No es necesario',
          ],
          answer: 0,
          explain:
            'Escribirlo antes te obliga a comprobar el setup y evita que el resultado contamine tu explicación.',
        },
        {
          q: 'Has perdido dos operaciones siguiendo el plan y has llegado a tu límite. ¿Cómo valoras el día?',
          options: [
            'Como un mal día, porque has perdido dinero',
            'Como un día que hay que recuperar mañana con más riesgo',
            'Como un día sin nada que aprender',
            'Como un buen día de trabajo, porque has seguido tu proceso',
          ],
          answer: 3,
          explain:
            'Las pérdidas forman parte de cualquier sistema. Lo que depende de ti es la ejecución, y esa ha sido correcta.',
        },
        {
          q: 'En tu checklist previa ves un dato de inflación de EE. UU. a media sesión. ¿Qué haces según la lección?',
          options: [
            'Abro una operación justo antes para aprovechar el movimiento',
            'Lo ignoro: el análisis técnico basta',
            'Marco una ventana alrededor del dato en la que no abriré operaciones nuevas',
            'Duplico el riesgo ese día',
          ],
          answer: 2,
          explain:
            'Los datos de alto impacto pueden provocar movimientos bruscos y spreads más amplios. Decidir antes qué harás evita improvisar.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n6-diario',
      title: 'El diario de trading: qué anotar y cómo revisarlo',
      summary:
        'Sabrás qué registrar de cada operación y cómo hacer una revisión semanal que convierta tus operaciones en aprendizaje.',
      minutes: 9,
      sections: [
        {
          heading: 'Tu memoria no es un buen registro',
          blocks: [
            {
              type: 'p',
              text: "Sin un registro, recuerdas las operaciones espectaculares y olvidas las aburridas; recuerdas lo que pensabas hacer y no lo que hiciste. El **diario de trading** convierte tu experiencia en datos que puedes revisar.",
            },
            {
              type: 'p',
              text: "La página **Diario** de la app registra automáticamente cada operación del simulador con su resultado, su R:R y su riesgo, y calcula tus estadísticas. Tu trabajo es añadir lo que la app no puede saber: por qué entraste, cómo te sentías y qué aprendiste.",
            },
          ],
        },
        {
          heading: 'Qué anotar en cada operación',
          blocks: [
            {
              type: 'table',
              headers: ['Campo', 'Qué escribes', 'Ejemplo'],
              rows: [
                ['Fecha', 'Día y sesión de la entrada', 'Martes, sesión de Londres'],
                ['Setup', 'Cuál de tus setups es', 'Retroceso en tendencia'],
                ['Motivo', 'Contexto y gatillo concretos', 'H4 alcista; vela envolvente en H1 sobre la zona 3305.00 – 3310.00'],
                ['Entrada / SL / TP', 'Los tres precios', '3312.50 / 3305.00 / 3327.50'],
                ['Riesgo %', 'Riesgo sobre el balance', '0.98%'],
                ['R:R', 'Relación planificada', '1:2'],
                ['Resultado', 'En dólares y en R', '+$195 (+2R)'],
                ['Emoción', 'Cómo te sentías al entrar y durante la operación', 'Tranquilo; algo impaciente esperando la confirmación'],
                ['Captura', 'Imagen del gráfico al entrar y al salir', 'Con la zona y los niveles dibujados'],
                ['Lección', 'Una frase útil para el futuro', 'Esperar al cierre de la vela me dio una entrada mejor'],
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Escribe el **motivo antes de entrar** y la **lección después de salir**. Si escribes las dos cosas a la vez, el resultado contamina el motivo.",
            },
          ],
        },
        {
          heading: 'Una entrada completa, con números',
          blocks: [
            {
              type: 'example',
              title: 'Compra en retroceso (cuenta de $10,000, riesgo máximo 1%)',
              rows: [
                ['Entrada', '3312.50'],
                ['Stop loss', '3305.00 → distancia $7.50'],
                ['Tamaño', '$100 ÷ ($7.50 × 100) = 0.133 → 0.13 lotes'],
                ['Riesgo real', '0.13 × 100 × $7.50 = $97.50 (0.98%)'],
                ['Take profit', '3327.50 → distancia $15 = 2R'],
                ['Resultado', 'Toca el TP: 0.13 × 100 × $15 = +$195'],
              ],
              note: 'El resultado es +2R aunque en dólares sean $195 y no $200: al redondear los lotes hacia abajo, el riesgo real queda algo por debajo de $100.',
            },
            {
              type: 'p',
              text: "Fíjate en que el diario guarda las dos lecturas: dólares y R. Los dólares te dicen cuánto has ganado; las R te permiten comparar esta operación con cualquier otra, sea cual sea su tamaño.",
            },
          ],
        },
        {
          heading: 'Etiquetas para encontrar patrones',
          blocks: [
            {
              type: 'p',
              text: "Con decenas de operaciones, el valor del diario está en poder agruparlas. Usa siempre las mismas **etiquetas** en tus notas para filtrarlas después en la exportación a CSV.",
            },
            {
              type: 'list',
              items: [
                'Por setup: retroceso, ruptura, rango.',
                'Por sesión: Asia, Londres, Nueva York.',
                'Por error: entrada sin confirmación, fuera del plan, objetivo forzado, junto a una noticia.',
                'Por emoción: tranquilo, impaciente, con miedo, eufórico.',
              ],
            },
            {
              type: 'p',
              text: "Con etiquetas, preguntas como «¿me va mejor en Londres o en Nueva York?» o «¿qué pasa cuando opero impaciente?» se responden con datos y no con impresiones.",
            },
          ],
        },
        {
          heading: 'La revisión semanal',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                'Abre el Diario y revisa la semana: resultado, porcentaje de acierto, R:R medio y drawdown.',
                'Calcula qué parte de tus operaciones siguieron el plan al 100%.',
                'Agrupa por setup y por etiqueta de error: ¿qué se repite más?',
                'Elige la mejor y la peor operación por ejecución (no por resultado) y mira sus capturas.',
                'Decide un único cambio o foco para la semana siguiente y anótalo.',
              ],
            },
            {
              type: 'table',
              headers: ['', 'Resultado positivo', 'Resultado negativo'],
              rows: [
                ['Siguió el plan', 'Buena operación: repítela', 'Buena operación: forma parte del juego'],
                ['No siguió el plan', 'Mala operación con suerte: la más peligrosa', 'Mala operación: corrige el hábito'],
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: "La casilla más peligrosa es la de abajo a la izquierda: saltarte el plan y ganar **refuerza justo el hábito** que más tarde te costará caro.",
            },
          ],
        },
      ],
      keyPoints: [
        'El diario convierte tu experiencia en datos que puedes revisar.',
        'Anota fecha, setup, motivo, precios, riesgo, R:R, resultado, emoción, captura y lección.',
        'Escribe el motivo antes de entrar y la lección después de salir.',
        'Cada semana, revisa el proceso y no solo el resultado, y elige un único cambio.',
      ],
      quiz: [
        {
          q: '¿Qué aportas tú al diario que la página Diario no puede registrar sola?',
          options: [
            'El precio de entrada',
            'El resultado en dólares',
            'El motivo de la operación, tu emoción y la lección aprendida',
            'El R:R',
          ],
          answer: 2,
          explain:
            'Los precios, el resultado y el R:R se registran solos. El porqué, lo que sentías y lo que aprendiste solo puedes escribirlo tú.',
        },
        {
          q: 'Riesgo máximo de $100, entrada en 3312.50 y stop en 3305.00. ¿Qué tamaño usas sin pasarte de ese máximo?',
          options: ['0.13 lotes', '0.14 lotes', '1.33 lotes', '0.10 lotes'],
          answer: 0,
          explain:
            '$100 ÷ ($7.50 × 100) = 0.133. Redondeas hacia abajo a 0.13 lotes (riesgo real de $97.50); con 0.14 arriesgarías $105.',
        },
        {
          q: 'Te saltaste el plan y la operación ganó. ¿Cómo la clasificas en la revisión?',
          options: [
            'Como una buena operación',
            'Como una mala operación con suerte, la más peligrosa para tus hábitos',
            'Como la prueba de que el plan sobra',
            'No importa cómo se clasifique: ha ganado',
          ],
          answer: 1,
          explain:
            'El resultado no convierte en buena una decisión que rompió el plan. Ganar así refuerza un hábito que tarde o temprano sale caro.',
        },
        {
          q: '¿Por qué conviene usar siempre las mismas etiquetas en las notas?',
          options: [
            'Para que el gráfico se vea mejor',
            'Porque el simulador lo exige',
            'Para no tener que escribir el motivo',
            'Para poder agrupar y filtrar operaciones y encontrar patrones con datos',
          ],
          answer: 3,
          explain:
            'Etiquetas consistentes permiten filtrar la exportación a CSV y comparar setups, sesiones o estados emocionales.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n6-estadisticas',
      title: 'Leer tus estadísticas',
      summary:
        'Aprenderás a interpretar el porcentaje de acierto, el R:R medio, la esperanza, el drawdown, la curva de capital y las rachas, y cómo se relacionan entre sí.',
      minutes: 12,
      sections: [
        {
          heading: 'Las métricas que importan',
          blocks: [
            {
              type: 'p',
              text: "La página **Diario** te muestra el porcentaje de acierto, el P&L total, el R:R medio, el riesgo medio, el drawdown máximo, la curva de capital y un calendario con el resultado de cada día. Con esos datos también puedes calcular la esperanza y localizar tus rachas.",
            },
            {
              type: 'table',
              headers: ['Métrica', 'Qué mide', 'Qué te dice'],
              rows: [
                ['Porcentaje de acierto', 'Operaciones ganadoras ÷ total', 'Con qué frecuencia ganas; por sí solo no dice si eres rentable'],
                ['R:R medio', 'Relación media entre beneficio y riesgo', 'Cuánto ganas cuando aciertas comparado con lo que arriesgas'],
                ['Riesgo medio', 'Porcentaje medio del balance arriesgado', 'Si respetas tu regla de riesgo'],
                ['Esperanza', 'Resultado medio por operación', 'Si tu forma de operar tiene ventaja'],
                ['Drawdown máximo', 'Mayor caída desde un máximo de la cuenta', 'El peor momento que has tenido que soportar'],
                ['Curva de capital', 'Evolución del balance', 'Si los resultados son estables o dependen de pocas operaciones'],
                ['Racha', 'Pérdidas (o ganancias) seguidas', 'Qué debes estar preparado para aguantar'],
              ],
            },
          ],
        },
        {
          heading: 'Acierto y R:R, siempre juntos',
          blocks: [
            {
              type: 'p',
              text: "Un porcentaje de acierto alto no significa nada sin el R:R, y al revés. Lo que importa es la combinación. El **acierto mínimo** para no perder con un R:R dado se calcula así:",
            },
            {
              type: 'formula',
              label: 'Acierto de equilibrio',
              expr: 'Acierto mínimo = 1 ÷ (1 + R:R)',
              note: 'Con R:R 1:2 → 1 ÷ 3 = 33.3%. Por debajo de ese acierto pierdes dinero, aunque cada ganadora valga el doble que cada perdedora.',
            },
            {
              type: 'table',
              headers: ['R:R', 'Acierto mínimo para no perder'],
              rows: [
                ['1:1', '50%'],
                ['1:1.5', '40%'],
                ['1:2', '33.3%'],
                ['1:3', '25%'],
              ],
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "Desconfía de quien presume solo de su porcentaje de acierto. Un acierto muy alto con ganadoras pequeñas y perdedoras grandes puede vaciar una cuenta.",
            },
          ],
        },
        {
          heading: 'Esperanza: el resumen en una cifra',
          blocks: [
            {
              type: 'formula',
              label: 'Esperanza',
              expr: 'Esperanza = (% acierto × ganancia media) − (% fallo × pérdida media)',
              note: 'Si es positiva, de media ganas en cada operación; si es negativa, cuantas más operaciones hagas, más perderás.',
            },
            {
              type: 'example',
              title: 'Mucho acierto y esperanza negativa',
              rows: [
                ['Porcentaje de acierto', '70%'],
                ['Ganancia media', '$60'],
                ['Pérdida media', '$180'],
                ['Esperanza', '(0.70 × $60) − (0.30 × $180) = $42 − $54 = −$12'],
              ],
              note: 'Siete de cada diez operaciones ganan y, aun así, cada operación resta $12 de media. Es lo que ocurre cuando cierras rápido las ganadoras y dejas correr las perdedoras.',
            },
          ],
        },
        {
          heading: 'Drawdown, curva de capital y rachas',
          blocks: [
            {
              type: 'p',
              text: "El **drawdown** es la caída desde el punto más alto de tu cuenta hasta el punto más bajo posterior. Si tu balance sube a $10,800 y después baja a $9,990, el drawdown es de $810, un 7.5% del máximo. Para volver a $10,800 necesitas ganar un 8.1% desde $9,990: recuperar siempre exige un porcentaje mayor que el perdido.",
            },
            {
              type: 'figure',
              name: 'drawdown-recovery',
              caption: 'Cuanto mayor es la caída, mayor es el porcentaje que necesitas ganar para recuperarte.',
            },
            {
              type: 'p',
              text: "La **curva de capital** cuenta una historia que las cifras no cuentan. Una curva que sube de forma irregular pero constante es más fiable que una casi plana con un par de saltos enormes: en el segundo caso, todo tu resultado depende de dos operaciones.",
            },
            {
              type: 'p',
              text: "Las **rachas** perdedoras son normales incluso con una buena estrategia. Con un 40% de acierto, la probabilidad de perder cinco operaciones seguidas a partir de un momento dado es 0.6 × 0.6 × 0.6 × 0.6 × 0.6 ≈ 7.8%, y en una muestra de cien operaciones es casi seguro que te encuentres al menos una racha así. Si lo sabes de antemano, no abandonarás tu sistema en el peor momento.",
            },
          ],
        },
        {
          heading: 'Ejemplo: interpretar tus estadísticas',
          blocks: [
            {
              type: 'example',
              title: 'Tus estadísticas tras 50 operaciones (cuenta de $10,000)',
              rows: [
                ['Operaciones', '50: 21 ganadoras y 29 perdedoras'],
                ['Porcentaje de acierto', '21 ÷ 50 = 42%'],
                ['Ganancia media / pérdida media', '$190 / $100'],
                ['R:R medio', '1:1.9'],
                ['Riesgo medio', '1.0%'],
                ['P&L total', '(21 × $190) − (29 × $100) = $3,990 − $2,900 = +$1,090'],
                ['Esperanza', '(0.42 × $190) − (0.58 × $100) = $79.80 − $58 = +$21.80'],
                ['Drawdown máximo', '6.2%'],
                ['Peor racha', '6 pérdidas seguidas'],
              ],
            },
            {
              type: 'list',
              items: [
                'La esperanza es positiva: de media, cada operación suma $21.80, unas 0.22R con $100 de riesgo.',
                'Con un R:R de 1:1.9, el acierto mínimo para no perder es 1 ÷ 2.9 ≈ 34.5%. Tu 42% está por encima, con un margen razonable.',
                'El riesgo medio del 1% indica que has respetado tu regla de tamaño.',
                'Un drawdown del 6.2% y una racha de 6 pérdidas son coherentes con este acierto: debes esperarlos y tenerlos en cuenta en tus límites.',
                'Cincuenta operaciones siguen siendo una muestra modesta: sigue registrando y comprueba si los resultados se mantienen por setup y por sesión.',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Antes de cambiar nada, separa estrategia y ejecución. Filtra en el CSV las operaciones que siguieron el plan y compáralas con las que no: así sabrás si el problema está en el setup o en cómo lo ejecutas.",
            },
          ],
        },
      ],
      keyPoints: [
        'El porcentaje de acierto solo tiene sentido junto al R:R: acierto mínimo = 1 ÷ (1 + R:R).',
        'La esperanza resume en una cifra si tu forma de operar tiene ventaja.',
        'El drawdown máximo y las rachas te dicen qué debes estar preparado para soportar.',
        'Una curva de capital estable es más fiable que una que depende de pocas operaciones.',
      ],
      quiz: [
        {
          q: 'Con un R:R de 1:2, ¿qué porcentaje de acierto necesitas como mínimo para no perder?',
          options: ['50%', '25%', '33.3%', '66.7%'],
          answer: 2,
          explain: '1 ÷ (1 + 2) = 33.3%. Con ese acierto, las ganadoras compensan exactamente las perdedoras.',
        },
        {
          q: 'Acierto del 70%, ganancia media de $60 y pérdida media de $180. ¿Cuál es la esperanza?',
          options: ['−$12', '+$42', '+$12', '−$54'],
          answer: 0,
          explain: '(0.70 × $60) − (0.30 × $180) = $42 − $54 = −$12 por operación. Mucho acierto no basta si las pérdidas son grandes.',
        },
        {
          q: 'Tu balance pasa de un máximo de $10,800 a $9,990. ¿Cuál es el drawdown?',
          options: ['8.1%', '7.5%', '$9,990', '10%'],
          answer: 1,
          explain:
            'La caída es de $810 sobre el máximo: $810 ÷ $10,800 = 7.5%. El 8.1% es lo que necesitas ganar desde $9,990 para recuperarte.',
        },
        {
          q: 'Con el mismo beneficio total, ¿qué curva de capital es más fiable?',
          options: [
            'Una casi plana con dos saltos enormes',
            'Da igual: solo importa el resultado final',
            'La que más ha subido en la última semana',
            'Una que sube de forma irregular pero constante',
          ],
          answer: 3,
          explain:
            'Si el resultado depende de un par de operaciones, basta con que no se repitan para que desaparezca. Una subida constante indica una ventaja más estable.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n6-cuentas-fondeo',
      title: 'Cuentas de fondeo: cómo funcionan y cómo prepararte',
      summary:
        'Entenderás cómo suelen funcionar las evaluaciones de las empresas de fondeo, qué reglas imponen y cómo practicarlas en el simulador.',
      minutes: 10,
      sections: [
        {
          heading: 'Qué es una cuenta de fondeo',
          blocks: [
            {
              type: 'p',
              text: "Una **empresa de fondeo** ofrece a los traders la posibilidad de operar una cuenta mayor de la que podrían financiar por sí mismos, a cambio de superar una **evaluación** y respetar unas reglas estrictas. Normalmente pagas una tarifa para presentarte y, si la superas, recibes una parte de los beneficios que generes.",
            },
            {
              type: 'p',
              text: "Cada empresa tiene su propio modelo. En muchos casos, la cuenta «financiada» es en realidad una cuenta simulada, y la empresa paga según sus propias condiciones. Los detalles importan, y mucho.",
            },
            {
              type: 'callout',
              tone: 'warning',
              text: "Una cuenta de fondeo es un producto comercial, no un empleo ni un atajo. Si no superas la evaluación, pierdes la tarifa. Lee las condiciones completas, las normas para retirar beneficios y la reputación de la empresa **antes de pagar nada**.",
            },
          ],
        },
        {
          heading: 'Las fases y sus reglas',
          blocks: [
            {
              type: 'p',
              text: "La mayoría de evaluaciones tienen una o dos fases. En cada una debes alcanzar un objetivo de beneficio sin romper ninguna regla de pérdida. Estos son valores que se ven a menudo, pero **cambian de una empresa a otra**:",
            },
            {
              type: 'table',
              headers: ['Regla', 'Valor típico', 'Qué significa'],
              rows: [
                ['Objetivo de beneficio', 'Alrededor del 8–10% (a menudo menos en una segunda fase)', 'Lo que debes ganar para superar la fase'],
                ['Pérdida diaria máxima', 'Alrededor del 5%', 'Si en un solo día pierdes más, suspendes'],
                ['Pérdida total máxima', 'Alrededor del 10%', 'Si la cuenta cae por debajo de ese límite, suspendes'],
                ['Días mínimos de operación', 'Varía según la empresa', 'Debes operar al menos ese número de días distintos'],
                ['Plazo', 'Con o sin límite de tiempo', 'Algunas fases tienen fecha tope y otras no'],
                ['Tarifa', 'Depende del tamaño de la cuenta', 'Lo que pagas por intentarlo; algunas empresas la devuelven si superas la evaluación'],
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              title: 'Lee la letra pequeña',
              text: "Comprueba **cómo calcula** la empresa cada límite: si la pérdida diaria se mide sobre el balance o incluye las operaciones abiertas, a qué hora empieza el «día» y si el límite total es fijo o sube cuando tu cuenta crece. Dos empresas con «5% y 10%» pueden tener reglas muy distintas en la práctica.",
            },
          ],
        },
        {
          heading: 'Las reglas, en números',
          blocks: [
            {
              type: 'example',
              title: 'Evaluación hipotética sobre $10,000',
              rows: [
                ['Objetivo (8%)', '+$800 → balance de $10,800'],
                ['Pérdida diaria máxima (5%)', '$500 en un mismo día'],
                ['Pérdida total máxima (10%)', 'La cuenta no puede bajar de $9,000'],
                ['Riesgo por operación del 1%', '$100 → cinco pérdidas el mismo día te dejan justo en el límite diario'],
                ['Riesgo por operación del 0.5%', '$50 → harían falta diez pérdidas para llegar a ese límite'],
              ],
              note: 'Con un riesgo del 1%, el objetivo del 8% equivale a +8R netos. Si tu esperanza es de +0.20R por operación, necesitarías unas 40 operaciones de media, con rachas buenas y malas por el camino.',
            },
            {
              type: 'p',
              text: "Este cálculo te da una idea realista del esfuerzo: superar una evaluación es el resultado de muchas operaciones normales, no de una operación genial.",
            },
          ],
        },
        {
          heading: 'El error típico: forzar el objetivo',
          blocks: [
            {
              type: 'p',
              text: "La presión de la tarifa y del objetivo empuja a subir el riesgo para «acabar cuanto antes». Es justo lo contrario de lo que funciona. Con un riesgo del 4% por operación ($400 en una cuenta de $10,000), **dos pérdidas el mismo día** suman $800 y superan el límite diario del 5%.",
            },
            {
              type: 'list',
              items: [
                'Arriesga poco por operación (0.5–1%) para que una racha normal no te acerque a los límites.',
                'Ponte un límite diario personal más estricto que el de la empresa, por ejemplo un 2%.',
                'Si el plazo es largo o no existe, no hay prisa: el objetivo llega con muchas operaciones normales.',
                'Evita operar justo antes de datos de alto impacto, sobre todo si la empresa lo restringe o si el spread puede dispararse.',
              ],
            },
          ],
        },
        {
          heading: 'Practica las reglas en el simulador',
          blocks: [
            {
              type: 'p',
              text: "Tu cuenta demo de $10,000 es perfecta para ensayar una evaluación sin pagar nada. La clave es tratar los límites como si fueran reales.",
            },
            {
              type: 'list',
              ordered: true,
              items: [
                'Escribe en tu plan las reglas de tu evaluación de práctica: objetivo de $10,800, pérdida diaria máxima de $500 (y tu límite personal de $200) y un balance mínimo de $9,000. Si tu balance actual no es de $10,000, recalcula las cifras sobre el balance con el que empiezas.',
                'Opera solo tus setups y con un riesgo de como máximo el 1%. Los retos del simulador, como completar 5 operaciones con riesgo de como máximo el 2% o 3 con R:R de al menos 2, son un buen primer paso para fijar el hábito.',
                'Usa el calendario del Diario para comprobar cada día que no has superado la pérdida diaria, y el drawdown máximo para vigilar lo cerca que estás del límite total.',
                'Cuenta los días en los que has operado y anota si cumplirías el mínimo de días.',
                'Si rompes una regla, el intento queda suspendido: anótalo, revisa qué pasó y empieza otro con el balance que tengas en ese momento.',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              text: "Superar varias evaluaciones de práctica seguidas sin romper ninguna regla es una señal mucho mejor que haber superado una por suerte.",
            },
          ],
        },
      ],
      keyPoints: [
        'Una evaluación de fondeo exige alcanzar un objetivo sin romper los límites de pérdida diaria y total.',
        'Valores típicos: objetivo del 8–10%, pérdida diaria del 5% y total del 10%, pero cambian según la empresa.',
        'Lee cómo se calcula cada límite y las condiciones de tarifas y retiradas antes de pagar.',
        'Arriesga poco por operación y usa un límite diario personal más estricto que el de la empresa.',
        'Ensaya evaluaciones completas en el simulador antes de pagar por una real.',
      ],
      quiz: [
        {
          q: 'En una evaluación sobre $10,000 con una pérdida diaria máxima del 5%, ¿cuánto puedes perder como máximo en un día?',
          options: ['$100', '$500', '$1,000', '$50'],
          answer: 1,
          explain: 'El 5% de $10,000 son $500. Comprueba siempre si la empresa lo calcula sobre el balance inicial, el del día o incluyendo operaciones abiertas.',
        },
        {
          q: '¿Qué ocurre normalmente si no superas la evaluación?',
          options: [
            'La empresa te devuelve la tarifa',
            'Te dan otra cuenta gratis',
            'Debes pagar las pérdidas de la cuenta',
            'Pierdes la tarifa que pagaste',
          ],
          answer: 3,
          explain:
            'La tarifa es el coste de intentarlo. Por eso conviene practicar en el simulador hasta superar evaluaciones de prueba con regularidad.',
        },
        {
          q: '¿Por qué no conviene subir el riesgo al 4% por operación para alcanzar antes el objetivo?',
          options: [
            'Porque dos pérdidas el mismo día ($800) ya superarían el límite diario de $500',
            'Porque el objetivo sería más alto',
            'Porque el simulador no lo permite',
            'Porque los lotes no pueden pasar de 0.10',
          ],
          answer: 0,
          explain:
            'Con $400 por operación, dos pérdidas suman $800, por encima del 5% diario. Una racha completamente normal bastaría para suspender.',
        },
        {
          q: 'Antes de presentarte a una evaluación real, ¿qué es lo más importante revisar?',
          options: [
            'El diseño de la plataforma',
            'Solo el objetivo de beneficio',
            'Las reglas completas: cómo se calcula cada límite, plazos, días mínimos, tarifas y condiciones de retirada',
            'Lo que se comenta en redes sociales',
          ],
          answer: 2,
          explain:
            'Los valores y la forma de calcularlos cambian de una empresa a otra. Un detalle como cuándo empieza el «día» puede decidir si suspendes.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n6-de-demo-a-real',
      title: 'De la demo a la cuenta real: una transición responsable',
      summary:
        'Sabrás cuándo plantearte operar con dinero real, cómo elegir un bróker regulado y qué cambia al pasar de la demo a una cuenta real.',
      minutes: 10,
      sections: [
        {
          heading: 'Antes de dar el paso',
          blocks: [
            {
              type: 'callout',
              tone: 'warning',
              title: 'Dinero real, riesgo real',
              text: "Operar oro con apalancamiento puede hacerte perder dinero muy rápido, incluido **todo lo que deposites**. Usa solo dinero que puedas permitirte perder sin que afecte a tus gastos, tus deudas o tus ahorros de emergencia. Esta academia es formación, no asesoramiento financiero.",
            },
            {
              type: 'p',
              text: "La demo no es un juego: es tu periodo de prueba. Antes de plantearte operar con dinero real, comprueba con datos que estás preparado:",
            },
            {
              type: 'list',
              items: [
                'Tienes un plan escrito y lo has seguido durante semanas, no solo unos días.',
                'Has registrado al menos 50 operaciones con tus setups y tu esperanza es positiva.',
                'Tu riesgo medio es estable y no has roto tus límites diarios ni semanales.',
                'Has pasado por rachas perdedoras sin abandonar el plan ni subir el riesgo.',
              ],
            },
            {
              type: 'p',
              text: "Si alguna respuesta es «no», la demo todavía tiene mucho que enseñarte. No hay ninguna prisa.",
            },
          ],
        },
        {
          heading: 'Elegir un bróker regulado',
          blocks: [
            {
              type: 'p',
              text: "Un bróker **regulado** es una empresa autorizada y supervisada por la autoridad financiera de un país. La regulación no garantiza que ganes, pero sí te da unas protecciones básicas. Según el país y el regulador, puede incluir:",
            },
            {
              type: 'list',
              items: [
                'Separación entre el dinero de los clientes y el de la empresa.',
                'Requisitos mínimos de capital y controles periódicos.',
                'Normas sobre publicidad, apalancamiento máximo y advertencias de riesgo.',
                'Un procedimiento de reclamaciones y, en algunos casos, un fondo de compensación o protección frente a saldo negativo.',
              ],
            },
            {
              type: 'callout',
              tone: 'tip',
              title: 'Cómo comprobarlo',
              text: "Busca el número de licencia del bróker y compruébalo en el **registro oficial del regulador**, en la web del propio regulador y no solo en la del bróker. Verifica que el nombre y el dominio coinciden: existen webs clonadas que imitan a empresas reguladas.",
            },
            {
              type: 'callout',
              tone: 'warning',
              title: 'Señales de alarma',
              text: "Promesas de rentabilidad garantizada, llamadas insistentes para que deposites más, bonos a cambio de depósitos, «gestores» que se ofrecen a operar por ti y dificultades para retirar tu dinero. Ante cualquiera de ellas, aléjate.",
            },
          ],
        },
        {
          heading: 'Lo que cambia de la demo a la real',
          blocks: [
            {
              type: 'table',
              headers: ['Aspecto', 'En el simulador', 'En una cuenta real'],
              rows: [
                ['Emociones', 'Las pérdidas no duelen de verdad', 'Cada pérdida pesa; aparecen el miedo y la duda'],
                ['Spread', 'Fijo de 0.30', 'Variable; puede ampliarse mucho con noticias, en la pausa diaria o con poca liquidez'],
                ['Deslizamiento', 'El stop y el objetivo se ejecutan al precio fijado', 'En movimientos rápidos puedes salir a un precio peor que el de tu stop'],
                ['Costes', 'Solo el spread', 'Spread, posibles comisiones y costes por mantener posiciones de un día para otro'],
                ['Mercado', 'Velas históricas reproducidas', 'Mercado en directo, con huecos de precio e interrupciones'],
              ],
            },
            {
              type: 'p',
              text: "El **deslizamiento** (slippage) es la diferencia entre el precio que esperabas y el precio al que realmente se ejecuta tu orden. Con un stop en 3310.00, por ejemplo, un dato de alto impacto puede hacer que salgas en 3307.50: con 0.10 lotes, son 0.10 × 100 × $2.50 = $25 más de pérdida de lo previsto.",
            },
          ],
        },
        {
          heading: 'Empieza pequeño',
          blocks: [
            {
              type: 'p',
              text: "Lo sensato es empezar con una cuenta pequeña y un riesgo igual o menor que en la demo. Tu objetivo en los primeros meses no es ganar dinero, sino comprobar que **ejecutas igual** con dinero real.",
            },
            {
              type: 'example',
              title: 'Cuenta real de $1,000',
              rows: [
                ['Riesgo del 1%', '$10 por operación'],
                ['Stop a $5', '$10 ÷ ($5 × 100) = 0.02 lotes'],
                ['Stop a $12', '$10 ÷ ($12 × 100) = 0.008 → por debajo del mínimo de 0.01 lotes'],
                ['Con 0.01 lotes y stop a $12', 'Riesgo de 0.01 × 100 × $12 = $12, un 1.2%'],
              ],
              note: 'Con cuentas pequeñas, el lote mínimo limita los stops que puedes usar. Si una operación exige más riesgo del que tu plan permite, no se hace.',
            },
            {
              type: 'list',
              items: [
                'Define hitos para aumentar el tamaño: por ejemplo, 30 operaciones reales siguiendo el plan con resultados parecidos a los de la demo.',
                'Aumenta poco a poco, nunca después de una racha ni para recuperar pérdidas.',
                'Si tus resultados reales se separan mucho de los de la demo, vuelve a la demo y averigua por qué.',
              ],
            },
          ],
        },
        {
          heading: 'Tu plan de transición',
          blocks: [
            {
              type: 'list',
              ordered: true,
              items: [
                'Sigue en la demo hasta cumplir los criterios de la primera sección.',
                'Elige un bróker regulado y comprueba su licencia en el registro oficial del regulador.',
                'Deposita solo una cantidad que puedas perder por completo sin consecuencias para tu vida.',
                'Opera con el mismo plan, los mismos setups y un riesgo igual o menor.',
                'Lleva el diario con el mismo detalle y compara cada semana tus estadísticas reales con las de la demo.',
              ],
            },
            {
              type: 'callout',
              tone: 'key',
              text: "Nunca operes con dinero prestado ni con dinero que necesitas para vivir. Y recuerda que puedes volver a la demo en cualquier momento: **no es un paso atrás**, es parte del proceso.",
            },
          ],
        },
      ],
      keyPoints: [
        'Pasa a real solo con un plan probado, una muestra amplia y los límites respetados.',
        'Elige un bróker regulado y comprueba su licencia en el registro oficial del regulador.',
        'En real hay emociones, spreads variables, deslizamiento y costes que la demo no refleja.',
        'Empieza pequeño y usa solo dinero que puedas permitirte perder.',
      ],
      quiz: [
        {
          q: '¿Qué significa que un bróker esté regulado?',
          options: [
            'Que garantiza beneficios a sus clientes',
            'Que está autorizado y supervisado por una autoridad financiera y debe cumplir sus normas',
            'Que tiene muchos seguidores en redes sociales',
            'Que no cobra comisiones',
          ],
          answer: 1,
          explain:
            'La regulación implica autorización y supervisión con unas obligaciones concretas. No garantiza beneficios, pero sí unas protecciones básicas.',
        },
        {
          q: 'Tu stop está en 3310.00, pero por un dato de alto impacto sales en 3307.50 con 0.10 lotes. ¿Cuánto pierdes de más por el deslizamiento?',
          options: ['$2.50', '$250', '$25', '$0.25'],
          answer: 2,
          explain: 'Son $2.50 de diferencia de precio: 0.10 × 100 × $2.50 = $25.',
        },
        {
          q: 'Con una cuenta de $1,000 y un riesgo del 1%, ¿qué tamaño corresponde a un stop de $5?',
          options: ['0.02 lotes', '0.20 lotes', '0.01 lotes', '0.10 lotes'],
          answer: 0,
          explain: 'El riesgo es de $10: $10 ÷ ($5 × 100) = 0.02 lotes.',
        },
        {
          q: '¿Cuál de estas es una señal de alarma al elegir bróker?',
          options: [
            'Muestra su número de licencia',
            'Publica advertencias de riesgo',
            'Separa el dinero de los clientes del de la empresa',
            'Te promete rentabilidad garantizada y un bono si depositas más',
          ],
          answer: 3,
          explain:
            'Nadie puede garantizar rentabilidad en los mercados. Los bonos por depósito y las promesas de ganancias son señales clásicas de alarma.',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    {
      id: 'n6-examen-final',
      title: 'Examen final',
      summary:
        'Repasarás las ideas esenciales de toda la academia y pondrás a prueba lo aprendido con un examen de ocho preguntas.',
      minutes: 12,
      sections: [
        {
          heading: 'Lo que has recorrido',
          blocks: [
            {
              type: 'p',
              text: "Has llegado al final de la academia. Antes del examen, repasa las ideas esenciales de cada bloque. Si alguna te suena lejana, vuelve a la lección correspondiente: no hay prisa.",
            },
            {
              type: 'table',
              headers: ['Bloque', 'Lo esencial'],
              rows: [
                ['Fundamentos', 'XAU/USD es el precio de una onza troy de oro en dólares. Un lote estándar son 100 onzas: cada $1 de movimiento vale lotes × 100.'],
                ['Gestión del riesgo', 'Arriesga un porcentaje pequeño y fijo, siempre con stop loss. Lotes = riesgo en $ ÷ (distancia al stop en $ × 100).'],
                ['Análisis técnico', 'Estructura de máximos y mínimos, soportes y resistencias, velas de confirmación y lectura de los marcos temporales de mayor a menor.'],
                ['Fundamentales', 'Tipos de interés reales, dólar, inflación y riesgo geopolítico influyen en el oro; el calendario económico te dice cuándo tener cuidado.'],
                ['Estrategia y plan', 'Setups con contexto, gatillo, invalidación y objetivo; un plan escrito y backtesting de 30–50 operaciones por setup.'],
                ['Mentalidad y rendimiento', 'Reglas contra los sesgos, rutina, diario y estadísticas: esperanza, drawdown y rachas.'],
              ],
            },
          ],
        },
        {
          heading: 'Las fórmulas que debes saber de memoria',
          blocks: [
            {
              type: 'formula',
              label: 'Tamaño de posición',
              expr: 'Lotes = riesgo en $ ÷ (distancia al stop en $ × 100)',
              note: 'Ejemplo: $10,000 al 1% = $100; stop a $5 → $100 ÷ ($5 × 100) = 0.20 lotes. Si sale con más decimales, redondea hacia abajo.',
            },
            {
              type: 'formula',
              label: 'Esperanza',
              expr: 'Esperanza = (% acierto × ganancia media) − (% fallo × pérdida media)',
              note: 'Si es positiva, tu forma de operar tiene ventaja; si es negativa, operar más solo acelera las pérdidas.',
            },
            {
              type: 'formula',
              label: 'Acierto mínimo',
              expr: 'Acierto mínimo = 1 ÷ (1 + R:R)',
              note: 'Con R:R 1:2, el 33.3%.',
            },
          ],
        },
        {
          heading: 'Y después del examen',
          blocks: [
            {
              type: 'p',
              text: "Terminar la academia no te convierte en un trader rentable: te da las herramientas para averiguar, con datos y sin arriesgar dinero, si puedes llegar a serlo. El trabajo de verdad empieza ahora: operar tus setups en el simulador, registrar cada operación, revisar cada semana y mejorar una sola cosa cada vez.",
            },
            {
              type: 'callout',
              tone: 'key',
              text: "Si tras una muestra amplia tus estadísticas no muestran ventaja, eso también es un resultado valioso: te ha ahorrado perder dinero real. Ajusta, vuelve a probar o sigue en la demo el tiempo que haga falta.",
            },
          ],
        },
      ],
      keyPoints: [
        '1 lote = 100 onzas: cada $1 de movimiento vale lotes × 100.',
        'Lotes = riesgo en $ ÷ (distancia al stop en $ × 100), redondeando hacia abajo.',
        'Opera solo setups definidos, con un plan escrito y límites.',
        'Mide tu ventaja con la esperanza, sobre una muestra amplia.',
        'La disciplina se construye con reglas, rutina y diario, no con fuerza de voluntad.',
      ],
      quiz: [
        {
          q: 'Con 0.10 lotes de XAU/USD, ¿cuánto ganas o pierdes por cada $1 de movimiento del precio?',
          options: ['$1', '$100', '$0.10', '$10'],
          answer: 3,
          explain: '1 lote son 100 onzas, así que 0.10 lotes son 10 onzas: cada $1 de movimiento vale 0.10 × 100 = $10.',
        },
        {
          q: 'Cuenta de $10,000, riesgo del 1% y stop a $5 de la entrada. ¿Qué tamaño de posición corresponde?',
          options: ['0.20 lotes', '2.00 lotes', '0.50 lotes', '0.05 lotes'],
          answer: 0,
          explain: 'Riesgo de $100: $100 ÷ ($5 × 100) = 0.20 lotes.',
        },
        {
          q: '¿Qué describe una tendencia alcista según la estructura del precio?',
          options: [
            'Máximos y mínimos decrecientes',
            'Máximos y mínimos crecientes',
            'Precio rebotando entre un techo y un suelo',
            'Velas cada vez más pequeñas',
          ],
          answer: 1,
          explain:
            'Una tendencia alcista encadena máximos y mínimos cada vez más altos. Los decrecientes describen una bajista y el techo y el suelo, un rango.',
        },
        {
          q: 'Si los tipos de interés reales en EE. UU. suben con fuerza, ¿qué efecto suele tener sobre el oro?',
          options: [
            'Suele impulsarlo al alza, porque el oro paga más intereses',
            'Ninguno: no tienen relación',
            'Suele presionarlo a la baja, porque aumenta el coste de oportunidad de tener un activo que no paga intereses',
            'Lo hace subir siempre exactamente en la misma proporción',
          ],
          answer: 2,
          explain:
            'El oro no paga intereses. Cuando los tipos reales suben, otras inversiones resultan más atractivas y el oro suele sufrir, aunque no es una regla automática.',
        },
        {
          q: 'En el setup de ruptura y retesteo, ¿por qué no entras con la vela de ruptura?',
          options: [
            'Porque la entrada queda lejos de la invalidación: stop más largo, menos lotes y peor R:R',
            'Porque el retesteo garantiza la operación',
            'Porque las rupturas nunca continúan',
            'Porque los brókeres no lo permiten',
          ],
          answer: 0,
          explain:
            'Entrar en el retesteo, cerca del nivel roto, permite un stop corto y un R:R mucho mejor. Además, filtra muchas rupturas falsas.',
        },
        {
          q: 'Tu backtest tiene un 40% de acierto, con ganadoras de +2R y perdedoras de −1R. ¿Cuál es la esperanza?',
          options: ['−0.20R', '+0.40R', '0R', '+0.20R'],
          answer: 3,
          explain: '(0.40 × 2R) − (0.60 × 1R) = 0.80R − 0.60R = +0.20R por operación.',
        },
        {
          q: 'Has perdido dos operaciones seguidas y sientes ganas de abrir otra más grande para recuperar. ¿Qué dice un buen plan?',
          options: [
            'Abrir otra con el doble de lotes',
            'Parar: pausa obligatoria o fin de la sesión, y nunca subir el tamaño tras una pérdida',
            'Alejar el stop de la siguiente operación',
            'Buscar un indicador que confirme la entrada',
          ],
          answer: 1,
          explain:
            'Es el impulso de operar por venganza. La regla escrita (pausa o fin de la sesión) actúa antes de que lo haga la emoción.',
        },
        {
          q: 'En una evaluación de fondeo sobre $10,000 con una pérdida diaria máxima del 5%, ¿qué riesgo por operación es más prudente?',
          options: [
            'Un 4%, para acabar antes',
            'Un 5%, igual que el límite',
            'Entre el 0.5% y el 1%, para que una racha normal no te acerque al límite',
            'Un 10%, porque el límite total lo permite',
          ],
          answer: 2,
          explain:
            'Con un 0.5–1% por operación, harían falta entre cinco y diez pérdidas el mismo día para llegar a $500. Con un 4%, bastarían dos.',
        },
      ],
    },
  ],
};
