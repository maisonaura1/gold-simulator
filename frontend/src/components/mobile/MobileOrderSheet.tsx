'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { usePricesStore } from '@/store/prices.store';
import { useChartLines } from '@/store/chart-lines.store';
import { useTrades } from '@/hooks/useTrades';
import { useAccount } from '@/hooks/useAccount';
import { useT } from '@/hooks/useT';
import type { SimulationResult } from '@/types';

const SPREAD = 0.30;
const LOT_PRESETS = ['0.01', '0.05', '0.10', '0.50', '1.00'];

interface Props {
  open: boolean;
  onClose: () => void;
  onResult?: (r: SimulationResult) => void;
}

export function MobileOrderSheet({ open, onClose, onResult }: Props) {
  const t = useT();
  const { currentPrice } = usePricesStore();
  const { setPreview, clearPreview } = useChartLines();
  const { simulate, openTrades, closeTrade } = useTrades();
  const { account } = useAccount();

  const [lot, setLot]     = useState('0.01');
  const [sl, setSl]       = useState('');
  const [tp, setTp]       = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [tab, setTab]         = useState<'order' | 'positions'>('order');

  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragDelta  = useRef(0);

  const bid = currentPrice > 0 ? currentPrice - SPREAD / 2 : 0;
  const ask = currentPrice > 0 ? currentPrice + SPREAD / 2 : 0;

  const slNum = parseFloat(sl) || 0;
  const tpNum = parseFloat(tp) || 0;
  const lotNum = parseFloat(lot) || 0.01;
  const balance = account?.currentBalance ?? 10000;

  const slDistBuy  = slNum > 0 ? Math.max(0, ask - slNum) : 0;
  const tpDistBuy  = tpNum > 0 ? Math.max(0, tpNum - ask) : 0;
  const rr = slDistBuy > 0 && tpDistBuy > 0 ? tpDistBuy / slDistBuy : 0;
  const riskUsd = slDistBuy * lotNum * 100;
  const riskPct = balance > 0 ? (riskUsd / balance) * 100 : 0;
  const canTrade = slNum > 0 && tpNum > 0;

  // Update chart SL/TP preview lines when values change
  useEffect(() => {
    setPreview({ sl: slNum > 0 ? slNum : null, tp: tpNum > 0 ? tpNum : null });
  }, [slNum, tpNum, setPreview]);

  // Quick preset: auto-calc SL/TP from pts
  const applyPreset = (pts: number, side: 'BUY' | 'SELL') => {
    const entry = side === 'BUY' ? ask : bid;
    if (side === 'BUY') {
      setSl((entry - pts).toFixed(2));
      setTp((entry + pts * 2).toFixed(2));
    } else {
      setSl((entry + pts).toFixed(2));
      setTp((entry - pts * 2).toFixed(2));
    }
    // Auto-lot for 1% risk
    if (balance > 0) {
      const riskDollar = balance * 0.01;
      const autoLot = Math.max(0.01, Math.min(10, riskDollar / (pts * 100)));
      setLot(autoLot.toFixed(2));
    }
  };

  const exec = async (side: 'BUY' | 'SELL') => {
    if (!canTrade) return;
    setLoading(true);
    setError('');
    try {
      const entry = side === 'BUY' ? ask : bid;
      const { trade, simulation } = await simulate({
        type: side,
        lot: lotNum,
        entryPrice: entry,
        sl: slNum,
        tp: tpNum,
        notes,
      });
      onResult?.(simulation);
      clearPreview();
      setSl(''); setTp(''); setNotes('');
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Error al ejecutar');
    } finally {
      setLoading(false);
    }
  };

  // Swipe-down to close
  const onTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    dragDelta.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const dy = e.touches[0].clientY - dragStartY.current;
    dragDelta.current = dy;
    if (dy > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${dy}px)`;
    }
  };
  const onTouchEnd = () => {
    if (dragDelta.current > 80) {
      onClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(0)';
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col"
        style={{
          background: '#0b0d14',
          borderTop: '1px solid #c9a84c44',
          borderRadius: '16px 16px 0 0',
          maxHeight: '90dvh',
          paddingBottom: 'env(safe-area-inset-bottom)',
          transition: 'transform 0.2s ease',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Drag handle */}
        <div
          className="flex flex-col items-center pt-2 pb-1 shrink-0 cursor-grab active:cursor-grabbing"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div style={{ width: 36, height: 4, background: '#2e3340', borderRadius: 2 }} />
        </div>

        {/* Sheet header */}
        <div className="flex items-center px-4 pb-3 shrink-0">
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#e8ecf4', letterSpacing: '-0.01em' }}>
              Nueva Orden — XAUUSD
            </div>
            <div style={{ fontSize: 11, color: '#6b7385', marginTop: 1 }}>
              Bid {bid > 0 ? bid.toFixed(2) : '—'} · Ask {ask > 0 ? ask.toFixed(2) : '—'} · Spread {SPREAD}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-[#6b7385] hover:text-[#e8ecf4] transition-colors"
            style={{ fontSize: 20, lineHeight: 1, padding: 4 }}
          >
            ✕
          </button>
        </div>

        {/* Tabs: Order / Positions */}
        <div
          className="flex shrink-0 px-4 gap-1 mb-3"
          style={{ borderBottom: '1px solid #1d2029', paddingBottom: 0 }}
        >
          {(['order', 'positions'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="pb-2 px-1 text-xs font-mono uppercase tracking-widest transition-colors"
              style={{
                borderBottom: `2px solid ${tab === t ? '#c9a84c' : 'transparent'}`,
                color: tab === t ? '#c9a84c' : '#4a5568',
              }}
            >
              {t === 'order' ? '◆ Orden' : `Posiciones (${openTrades.length})`}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {tab === 'order' ? (
            <div className="px-4 pb-4 space-y-4">
              {/* Lot selector */}
              <div>
                <div style={{ fontSize: 11, color: '#6b7385', marginBottom: 6 }}>Lotes</div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setLot((v) => Math.max(0.01, +(parseFloat(v) - 0.01).toFixed(2)).toFixed(2))}
                    className="flex items-center justify-center border transition-colors"
                    style={{ width: 40, height: 40, background: '#12161f', border: '1px solid #2e3340', borderRadius: 6, fontSize: 20, color: '#c8cdd8' }}
                  >−</button>
                  <input
                    type="number" step="0.01" min="0.01" max="10"
                    value={lot}
                    onChange={(e) => setLot(e.target.value)}
                    className="flex-1 text-center font-mono font-bold"
                    style={{ height: 40, background: '#12161f', border: '1px solid #2e3340', borderRadius: 6, color: '#e8ecf4', fontSize: 16 }}
                  />
                  <button
                    onClick={() => setLot((v) => Math.min(10, +(parseFloat(v) + 0.01).toFixed(2)).toFixed(2))}
                    className="flex items-center justify-center"
                    style={{ width: 40, height: 40, background: '#12161f', border: '1px solid #2e3340', borderRadius: 6, fontSize: 20, color: '#c8cdd8' }}
                  >+</button>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {LOT_PRESETS.map((v) => (
                    <button
                      key={v}
                      onClick={() => setLot(v)}
                      className="flex-1 py-1.5 text-[10px] font-mono transition-colors"
                      style={{
                        border: `1px solid ${lot === v ? '#4a6cf7' : '#2e3340'}`,
                        background: lot === v ? '#4a6cf720' : 'transparent',
                        color: lot === v ? '#33c2ff' : '#6b7385',
                        borderRadius: 4,
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* SL */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize: 11, color: '#6b7385' }}>
                    Stop Loss <span style={{ color: '#e84040', fontSize: 9 }}>*obligatorio</span>
                  </span>
                  {slNum > 0 && (
                    <span style={{ fontSize: 10, color: '#e84040', fontFamily: 'monospace' }}>
                      {slDistBuy.toFixed(2)} pts · ${riskUsd.toFixed(2)}
                    </span>
                  )}
                </div>
                <input
                  type="number" step="0.01"
                  placeholder="Precio de stop loss"
                  value={sl}
                  onChange={(e) => setSl(e.target.value)}
                  className="w-full font-mono"
                  style={{
                    height: 44, padding: '0 12px',
                    background: '#12161f', border: `1px solid ${slNum > 0 ? '#e8404066' : '#2e3340'}`,
                    borderRadius: 8, color: slNum > 0 ? '#e84040' : '#6b7385', fontSize: 15,
                  }}
                />
              </div>

              {/* TP */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize: 11, color: '#6b7385' }}>Take Profit</span>
                  {tpNum > 0 && rr > 0 && (
                    <span style={{ fontSize: 10, color: '#2dcc6f', fontFamily: 'monospace' }}>
                      R:R {rr.toFixed(2)}:1
                    </span>
                  )}
                </div>
                <input
                  type="number" step="0.01"
                  placeholder="Precio de take profit"
                  value={tp}
                  onChange={(e) => setTp(e.target.value)}
                  className="w-full font-mono"
                  style={{
                    height: 44, padding: '0 12px',
                    background: '#12161f', border: `1px solid ${tpNum > 0 ? '#2dcc6f66' : '#2e3340'}`,
                    borderRadius: 8, color: tpNum > 0 ? '#2dcc6f' : '#6b7385', fontSize: 15,
                  }}
                />
              </div>

              {/* Quick presets */}
              <div>
                <div style={{ fontSize: 11, color: '#6b7385', marginBottom: 8 }}>
                  Presets rápidos — auto SL/TP + lote al 1%
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, 30, 50, 80, 100].map((pts) => (
                    <button
                      key={pts}
                      onClick={() => applyPreset(pts, 'BUY')}
                      className="py-2 text-[11px] font-mono transition-colors"
                      style={{
                        border: '1px solid #2e3340', borderRadius: 6,
                        background: '#12161f', color: '#6b7385',
                      }}
                    >
                      ±{pts}
                    </button>
                  ))}
                </div>
              </div>

              {/* Risk display */}
              {riskPct > 0 && (
                <div
                  className="flex items-center justify-between px-3 py-2.5"
                  style={{
                    background: '#12161f', border: '1px solid #2e3340', borderRadius: 8,
                  }}
                >
                  <span style={{ fontSize: 11, color: '#6b7385' }}>Riesgo</span>
                  <span
                    style={{
                      fontSize: 13, fontFamily: 'monospace', fontWeight: 700,
                      color: riskPct > 3 ? '#e84040' : riskPct > 2 ? '#f0b429' : '#2dcc6f',
                    }}
                  >
                    {riskPct.toFixed(2)}% · ${riskUsd.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Notes */}
              <div>
                <div style={{ fontSize: 11, color: '#6b7385', marginBottom: 6 }}>Notas del setup</div>
                <input
                  type="text"
                  placeholder="¿Por qué abres este trade?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%', height: 40, padding: '0 12px',
                    background: '#12161f', border: '1px solid #2e3340',
                    borderRadius: 8, color: '#c8cdd8', fontSize: 13,
                  }}
                />
              </div>

              {error && (
                <div
                  className="text-xs px-3 py-2"
                  style={{ color: '#e84040', background: '#e8404015', border: '1px solid #e8404030', borderRadius: 6 }}
                >
                  ⚠ {error}
                </div>
              )}
            </div>
          ) : (
            /* Positions tab */
            <div className="px-4 pb-4">
              {openTrades.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm" style={{ color: '#4a5568' }}>
                  Sin posiciones abiertas
                </div>
              ) : (
                <div className="space-y-2">
                  {openTrades.map((tr) => {
                    const livePnl = currentPrice > 0
                      ? (tr.type === 'BUY'
                          ? (currentPrice - tr.entryPrice)
                          : (tr.entryPrice - currentPrice)) * tr.lot * 100
                      : null;
                    return (
                      <div
                        key={tr.id}
                        className="flex items-center justify-between px-3 py-3"
                        style={{ background: '#12161f', border: '1px solid #1d2029', borderRadius: 8 }}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="font-bold text-sm"
                              style={{ color: tr.type === 'BUY' ? '#2dcc6f' : '#e84040' }}
                            >
                              {tr.type}
                            </span>
                            <span style={{ fontSize: 11, color: '#6b7385' }}>
                              {tr.lot.toFixed(2)} lot @ {tr.entryPrice.toFixed(2)}
                            </span>
                          </div>
                          <div style={{ fontSize: 10, color: '#4a5568', marginTop: 2 }}>
                            SL {tr.sl?.toFixed(2) ?? '—'} · TP {tr.tp?.toFixed(2) ?? '—'}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {livePnl !== null && (
                            <span
                              className="font-mono font-bold"
                              style={{ fontSize: 14, color: livePnl >= 0 ? '#2dcc6f' : '#e84040' }}
                            >
                              {livePnl >= 0 ? '+' : ''}{livePnl.toFixed(2)}
                            </span>
                          )}
                          <button
                            onClick={() => closeTrade(tr.id)}
                            className="px-3 py-1.5 text-xs font-bold"
                            style={{
                              background: '#7a1a1a', border: '1px solid #8f1f1f',
                              color: '#e84040', borderRadius: 6,
                            }}
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* BUY / SELL buttons — always visible */}
        {tab === 'order' && (
          <div
            className="flex gap-2 px-4 pt-3 pb-3 shrink-0"
            style={{ borderTop: '1px solid #1d2029' }}
          >
            <button
              onClick={() => exec('SELL')}
              disabled={!canTrade || loading}
              className="flex-1 flex flex-col items-center py-3 transition-all active:scale-95"
              style={{
                background: canTrade ? '#7a1a1a' : '#12161f',
                border: `1px solid ${canTrade ? '#8f1f1f' : '#2e3340'}`,
                borderRadius: 10,
                opacity: canTrade ? 1 : 0.4,
              }}
            >
              <span style={{ fontSize: 10, color: '#e84040', opacity: 0.7 }}>BID</span>
              <span className="font-mono font-bold" style={{ fontSize: 18, color: '#e84040' }}>
                {bid > 0 ? bid.toFixed(2) : '——'}
              </span>
              <span className="font-bold tracking-widest" style={{ fontSize: 12, color: '#e84040' }}>SELL</span>
            </button>

            <button
              onClick={() => exec('BUY')}
              disabled={!canTrade || loading}
              className="flex-1 flex flex-col items-center py-3 transition-all active:scale-95"
              style={{
                background: canTrade ? '#1a6b3a' : '#12161f',
                border: `1px solid ${canTrade ? '#1e7d44' : '#2e3340'}`,
                borderRadius: 10,
                opacity: canTrade ? 1 : 0.4,
              }}
            >
              <span style={{ fontSize: 10, color: '#2dcc6f', opacity: 0.7 }}>ASK</span>
              <span className="font-mono font-bold" style={{ fontSize: 18, color: '#2dcc6f' }}>
                {ask > 0 ? ask.toFixed(2) : '——'}
              </span>
              <span className="font-bold tracking-widest" style={{ fontSize: 12, color: '#2dcc6f' }}>BUY</span>
            </button>
          </div>
        )}

        {!canTrade && tab === 'order' && (
          <div className="px-4 pb-3 shrink-0 text-center" style={{ fontSize: 10, color: '#4a5568' }}>
            Configura SL y TP para habilitar las órdenes
          </div>
        )}
      </div>
    </>
  );
}
