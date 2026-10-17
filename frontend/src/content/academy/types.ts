// Tipos del contenido de la Academia GoldTrader.
// Todo el texto es español. Dentro de cualquier `text` se puede usar **negrita**.

/** Ilustraciones disponibles (componentes SVG en src/components/academy/Figure.tsx). */
export type FigureName =
  | 'candle-anatomy'      // anatomía de una vela alcista y una bajista
  | 'trend-structure'     // tendencia alcista: máximos y mínimos crecientes
  | 'support-resistance'  // precio rebotando entre soporte y resistencia
  | 'risk-reward'         // entrada, stop loss y take profit con R:R 1:2
  | 'fibonacci'           // retroceso de Fibonacci sobre un impulso
  | 'sessions'            // línea de 24 h con Asia, Londres y Nueva York
  | 'drawdown-recovery'   // cuánto hay que ganar para recuperar una pérdida
  | 'pullback-setup'      // retroceso a zona en tendencia y continuación
  | 'breakout-retest'     // ruptura de resistencia y retesteo como soporte
  | 'range';              // mercado lateral entre dos extremos

export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'callout'; tone: 'tip' | 'warning' | 'key'; title?: string; text: string }
  /** Ejemplo resuelto: filas etiqueta → valor, y una conclusión opcional. */
  | { type: 'example'; title: string; rows: [string, string][]; note?: string }
  | { type: 'formula'; label: string; expr: string; note?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'figure'; name: FigureName; caption: string };

export interface Section {
  heading: string;
  blocks: Block[];
}

export interface QuizQuestion {
  q: string;
  options: string[];
  /** Índice (0-based) de la opción correcta. */
  answer: number;
  /** Por qué es correcta. Se muestra después de responder. */
  explain: string;
}

/** Ejercicio práctico que se hace en el simulador. */
export interface Practice {
  goal: string;
  steps: string[];
  /** Reglas que el simulador comprueba automáticamente en la operación. */
  rules: {
    maxRiskPct?: number;     // riesgo máximo en % del balance (p. ej. 1)
    minRR?: number;          // relación beneficio/riesgo mínima (p. ej. 2)
    requireNotes?: boolean;  // exige escribir el motivo de la operación
    side?: 'BUY' | 'SELL';   // obliga a comprar o a vender
  };
  /** Operaciones válidas necesarias para dar la práctica por hecha (por defecto 1). */
  count?: number;
}

export interface Lesson {
  /** Único en toda la academia, formato `n{nivel}-{slug}`, p. ej. `n1-que-es-el-oro`. */
  id: string;
  title: string;
  /** Una frase: qué aprenderás. */
  summary: string;
  minutes: number;
  sections: Section[];
  /** 3–5 ideas clave para repasar. */
  keyPoints: string[];
  /** 3–4 preguntas. */
  quiz: QuizQuestion[];
  practice?: Practice;
}

export interface Level {
  id: string;          // 'n1' … 'n6'
  number: number;      // 1 … 6
  title: string;
  subtitle: string;
  description: string;
  lessons: Lesson[];
}
