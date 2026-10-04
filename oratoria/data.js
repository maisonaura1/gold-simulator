// Contenido del curso "Voz de Élite: 30 días de oratoria". Todo en español.
window.SKILLS = [
  { id: "voz", name: "Voz" },
  { id: "claridad", name: "Claridad" },
  { id: "estructura", name: "Estructura" },
  { id: "confianza", name: "Confianza" },
  { id: "presencia", name: "Presencia" },
  { id: "persuasion", name: "Persuasión" },
];

window.MODULES = [
  { id: 1, name: "Cimientos: voz y cuerpo", color: "#f5b83d" },
  { id: 2, name: "Dominar los nervios", color: "#4fd1a5" },
  { id: 3, name: "Estructura y claridad", color: "#6aa9ff" },
  { id: 4, name: "Historias y persuasión", color: "#c58bff" },
  { id: 5, name: "Presencia y escenario", color: "#ff7f8a" },
  { id: 6, name: "Maestría e improvisación", color: "#ffd166" },
];

window.WARMUPS = [
  "Tres tigres tragaban trigo en un trigal. ¿Qué tigre trago más trigo?",
  "Pablito clavó un clavito. ¿Qué clavito clavó Pablito?",
  "El cielo está enladrillado. ¿Quién lo desenladrillará? El desenladrillador que lo desenladrille buen desenladrillador será.",
  "Compré pocas copas, pocas copas compré; como compré pocas copas, pocas copas pagué.",
  "Erre con erre cigarro, erre con erre barril; rápido ruedan los carros cargados de azúcar al ferrocarril.",
  "Parra tenía una perra, Guerra tenía una parra. La perra de Parra subió a la parra de Guerra.",
  "Si Pancha plancha con cuatro planchas, ¿con cuántas planchas plancha Pancha?",
  "María Chucena techaba su choza y un techador que pasaba le dijo: María Chucena, ¿techas tu choza o techas la ajena?",
];

window.TOPICS = [
  "Convence a tu audiencia de que madrugar cambia la vida.",
  "Explica tu trabajo a un niño de diez años.",
  "Defiende que el mejor invento de la historia es la silla.",
  "Cuenta el mayor error que te enseñó algo valioso.",
  "Vende un bolígrafo cualquiera como si fuera el último del mundo.",
  "Argumenta por qué todos deberían aprender a hablar en público.",
  "Describe tu ciudad como si fueras guía turístico de lujo.",
  "Da un discurso de agradecimiento a alguien que te ayudó.",
  "Presenta una idea de negocio absurda con total seriedad.",
  "Explica por qué la paciencia es una ventaja competitiva.",
  "Motiva a un equipo que acaba de perder una final.",
  "Cuenta una historia en la que superaste un miedo.",
  "Debate: ¿es mejor el trabajo remoto o el presencial?",
  "Presenta a un amigo imaginario como invitado de honor.",
  "Explica cómo prepararías el desayuno perfecto, con pasión.",
  "Convence a tu jefe de que te dé un día libre al mes para aprender.",
  "Habla 1 minuto sobre un objeto que tengas a la vista.",
  "Defiende una opinión impopular de forma respetuosa.",
];

// d: día · m: módulo · skills: habilidades que entrena
// steps: {t: título, x: instrucción, s: segundos (cronómetro opcional), lab: abre el laboratorio de voz}
window.LESSONS = [
{ d:1, m:1, title:"Tu voz es un instrumento", min:15, skills:["voz","presencia"],
  concept:"Tu voz transmite autoridad antes que tus palabras. Se compone de cuatro mandos: volumen, ritmo, tono y pausa. La mayoría de oradores usa solo uno (volumen) y suena plano. Un orador de élite los combina con intención.",
  points:["Volumen: proyecta desde el diafragma, no gritando.","Ritmo: acelera para la emoción, frena para lo importante.","Tono: sube la melodía al preguntar, baja al afirmar con seguridad.","Pausa: el silencio es el signo de puntuación más poderoso."],
  example:"Plano: «Hoy-vamos-a-hablar-de-resultados.» · Con intención: «Hoy… vamos a hablar… de resultados.» (pausa antes de la palabra clave, bajada de tono al final).",
  steps:[
    {t:"Calentamiento", x:"Lee en voz alta el trabalenguas de hoy tres veces, cada vez más rápido pero sin perder claridad.", s:90},
    {t:"Los 4 mandos", x:"Di la frase «Esto cambia todo» cuatro veces: fuerte, suave, lenta y con pausa antes de «todo».", s:120},
    {t:"Primera grabación", x:"Graba 60 segundos presentándote. Escúchate después sin juzgar: ¿qué mando te falta?", s:60, lab:true},
  ],
  reflect:"¿Cuál de los cuatro mandos usas menos? ¿Cómo lo practicarás mañana?" },

{ d:2, m:1, title:"Respiración diafragmática", min:15, skills:["voz","confianza"],
  concept:"Respirar con el pecho produce voz débil y aguda. Respirar con el diafragma da aire estable, voz grave y calma el sistema nervioso. Es la base de todo lo demás.",
  points:["Una mano en el abdomen: debe salir al inhalar.","Inhala 4 s por la nariz, exhala 6–8 s por la boca.","Exhalar largo activa el nervio vago y baja el pulso.","Respira antes de cada frase importante, no al final del aire."],
  example:"Prueba: di «uno, dos, tres…» contando en una sola exhalación. Meta: llegar a 25 sin forzar al terminar la semana.",
  steps:[
    {t:"Respiración 4-4-6", x:"Inhala 4 s, retén 4 s, exhala 6 s. Repite durante 2 minutos. Usa el guía de respiración del panel.", s:120},
    {t:"Conteo en una exhalación", x:"Cuenta en voz alta con un solo aire. Anota hasta qué número llegas.", s:60},
    {t:"Lectura con aire", x:"Lee un párrafo de cualquier libro respirando solo en los puntos y las comas.", s:120},
  ],
  reflect:"¿Notaste menos tensión en el cuello y los hombros al exhalar largo?" },

{ d:3, m:1, title:"Dicción y articulación", min:15, skills:["claridad","voz"],
  concept:"Se te entiende cuando articulas. La mayoría de la gente habla con la mandíbula casi cerrada. Abrir la boca, marcar consonantes finales y terminar las palabras es lo que separa a quien «murmura» de quien «se escucha en la última fila».",
  points:["Abre la mandíbula: como si masticaras un chicle grande.","Marca las consonantes finales: «ciudad», «verdad», «actuar».","No te comas las sílabas: «para» no es «pa'».","Practica con lápiz horizontal entre los dientes y luego sin él."],
  example:"Con lápiz entre los dientes lee: «El presidente propuso una profunda reforma». Quita el lápiz y repite: la voz sale más nítida.",
  steps:[
    {t:"Gimnasia facial", x:"Exagera sonrisas, bostezos y «oes» durante 30 segundos para soltar músculos.", s:30},
    {t:"Lápiz entre los dientes", x:"Lee en voz alta un texto corto (1 minuto) con un lápiz horizontal entre los dientes.", s:60},
    {t:"Trabalenguas de precisión", x:"Repite el trabalenguas de hoy 5 veces. Prioriza claridad sobre velocidad.", s:120},
  ],
  reflect:"¿Qué sonidos o palabras te cuesta más articular? Anótalos para repetirlos." },

{ d:4, m:1, title:"Lenguaje corporal y postura", min:15, skills:["presencia","confianza"],
  concept:"El 55 % de la primera impresión llega por lo que se ve. Postura abierta, pies firmes y manos visibles comunican seguridad aunque por dentro tiembles. Y el cuerpo también influye en cómo te sientes.",
  points:["Pies a la anchura de los hombros, peso repartido.","Manos entre cintura y pecho, visibles; gesto con propósito.","Evita balancearte, caminar sin rumbo o cruzar brazos.","Mira a una persona por idea completa (3–5 segundos)."],
  example:"«Zona de gesto»: imagina un rectángulo desde la cintura hasta el pecho. Tus manos viven ahí y salen para enfatizar, luego regresan.",
  steps:[
    {t:"Postura de poder", x:"Colócate de pie, pecho abierto, mentón paralelo al suelo, 2 minutos. Respira lento.", s:120},
    {t:"Espejo o cámara", x:"Habla 1 minuto sobre tu día frente al espejo o con la cámara frontal. Observa manos y hombros.", s:60, lab:true},
    {t:"Una idea, una mirada", x:"Habla a 3 objetos de la habitación (tus «personas»). Cambia cada idea completa.", s:90},
  ],
  reflect:"¿Qué hábito corporal (manos, balanceo, hombros) quieres eliminar primero?" },

{ d:5, m:1, title:"Ritmo y pausas estratégicas", min:20, skills:["voz","presencia"],
  concept:"Hablar rápido suena nervioso; hablar con pausas suena seguro. La pausa da tiempo para pensar, subraya lo esencial y permite que la audiencia procese. El rango ideal es 120–160 palabras por minuto.",
  points:["Pausa antes de una cifra o idea clave: crea expectación.","Pausa después: da tiempo para que el mensaje aterrice.","Cambia de velocidad: el ritmo uniforme aburre.","Cuenta mentalmente «uno» en la pausa: se siente larga, pero para el público es perfecta."],
  example:"«Ventas del trimestre: [pausa] un… cuarenta… por ciento… [pausa] más.» Esa pausa vale más que gritar el número.",
  steps:[
    {t:"Lectura con marcas", x:"Elige un párrafo y marca con «/» donde pausarás. Léelo dos veces.", s:120},
    {t:"Mide tu ritmo", x:"Habla 90 segundos del tema sorteado en el laboratorio. Verifica tus palabras por minuto (meta 120–160).", s:90, lab:true},
    {t:"Pausa de 2 segundos", x:"Habla 1 minuto con una pausa deliberada de 2 s entre cada idea.", s:60},
  ],
  reflect:"¿Tu ritmo fue demasiado rápido o demasiado lento? ¿Cuándo tendiste a acelerar?" },

{ d:6, m:2, title:"Entiende tus nervios", min:15, skills:["confianza"],
  concept:"Los nervios no son el enemigo: son energía. Adrenalina, corazón rápido y manos sudorosas son los mismos síntomas de la emoción. Reetiquetar «estoy nervioso» como «estoy emocionado» mejora el rendimiento más que intentar calmarse.",
  points:["Nadie ve tus nervios tanto como tú (efecto foco de atención).","Reinterpreta: «Estoy emocionado» en lugar de «estoy ansioso».","Los nervios bajan después de los primeros 60 segundos.","Preparar mucho el arranque reduce la ansiedad a la mitad."],
  example:"Estudio de Harvard: quienes se decían «estoy emocionado» antes de hablar rindieron mejor y se vieron más persuasivos que quienes intentaron calmarse.",
  steps:[
    {t:"Diagnóstico", x:"Escribe tus 3 síntomas de nervios y qué pensamiento los dispara.", s:120},
    {t:"Reetiquetado", x:"Di en voz alta 5 veces: «Estoy emocionado, mi cuerpo se prepara para brillar».", s:60},
    {t:"Apertura blindada", x:"Escribe y memoriza una primera frase de 15 palabras. Dila 5 veces.", s:120},
  ],
  reflect:"¿Qué creencia sobre tus nervios cambió hoy?" },

{ d:7, m:2, title:"Rutina previa a hablar", min:15, skills:["confianza","presencia"],
  concept:"Los profesionales no improvisan su estado mental: tienen un ritual. Una rutina de 5 minutos antes de hablar entrena al cerebro a activar el modo «rendimiento».",
  points:["Respiración 4-4-6 por 1 minuto.","Calentamiento vocal: zumbido «mmm» y trabalenguas.","Postura de poder 60 segundos (en privado).","Repite tu apertura y visualiza el final con éxito."],
  example:"Rutina de 5 min: 1) respirar, 2) voz, 3) postura, 4) apertura, 5) sonreír y entrar.",
  steps:[
    {t:"Ejecuta la rutina completa", x:"Sigue los 5 pasos del ejemplo con cronómetro.", s:300},
    {t:"Personaliza", x:"Anota tu propia versión de la rutina en una tarjeta que guardes en el móvil.", s:90},
  ],
  reflect:"¿Qué paso de la rutina te dio más calma? Conviértelo en tu ritual fijo." },

{ d:8, m:2, title:"Visualización y exposición gradual", min:15, skills:["confianza"],
  concept:"El miedo se reduce por exposición, no por evitación. Cada vez que hablas y no pasa nada grave, el cerebro actualiza su alarma. La visualización con detalle sensorial prepara las mismas rutas neuronales que la práctica real.",
  points:["Visualiza el éxito en primera persona, con sonidos y emociones.","Ensaya el peor escenario: ¿qué harías si te quedas en blanco?","Escalera de exposición: espejo → cámara → amigo → grupo.","Registra cada logro para tu evidencia personal."],
  example:"Plan de «blanco»: respira, repite la última frase, mira tus notas y di «déjenme retomar este punto». Parece un detalle, dura 3 segundos.",
  steps:[
    {t:"Visualización guiada", x:"Cierra los ojos 2 minutos y repasa tu charla ideal: lugar, gente que sonríe, voz firme, aplausos.", s:120},
    {t:"Escalera de miedo", x:"Escribe 5 situaciones de hablar ordenadas de menos a más temidas.", s:120},
    {t:"Primer peldaño", x:"Graba 60 segundos hablando de cualquier tema como si hubiera 10 personas.", s:60, lab:true},
  ],
  reflect:"¿Cuál es el peldaño de tu escalera que harás esta semana?" },

{ d:9, m:2, title:"Conexión con la audiencia", min:15, skills:["presencia","persuasion"],
  concept:"Quien habla para impresionar se pone nervioso. Quien habla para servir se relaja. Cambia el foco de «¿qué pensarán de mí?» a «¿qué necesitan de mí?». Tu audiencia quiere que lo hagas bien.",
  points:["Empieza preguntándote: ¿qué necesita escuchar esta persona?","Usa «tú/ustedes» más que «yo».","Haz preguntas retóricas para involucrarlos.","Sonríe de forma auténtica al saludar: activa reciprocidad."],
  example:"En vez de «Hoy les voy a presentar mi proyecto», di «Si alguna vez perdiste una hora buscando un archivo, esto es para ti».",
  steps:[
    {t:"Reescribe una apertura", x:"Convierte «Hoy voy a hablarles de…» en una apertura centrada en el problema del público.", s:150},
    {t:"Habla al público imaginario", x:"Di tu nueva apertura mirando a 3 puntos distintos de la habitación, 5 veces.", s:120},
    {t:"Pregunta-gancho", x:"Graba 45 segundos usando una pregunta retórica cada 15 segundos.", s:45, lab:true},
  ],
  reflect:"¿Cómo cambia tu energía cuando piensas en servir, no en impresionar?" },

{ d:10, m:2, title:"Reto: tu primera charla de 2 minutos", min:25, skills:["confianza","presencia","voz"],
  concept:"Hoy integras todo lo aprendido: respiración, voz, postura y apertura. Es tu primera medición real; será la línea base para ver tu mejora al final del curso.",
  points:["Rutina previa de 5 minutos.","Apertura blindada memorizada.","Pausas en cada idea importante.","Cierre con una frase memorable."],
  example:"Estructura de 2 min: apertura (15 s) · 2 ideas (40 s cada una) · cierre (25 s).",
  steps:[
    {t:"Rutina previa", x:"Haz tu rutina de 5 minutos del día 7.", s:300},
    {t:"Charla de 2 minutos", x:"Habla sobre el tema sorteado, con postura y pausas. Grábala completa.", s:120, lab:true},
    {t:"Autoevaluación", x:"Escucha la grabación y puntúate con honestidad en los controles de abajo.", s:180},
  ],
  reflect:"¿Qué fue lo mejor de tu charla? ¿Qué mejorarías en la próxima?" },

{ d:11, m:3, title:"La regla de tres y la idea central", min:15, skills:["estructura","claridad"],
  concept:"Una charla sin idea central es ruido. Antes de hablar, completa: «Quiero que mi audiencia [sepa/sienta/haga] ___». Y organiza todo en tres puntos: es lo máximo que la mente retiene sin esfuerzo.",
  points:["Una sola idea central por charla.","Tres puntos de apoyo (no cuatro, no cinco).","Cada punto con un dato, ejemplo o historia.","Si no ayuda a la idea central, se corta."],
  example:"Idea: «Dormir bien mejora tu rendimiento». Tres puntos: memoria, ánimo, salud. Un dato por punto.",
  steps:[
    {t:"Frase núcleo", x:"Escribe tu idea central en una frase de máximo 12 palabras sobre un tema que domines.", s:120},
    {t:"Tres puntos", x:"Anota tres puntos y un dato o ejemplo para cada uno.", s:180},
    {t:"Versión oral", x:"Explícalo en 90 segundos sin papel.", s:90, lab:true},
  ],
  reflect:"¿Pudiste decir tu idea central en una frase? ¿Qué sobraba?" },

{ d:12, m:3, title:"Aperturas que enganchan", min:15, skills:["estructura","persuasion"],
  concept:"Tienes 30 segundos para ganarte la atención. Las mejores aperturas son: una pregunta provocadora, un dato sorprendente, una historia breve, una frase audaz o una escena. Nunca empieces con «Buenos días, gracias por venir».",
  points:["Pregunta: «¿Cuándo fue la última vez que…?»","Dato: «El 70 % de… nunca…»","Historia: «Hace tres años, a las 6 a. m.…»","Audacia: «Todo lo que sabes sobre X está mal»."],
  example:"«En 2008 perdí todos mis ahorros en una tarde. Hoy les cuento por qué fue lo mejor que me pasó.»",
  steps:[
    {t:"Cinco aperturas", x:"Escribe cinco aperturas distintas (una de cada tipo) para el mismo tema.", s:240},
    {t:"Elige y entrena", x:"Elige la mejor y dila 5 veces con distintas entonaciones.", s:120},
    {t:"Grábala", x:"Graba los primeros 30 segundos de una charla con tu apertura ganadora.", s:30, lab:true},
  ],
  reflect:"¿Qué tipo de apertura te resulta más natural?" },

{ d:13, m:3, title:"Cierres memorables", min:15, skills:["estructura","persuasion"],
  concept:"La audiencia recuerda el final y el pico emocional (regla del pico-final). Un cierre fuerte resume, llama a la acción y deja una frase que se pueda citar. Evita terminar con «bueno… eso sería todo».",
  points:["Resume en una frase la idea central.","Llama a una acción concreta y pequeña.","Vuelve a la apertura: cierra el círculo.","Termina con silencio: sostén la mirada 2 segundos."],
  example:"«Dormir bien no es un lujo, es tu ventaja. Esta noche, apaga la pantalla 30 minutos antes. Tu mañana te lo agradecerá.»",
  steps:[
    {t:"Tres cierres", x:"Redacta un cierre de resumen, uno de llamada a la acción y uno circular.", s:240},
    {t:"Ensayo con silencio", x:"Di tu mejor cierre y quédate 2 segundos en silencio, mirando al frente.", s:90},
    {t:"Charla completa corta", x:"Haz una charla de 90 s con apertura + 1 idea + cierre.", s:90, lab:true},
  ],
  reflect:"¿Tu cierre dejó claro qué debería hacer o pensar la audiencia?" },

{ d:14, m:3, title:"Lenguaje simple y preciso", min:15, skills:["claridad"],
  concept:"Pensar claro es hablar simple. Frases cortas, verbos activos y ejemplos concretos superan a la jerga. Si no puedes explicarlo a un niño de 12 años, aún no lo dominas.",
  points:["Frases de 15–20 palabras máximo.","Verbo activo: «El equipo logró» > «Fue logrado por el equipo».","Sustituye abstracciones por imágenes: «mejoró la eficiencia» → «ahorramos 3 horas al día».","Elimina muletillas: sustitúyelas por una pausa."],
  example:"Complejo: «Se procederá a la optimización de los procesos». Simple: «Vamos a trabajar más rápido y con menos pasos».",
  steps:[
    {t:"Traductor", x:"Toma un párrafo técnico de tu área y reescríbelo para un niño de 12 años.", s:240},
    {t:"Sin muletillas", x:"Habla 60 segundos sustituyendo cada «eh/este/o sea» por silencio.", s:60, lab:true},
    {t:"Frases cortas", x:"Cuenta una idea compleja usando frases de máximo 12 palabras.", s:90},
  ],
  reflect:"¿Qué muletilla es tu favorita? ¿Cuándo aparece?" },

{ d:15, m:3, title:"Reto: charla estructurada de 3 minutos", min:30, skills:["estructura","claridad","persuasion"],
  concept:"Integra apertura potente, tres puntos claros, lenguaje simple y cierre memorable en 3 minutos. Es el estándar de las charlas efectivas de reuniones, ventas y entrevistas.",
  points:["Apertura de 20 s.","3 puntos de 40 s con dato o ejemplo.","Transiciones: «Primero… segundo… por último…».","Cierre de 20 s con llamada a la acción."],
  example:"Plantilla: Gancho → Idea central → P1 → P2 → P3 → Resumen → Acción.",
  steps:[
    {t:"Prepara el esquema", x:"Escribe solo palabras clave (máximo 10) en una tarjeta.", s:240},
    {t:"Charla de 3 minutos", x:"Grábala completa sin leer. Usa el tema sorteado o uno propio.", s:180, lab:true},
    {t:"Revisión", x:"Escucha y puntúa estructura, claridad y ritmo con honestidad.", s:240},
  ],
  reflect:"¿Se entendió tu idea central? ¿Qué punto fue el más débil?" },

{ d:16, m:4, title:"El poder del storytelling", min:15, skills:["persuasion","presencia"],
  concept:"Las historias activan emoción, imágenes y memoria; los datos solo activan la lógica. Una buena historia tiene personaje, conflicto y resolución. Es la herramienta más poderosa de persuasión.",
  points:["Personaje con el que se identifiquen.","Conflicto: algo está en juego.","Giro o aprendizaje: qué cambió.","Detalle sensorial: color, sonido, emoción."],
  example:"«Marta llevaba 3 noches sin dormir (personaje). Su startup se quedaba sin dinero (conflicto). Hasta que llamó a su primer cliente… (giro).»",
  steps:[
    {t:"Mina de historias", x:"Anota 5 momentos de tu vida con emoción: fracaso, miedo, logro, sorpresa, aprendizaje.", s:180},
    {t:"Escribe una", x:"Elige una y estructúrala: personaje · conflicto · giro · lección.", s:180},
    {t:"Cuéntala", x:"Cuéntala en 90 segundos con detalle sensorial.", s:90, lab:true},
  ],
  reflect:"¿Qué historia tuya podría inspirar a otros?" },

{ d:17, m:4, title:"Estructura narrativa en 4 pasos", min:15, skills:["persuasion","estructura"],
  concept:"Una fórmula simple para cualquier historia de negocio o vida: Situación → Problema → Solución → Resultado. Es la columna vertebral de casos de éxito, entrevistas y presentaciones de venta.",
  points:["Situación: contexto en una frase.","Problema: la tensión.","Solución: qué hiciste tú o el protagonista.","Resultado: dato o emoción final."],
  example:"«Un cliente tenía 300 correos al día (situación). Perdía horas clasificando (problema). Implementamos reglas automáticas (solución). Recuperó 10 horas por semana (resultado).»",
  steps:[
    {t:"Caso real", x:"Escribe un caso de tu trabajo o vida con los 4 pasos.", s:180},
    {t:"Versión de 60 s", x:"Cuéntalo en exactamente 1 minuto.", s:60, lab:true},
    {t:"Versión de 20 s", x:"Reduce a 20 segundos, solo lo esencial (elevator pitch).", s:20, lab:true},
  ],
  reflect:"¿Qué parte de la historia sobró en la versión larga?" },

{ d:18, m:4, title:"Persuasión ética: ethos, pathos, logos", min:15, skills:["persuasion"],
  concept:"Aristóteles resumió la persuasión en tres pilares: ethos (credibilidad), pathos (emoción) y logos (lógica). Un buen discurso equilibra los tres. Sin credibilidad no te creen; sin emoción no actúan; sin lógica no confían.",
  points:["Ethos: ¿por qué debo escucharte? Experiencia, honestidad.","Pathos: historia, imagen, valores compartidos.","Logos: datos, comparaciones, causa-efecto.","Orden potente: emoción → razón → acción."],
  example:"«Soy enfermera hace 12 años (ethos). Vi a un paciente salvarse porque alguien lavó sus manos (pathos). Lavarse las manos reduce infecciones un 40 % (logos).»",
  steps:[
    {t:"Diagnóstico", x:"Toma una charla anterior y marca qué pilar domina y cuál falta.", s:150},
    {t:"Mensaje de 3 pilares", x:"Escribe un mensaje persuasivo de 5 frases con ethos, pathos y logos.", s:210},
    {t:"Entrégalo", x:"Dilo en 60 segundos con convicción.", s:60, lab:true},
  ],
  reflect:"¿Qué pilar tiendes a olvidar?" },

{ d:19, m:4, title:"Datos que se recuerdan", min:15, skills:["claridad","persuasion"],
  concept:"Una cifra sola se olvida. Una cifra comparada se recuerda. Redondea, usa analogías y haz tangible lo abstracto.",
  points:["Redondea: «casi 2 de cada 3» > «64,3 %».","Compara: «equivale a 40 campos de fútbol».","Una cifra clave por idea.","Pausa antes y después del dato."],
  example:"«Cada día perdemos 2 millones de horas en reuniones inútiles: más de 228 años… cada día.»",
  steps:[
    {t:"Humaniza tres datos", x:"Elige tres cifras de tu tema y conviértelas en comparaciones tangibles.", s:240},
    {t:"Entrega con pausa", x:"Di cada dato con pausa previa y posterior.", s:90},
    {t:"Mini charla de datos", x:"Habla 90 s con exactamente 2 datos comparados.", s:90, lab:true},
  ],
  reflect:"¿Qué analogía fue la más potente? ¿Por qué?" },

{ d:20, m:4, title:"Reto: charla persuasiva de 4 minutos", min:35, skills:["persuasion","estructura","presencia"],
  concept:"Combina historia, datos, estructura y llamada a la acción para convencer. Piensa en una decisión que quieres que alguien tome y construye el camino hacia ella.",
  points:["Apertura con historia.","Problema con dato comparado.","Solución clara.","Llamada a la acción concreta."],
  example:"Gancho humano → problema con dato → solución en 3 pasos → cierre circular + acción.",
  steps:[
    {t:"Diseña", x:"Esboza el recorrido: historia, dato, solución, acción.", s:300},
    {t:"Ensaya en voz alta", x:"Una pasada rápida sin grabar para ajustar tiempos.", s:240},
    {t:"Grabación final", x:"Graba tu charla persuasiva completa.", s:240, lab:true},
  ],
  reflect:"¿Cuál fue el momento más persuasivo? ¿Qué cambiarías?" },

{ d:21, m:5, title:"Gestos con propósito", min:15, skills:["presencia"],
  concept:"Los gestos refuerzan ideas cuando son sincronizados con las palabras. Abiertos para inclusión, contados con dedos para listas, firmes para decisión. Los gestos nerviosos distraen.",
  points:["Palmas hacia arriba: apertura, sinceridad.","Contar con los dedos: refuerza la estructura de tres.","Manos fuera de los bolsillos y sin jugar con objetos.","Gesto + palabra clave al mismo tiempo."],
  example:"«Primero…» (un dedo) «segundo…» (dos dedos) «tercero…» (tres). El público lo sigue sin esfuerzo.",
  steps:[
    {t:"Cámara de gestos", x:"Graba 60 s y cuenta los gestos nerviosos: toqueteos, balanceos, manos en cara.", s:60, lab:true},
    {t:"Gestos intencionados", x:"Vuelve a grabar con un gesto planificado por idea.", s:60, lab:true},
    {t:"Comparación", x:"Compara ambos videos y anota diferencias.", s:120},
  ],
  reflect:"¿Qué gesto tuyo refuerza tus ideas? ¿Cuál las debilita?" },

{ d:22, m:5, title:"Tono, emoción y variedad vocal", min:15, skills:["voz","presencia"],
  concept:"Una voz monótona duerme a la sala. La variedad vocal (tono, velocidad, volumen, énfasis) sostiene la atención. La emoción real —no actuada— es lo que conecta.",
  points:["Resalta palabras clave con énfasis y pausa.","Baja el volumen para generar intimidad.","Sube energía en el clímax.","Recuerda el sentimiento detrás de cada frase."],
  example:"«Y entonces… todo… se detuvo.» (bajo, lento, pausa) frente a «¡Lo logramos!» (alto, ágil, brillante).",
  steps:[
    {t:"Emociones", x:"Di «No puedo creerlo» con alegría, miedo, enfado y ternura.", s:120},
    {t:"Lectura dramática", x:"Lee un texto del mismo párrafo en monótono y luego con variedad total.", s:150},
    {t:"Historia viva", x:"Cuenta una historia de 90 s con al menos 3 cambios de volumen y ritmo.", s:90, lab:true},
  ],
  reflect:"¿Qué cambios de voz sonaron más naturales en ti?" },

{ d:23, m:5, title:"Uso del espacio y el escenario", min:15, skills:["presencia","confianza"],
  concept:"Moverse con intención comunica liderazgo. Camina entre ideas, quédate quieto en los momentos clave y evita pasearte sin rumbo. El espacio estructura la historia: pasado a la izquierda, presente al centro, futuro a la derecha (desde tu perspectiva).",
  points:["Muévete en las transiciones, detente en el mensaje.","Da pasos hacia el público para conectar.","No des la espalda a la audiencia.","Usa «anclas» espaciales para cada punto."],
  example:"Punto 1 a la izquierda, punto 2 al centro, punto 3 a la derecha. Al resumir, vuelve al centro.",
  steps:[
    {t:"Mapa espacial", x:"Asigna una posición a cada punto de una charla de tres ideas.", s:90},
    {t:"Ensayo caminado", x:"Habla 2 minutos moviéndote solo entre ideas.", s:120, lab:true},
    {t:"Quietud poderosa", x:"Di tu frase clave sin moverte y sosteniendo la mirada.", s:30},
  ],
  reflect:"¿Cuándo te quedaste quieto y cuándo te moviste sin necesidad?" },

{ d:24, m:5, title:"Preguntas y respuestas con aplomo", min:15, skills:["confianza","claridad"],
  concept:"El turno de preguntas es donde se gana credibilidad. Escucha entera la pregunta, pausa, reformula si hace falta y responde con estructura. Si no sabes, dilo con confianza y ofrece seguimiento.",
  points:["Escucha sin interrumpir; asiente.","Repite o reformula la pregunta (da tiempo y claridad).","Responde en 3 pasos: respuesta · razón · ejemplo.","«No lo sé, lo averiguo y te respondo»: honestidad que genera confianza."],
  example:"Pregunta hostil: «¿Por qué esto no va a fracasar como lo anterior?» → «Es una pregunta justa. Aprendimos tres cosas del anterior…»",
  steps:[
    {t:"Banco de preguntas", x:"Escribe las 5 preguntas más difíciles que podrían hacerte sobre tu tema.", s:150},
    {t:"Respuesta en 3 pasos", x:"Responde cada una en 30 segundos con respuesta, razón y ejemplo.", s:150, lab:true},
    {t:"La difícil", x:"Practica decir «No lo sé, pero lo averiguaré» con aplomo.", s:30},
  ],
  reflect:"¿Qué pregunta te preocupa más? ¿Ya tienes respuesta?" },

{ d:25, m:5, title:"Reto: charla de 5 minutos con Q&A", min:40, skills:["presencia","confianza","voz"],
  concept:"Presenta con todo tu arsenal: voz, cuerpo, estructura y conexión, y supera un mini turno de preguntas. Pide a alguien (o a la cámara) que te lance dos preguntas.",
  points:["Rutina previa completa.","Charla de 4 minutos.","1 minuto de preguntas.","Cierre final con aplomo."],
  example:"Gancho · P1 · P2 · P3 · Resumen · Q&A · Cierre final con frase memorable.",
  steps:[
    {t:"Preparación", x:"Esquema + rutina previa de 5 minutos.", s:420},
    {t:"Charla + Q&A", x:"Graba la charla completa y responde en voz alta a 2 preguntas imaginadas o reales.", s:300, lab:true},
    {t:"Análisis", x:"Escucha y completa la autoevaluación con honestidad.", s:300},
  ],
  reflect:"¿Cómo cambió tu presencia comparada con el día 10?" },

{ d:26, m:6, title:"Improvisación: el método PREP", min:15, skills:["claridad","estructura","confianza"],
  concept:"Cuando te piden hablar sin preparación, usa PREP: Punto, Razón, Ejemplo, Punto. Te da una estructura inmediata y evita divagar.",
  points:["Punto: tu postura en una frase.","Razón: por qué piensas así.","Ejemplo: caso concreto.","Punto: repite tu postura y cierra."],
  example:"«Creo que deberíamos lanzar el viernes. Porque hay menos tráfico. Por ejemplo, el mes pasado el lanzamiento del miércoles colapsó el servidor. Por eso, lanzamos el viernes.»",
  steps:[
    {t:"PREP en 30 s", x:"Responde a 5 temas aleatorios con PREP en 30 s cada uno.", s:150, lab:true},
    {t:"PREP en 60 s", x:"Elige un tema y desarróllalo en 60 s.", s:60, lab:true},
    {t:"Sin muletillas", x:"Repite una respuesta eliminando todas las muletillas.", s:60, lab:true},
  ],
  reflect:"¿Qué letra del PREP te costó más: punto, razón o ejemplo?" },

{ d:27, m:6, title:"Historias de último minuto", min:15, skills:["persuasion","confianza"],
  concept:"Un orador de élite siempre tiene un banco de historias listas. Ten 5 anécdotas cortas catalogadas por tema: superación, error, equipo, cliente, aprendizaje. Así improvisas con material sólido.",
  points:["Banco de 5 historias de 60 s.","Etiqueta cada una con su lección.","Adapta la misma historia a diferentes mensajes.","Ensaya el inicio y el final; el medio es flexible."],
  example:"La historia del «viaje cancelado» sirve para resiliencia, planificación y humildad según cómo la termines.",
  steps:[
    {t:"Catálogo", x:"Escribe las 5 historias con título y lección.", s:240},
    {t:"Cuéntalas", x:"Cuenta 2 de ellas en 60 segundos cada una.", s:120, lab:true},
    {t:"Reciclaje", x:"Cuenta la misma historia con una lección diferente.", s:60, lab:true},
  ],
  reflect:"¿Qué historia tuya tiene más potencial universal?" },

{ d:28, m:6, title:"Presencia en cámara y reuniones online", min:15, skills:["presencia","voz"],
  concept:"Hoy el 70 % de las charlas son virtuales. Cámara a la altura de los ojos, luz frontal, mirada al objetivo (no a la pantalla) y energía un 20 % más alta que en presencial.",
  points:["Cámara a la altura de los ojos y a un brazo de distancia.","Mira al objetivo cuando dices lo importante.","Más energía en voz y gestos: la cámara «aplana».","Fondo ordenado y luz de frente."],
  example:"Pega una pequeña pegatina de flecha junto a la cámara: recordarás mirar ahí en los momentos clave.",
  steps:[
    {t:"Ajusta el set", x:"Cámara, luz, fondo y audio: revisa los cuatro.", s:120},
    {t:"Graba en cámara", x:"Habla 2 minutos mirando al objetivo.", s:120, lab:true},
    {t:"Revisión", x:"Revisa mirada, energía y encuadre.", s:120},
  ],
  reflect:"¿Cuál fue el ajuste que más mejoró tu imagen en cámara?" },

{ d:29, m:6, title:"Feedback y práctica deliberada", min:20, skills:["claridad","confianza"],
  concept:"Practicar mucho no basta; hay que practicar con precisión. Graba, observa, elige UN foco de mejora y repite. El feedback de un tercero acelera todo.",
  points:["Un foco de mejora por sesión.","Pide feedback específico: «¿Qué fue lo más claro? ¿Qué se perdió?»","Revisa tus grabaciones con regla 3-2-1: 3 aciertos, 2 mejoras, 1 acción.","Registra tus progresos."],
  example:"3-2-1: «Acierto: apertura, pausas, cierre. Mejoras: manos, ritmo final. Acción: practicar el cierre 5 veces.»",
  steps:[
    {t:"Revisión 3-2-1", x:"Revisa tu grabación del día 25 y aplica la regla 3-2-1.", s:300},
    {t:"Pide feedback", x:"Envía una grabación a alguien de confianza con 2 preguntas concretas.", s:180},
    {t:"Re-grabación", x:"Corrige tu foco y graba de nuevo 2 minutos.", s:120, lab:true},
  ],
  reflect:"¿Cuál es tu foco de mejora principal para los próximos 30 días?" },

{ d:30, m:6, title:"Gran final: tu charla de 5 minutos", min:45, skills:["voz","claridad","estructura","confianza","presencia","persuasion"],
  concept:"Es tu graduación. Presenta una charla de 5 minutos con todo lo aprendido y compárala con tu día 10. Tu progreso es medible.",
  points:["Rutina previa completa.","Apertura potente + 3 puntos + historia + dato + cierre memorable.","Voz variada, pausas, gestos y espacio.","Autoevaluación honesta."],
  example:"Estructura final: Gancho (30 s) · P1 (60 s) · Historia (60 s) · P2 (60 s) · P3 (60 s) · Cierre (30 s).",
  steps:[
    {t:"Prepara", x:"Esquema de 10 palabras clave y rutina previa.", s:420},
    {t:"Charla final", x:"Graba tu charla de 5 minutos completa.", s:300, lab:true},
    {t:"Compara", x:"Revisa tu día 10 frente al día 30 y anota diferencias.", s:300},
  ],
  reflect:"Escribe una carta a tu «yo» del día 1: ¿qué descubriste? ¿Qué sigue?" },
];

window.BADGES = [
  { id:"first", name:"Primer paso", desc:"Completa tu primera lección", test: s => s.completed >= 1 },
  { id:"streak3", name:"Racha de 3", desc:"3 días seguidos", test: s => s.streak >= 3 },
  { id:"streak7", name:"Semana de hierro", desc:"7 días seguidos", test: s => s.streak >= 7 },
  { id:"streak21", name:"Hábito formado", desc:"21 días seguidos", test: s => s.streak >= 21 },
  { id:"mod1", name:"Voz de cimientos", desc:"Termina el módulo 1", test: s => s.moduleDone[1] },
  { id:"mod2", name:"Mente serena", desc:"Termina el módulo 2", test: s => s.moduleDone[2] },
  { id:"mod3", name:"Arquitecto", desc:"Termina el módulo 3", test: s => s.moduleDone[3] },
  { id:"mod4", name:"Narrador", desc:"Termina el módulo 4", test: s => s.moduleDone[4] },
  { id:"mod5", name:"Presencia total", desc:"Termina el módulo 5", test: s => s.moduleDone[5] },
  { id:"mod6", name:"Maestro", desc:"Termina el curso", test: s => s.moduleDone[6] },
  { id:"lab5", name:"Laboratorista", desc:"5 grabaciones en el laboratorio", test: s => s.sessions >= 5 },
  { id:"lab20", name:"Incansable", desc:"20 grabaciones en el laboratorio", test: s => s.sessions >= 20 },
  { id:"min300", name:"5 horas de voz", desc:"300 minutos de práctica", test: s => s.minutes >= 300 },
];
