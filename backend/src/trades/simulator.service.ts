import { Injectable } from '@nestjs/common';
import { DataFetcherService } from '../prices/data-fetcher.service';

export interface SimulationResult {
  outcome: 'TP_HIT' | 'SL_HIT' | 'NEUTRAL';
  exitPrice: number;
  resultUsd: number;
  resultPct: number;
  rrRatio: number;
  riskPct: number;
  candlesTraversed: number;
  explanation: string;
}

const LOT_SIZE_XAU = 100; // 1 lot = 100 oz

@Injectable()
export class SimulatorService {
  constructor(private fetcher: DataFetcherService) {}

  getCurrentPrice(): number {
    return this.fetcher.getCurrentPrice();
  }

  /**
   * Instant simulation over historical candles.
   * Picks a random window from real XAUUSD data and replays it
   * to determine if SL or TP would have been hit first.
   */
  simulate(params: {
    type: 'BUY' | 'SELL';
    lot: number;
    entryPrice: number;
    sl: number;
    tp: number;
    accountBalance: number;
  }): SimulationResult {
    const { type, lot, entryPrice, sl, tp, accountBalance } = params;
    const candles = this.fetcher.getAllCandles();

    if (candles.length < 50) return this.fallbackResult(params);

    // Pick a random starting point with at least 200 candles ahead
    const maxStart = Math.max(0, candles.length - 200);
    const startIdx = Math.floor(Math.random() * maxStart);
    const window   = candles.slice(startIdx, startIdx + 200);

    let outcome: SimulationResult['outcome'] = 'NEUTRAL';
    let exitPrice = entryPrice;
    let candlesTraversed = 0;

    for (const candle of window) {
      candlesTraversed++;

      if (type === 'BUY') {
        if (candle.low  <= sl) { outcome = 'SL_HIT'; exitPrice = sl; break; }
        if (candle.high >= tp) { outcome = 'TP_HIT'; exitPrice = tp; break; }
      } else {
        if (candle.high >= sl) { outcome = 'SL_HIT'; exitPrice = sl; break; }
        if (candle.low  <= tp) { outcome = 'TP_HIT'; exitPrice = tp; break; }
      }
    }

    if (outcome === 'NEUTRAL') exitPrice = window.at(-1)?.close ?? entryPrice;

    const priceDiff = type === 'BUY' ? exitPrice - entryPrice : entryPrice - exitPrice;
    const resultUsd = +(priceDiff * lot * LOT_SIZE_XAU).toFixed(2);
    const resultPct = +(resultUsd / accountBalance * 100).toFixed(2);

    const slDist  = Math.abs(entryPrice - sl);
    const tpDist  = Math.abs(tp - entryPrice);
    const rrRatio = +(slDist > 0 ? tpDist / slDist : 0).toFixed(2);
    const riskUsd = slDist * lot * LOT_SIZE_XAU;
    const riskPct = +(riskUsd / accountBalance * 100).toFixed(2);

    return {
      outcome,
      exitPrice: +exitPrice.toFixed(2),
      resultUsd,
      resultPct,
      rrRatio,
      riskPct,
      candlesTraversed,
      explanation: this.buildExplanation({ outcome, resultUsd, riskPct, rrRatio, candlesTraversed }),
    };
  }

  private fallbackResult(params: {
    type: 'BUY' | 'SELL'; lot: number; entryPrice: number;
    sl: number; tp: number; accountBalance: number;
  }): SimulationResult {
    const { entryPrice, sl, tp, lot, accountBalance } = params;
    const slDist  = Math.abs(entryPrice - sl);
    const tpDist  = Math.abs(tp - entryPrice);
    const rrRatio = +(slDist > 0 ? tpDist / slDist : 0).toFixed(2);
    const riskUsd = slDist * lot * LOT_SIZE_XAU;
    const riskPct = +(riskUsd / accountBalance * 100).toFixed(2);
    return {
      outcome: 'NEUTRAL', exitPrice: entryPrice,
      resultUsd: 0, resultPct: 0, rrRatio, riskPct,
      candlesTraversed: 0,
      explanation: '⚠️ Sin datos históricos disponibles aún. Espera a que se carguen los datos de mercado.',
    };
  }

  private buildExplanation(d: {
    outcome: string; resultUsd: number; riskPct: number;
    rrRatio: number; candlesTraversed: number;
  }): string {
    const lines: string[] = [];

    lines.push(
      d.outcome === 'TP_HIT'  ? `✅ Take Profit alcanzado — ganaste $${d.resultUsd.toFixed(2)}.`
      : d.outcome === 'SL_HIT' ? `❌ Stop Loss tocado — perdiste $${Math.abs(d.resultUsd).toFixed(2)}.`
      : `⏸ Sin resultado claro en 200 velas H1.`,
    );

    lines.push(
      d.riskPct > 3 ? `⚠️ Riesgo del ${d.riskPct.toFixed(1)}% — peligroso, supera el límite del 3%.`
      : d.riskPct > 2 ? `⚠️ Riesgo del ${d.riskPct.toFixed(1)}% — supera el 2% recomendado.`
      : `✅ Riesgo del ${d.riskPct.toFixed(1)}% — dentro del rango saludable (≤2%).`,
    );

    lines.push(
      d.rrRatio >= 3 ? `✅ R/R de ${d.rrRatio.toFixed(1)} — excelente setup.`
      : d.rrRatio >= 2 ? `✅ R/R de ${d.rrRatio.toFixed(1)} — buena relación riesgo/beneficio.`
      : d.rrRatio >= 1 ? `⚠️ R/R de ${d.rrRatio.toFixed(1)} — aceptable, pero busca ≥2:1.`
      : `❌ R/R de ${d.rrRatio.toFixed(1)} — arriesgas más de lo que podrías ganar.`,
    );

    lines.push(`La operación habría durado ~${d.candlesTraversed} velas H1 (${d.candlesTraversed} horas).`);

    return lines.join(' ');
  }
}
