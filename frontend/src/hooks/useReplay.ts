'use client';
import { useEffect } from 'react';
import { useChartStore } from '@/store/chart.store';
import { usePricesStore } from '@/store/prices.store';

const H1 = 3_600_000;
const WINDOW = 1500; // velas visibles hacia atrás desde el cursor

/**
 * Modo replay: muestra el histórico H1 solo hasta `replayCursor` y lo avanza vela a
 * vela (automático o paso a paso). Al salir se restaura el gráfico completo.
 */
export function useReplay() {
  const replayMode = useChartStore((s) => s.replayMode);
  const cursor = useChartStore((s) => s.replayCursor);
  const playing = useChartStore((s) => s.replayPlaying);
  const speed = useChartStore((s) => s.replaySpeed);

  // Pintar hasta el cursor
  useEffect(() => {
    if (!replayMode) return;
    const all = usePricesStore.getState().h1Candles;
    if (all.length === 0) return;
    const end = Math.max(1, Math.min(cursor, all.length));
    const slice = all.slice(Math.max(0, end - WINDOW), end);
    usePricesStore.getState().setCandles(slice, H1);
    const last = slice.at(-1);
    if (last) usePricesStore.setState({ currentPrice: last.close });
  }, [replayMode, cursor]);

  // Reproducción automática
  useEffect(() => {
    if (!replayMode || !playing) return;
    const id = setInterval(() => {
      const { replayCursor, setReplayCursor, setReplayPlaying } = useChartStore.getState();
      const total = usePricesStore.getState().h1Candles.length;
      if (replayCursor >= total) {
        setReplayPlaying(false);
        return;
      }
      setReplayCursor(replayCursor + 1);
    }, speed);
    return () => clearInterval(id);
  }, [replayMode, playing, speed]);

  // Al salir del replay, volver al histórico completo
  useEffect(() => {
    if (replayMode) return;
    const { h1Candles } = usePricesStore.getState();
    const tf = useChartStore.getState().timeframe;
    if (h1Candles.length > 0 && !tf.startsWith('M')) {
      usePricesStore.getState().setCandles(h1Candles, H1);
      usePricesStore.setState({ currentPrice: h1Candles.at(-1)!.close });
    }
  }, [replayMode]);
}
