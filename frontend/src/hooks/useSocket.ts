'use client';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { usePricesStore } from '@/store/prices.store';
import { useChartStore } from '@/store/chart.store';
import type { PriceTick } from '@/types';

let socket: Socket | null = null;

export function useSocket() {
  const { addCandle, setH1Candles, setConnected } = usePricesStore();
  const replayMode = useChartStore((s) => s.replayMode);
  const replayRef  = useRef(replayMode);

  useEffect(() => { replayRef.current = replayMode; }, [replayMode]);

  useEffect(() => {
    if (socket?.connected) return;

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

    socket = io(`${WS_URL}/prices`, {
      transports: ['websocket', 'polling'],
      upgrade: true,
    });

    socket.on('connect', () => {
      setConnected(true);
      socket!.emit('getCandles', { count: 300 });
    });

    socket.on('disconnect', () => setConnected(false));

    // Backend emits OhlcCandle {time, open, high, low, close, volume?} — normalize to PriceTick
    socket.on('candles', (data: Array<{ time: number; open: number; high: number; low: number; close: number; volume?: number }>) => {
      const ticks: PriceTick[] = data.map((c) => ({
        timestamp: c.time,
        price: c.close,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        volume: c.volume,
      }));
      if (!replayRef.current) setH1Candles(ticks);
    });

    // Live ticks only when NOT in replay mode
    socket.on('tick', (tick: PriceTick) => {
      if (!replayRef.current) addCandle(tick);
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [addCandle, setH1Candles, setConnected]);
}
