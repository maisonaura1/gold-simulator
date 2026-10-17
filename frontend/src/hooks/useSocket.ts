'use client';
import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { usePricesStore } from '@/store/prices.store';
import { useChartStore } from '@/store/chart.store';
import type { PriceTick } from '@/types';
import { API_URL } from '@/lib/config';

let socket: Socket | null = null;
let users = 0;

/** Conecta al stream de precios del backend (namespace /prices). */
export function useSocket() {
  const replayMode = useChartStore((s) => s.replayMode);
  const replayRef = useRef(replayMode);
  useEffect(() => {
    replayRef.current = replayMode;
  }, [replayMode]);

  useEffect(() => {
    users++;
    const store = usePricesStore.getState;
    if (!socket) {
      const WS_URL = (process.env.NEXT_PUBLIC_WS_URL || API_URL).replace(/\/api\/?$/, '');
      socket = io(`${WS_URL}/prices`, { transports: ['websocket', 'polling'] });
      socket.on('connect', () => {
        store().setConnected(true);
        socket?.emit('getCandles', { count: 3000 });
      });
      socket.on('disconnect', () => store().setConnected(false));
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
        store().setH1Candles(ticks);
      });
      socket.on('tick', (tick: PriceTick) => {
        if (!replayRef.current) store().applyTick(tick);
      });
    }
    return () => {
      users--;
      if (users <= 0 && socket) {
        socket.disconnect();
        socket = null;
        users = 0;
        store().setConnected(false);
      }
    };
  }, []);
}
