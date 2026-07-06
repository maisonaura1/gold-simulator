'use client';
import { useState } from 'react';
import { usePricesStore } from '@/store/prices.store';
import { tradeDeskApi } from '@/lib/trade-desk-api';
import type { Membership, DeskSide, TradeOrder } from '@/types/trade-desk';

interface Props {
  memberships: Membership[];
  onOrderCreated: (order: TradeOrder) => void;
}

const FIELD = 'w-full bg-desk-card border border-desk-border text-mt-text text-xs font-mono px-2 py-1.5 rounded focus:outline-none focus:border-gold-600';
const LABEL = 'text-mt-label text-xs uppercase tracking-widest mb-1';

export function DeskOrderEntry({ memberships, onOrderCreated }: Props) {
  const price = usePricesStore((s) => s.currentPrice);

  const writableBooks = memberships.filter((m) => m.role === 'OWNER' || m.role === 'TRADER');

  const [bookId,   setBookId]   = useState(writableBooks[0]?.bookId ?? '');
  const [side,     setSide]     = useState<DeskSide>('BUY');
  const [quantity, setQuantity] = useState('');
  const [entryPrice, setPrice]  = useState('');
  const [notes,    setNotes]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!bookId) return setError('Select a Gold Book first.');
    const qty = parseFloat(quantity);
    const prc = parseFloat(entryPrice);
    if (!qty || qty <= 0) return setError('Quantity must be > 0.');
    if (!prc || prc <= 0) return setError('Spot price must be > 0.');

    setLoading(true);
    try {
      const order = await tradeDeskApi.createOrder({ bookId, symbol: 'XAUUSD', side, quantity: qty, price: prc, notes: notes || undefined });
      setSuccess(true);
      setQuantity('');
      setNotes('');
      onOrderCreated(order);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Order creation failed.';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  }

  if (writableBooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 p-6">
        <span style={{ color: '#c9a84c', fontSize: 24 }}>◆</span>
        <p className="text-mt-dim text-xs text-center">You have VIEWER or AUDITOR access only.<br/>Order entry requires OWNER or TRADER role.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color: '#c9a84c', fontSize: 11, letterSpacing: 2 }} className="uppercase font-bold">Order Entry</span>
        <span style={{ color: '#2c2410', flex: 1, borderTop: '1px solid #2c2410' }} />
      </div>

      {/* Gold Book */}
      <div>
        <p className={LABEL}>Gold Book</p>
        <select
          className={FIELD + ' cursor-pointer'}
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          style={{ background: '#141720' }}
        >
          {writableBooks.map((m) => (
            <option key={m.bookId} value={m.bookId}>{m.bookName}</option>
          ))}
        </select>
      </div>

      {/* Instrument (locked) */}
      <div>
        <p className={LABEL}>Instrument</p>
        <div
          className="flex items-center justify-between px-2 py-1.5 rounded border text-xs font-mono"
          style={{ background: '#0f1117', borderColor: '#2c2410' }}
        >
          <span style={{ color: '#e8c96d', fontWeight: 700, letterSpacing: 1 }}>XAUUSD</span>
          <span style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2 }}>LOCKED · GOLD SPOT</span>
        </div>
      </div>

      {/* Side */}
      <div>
        <p className={LABEL}>Direction</p>
        <div className="grid grid-cols-2 gap-1">
          {(['BUY', 'SELL'] as DeskSide[]).map((s) => (
            <button
              key={s} type="button"
              onClick={() => setSide(s)}
              className="py-2 rounded text-xs font-bold tracking-widest uppercase transition-colors"
              style={{
                background: side === s
                  ? s === 'BUY' ? '#1a6b3a' : '#7a1a1a'
                  : '#141720',
                color: side === s
                  ? s === 'BUY' ? '#2dcc6f' : '#e84040'
                  : '#6b7385',
                border: `1px solid ${side === s ? (s === 'BUY' ? '#2dcc6f33' : '#e8404033') : '#1d2029'}`,
              }}
            >
              {s === 'BUY' ? '▲ BUY' : '▼ SELL'}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <p className={LABEL}>Ounces (oz)</p>
        <input
          type="number" min="0.1" step="0.1"
          placeholder="e.g. 10.0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className={FIELD}
          style={{ background: '#141720' }}
        />
      </div>

      {/* Spot price */}
      <div>
        <p className={LABEL}>Spot Price (USD/oz)</p>
        <div className="flex gap-1">
          <input
            type="number" min="1" step="0.01"
            placeholder={price ? price.toFixed(2) : 'e.g. 3342.50'}
            value={entryPrice}
            onChange={(e) => setPrice(e.target.value)}
            className={FIELD}
            style={{ background: '#141720' }}
          />
          {price && (
            <button
              type="button"
              onClick={() => setPrice(price.toFixed(2))}
              className="px-2 rounded text-xs shrink-0"
              style={{ background: '#1d2029', color: '#c9a84c', border: '1px solid #2c2410' }}
            >
              MKT
            </button>
          )}
        </div>
        {price && (
          <p style={{ color: '#6b7385', fontSize: 9, marginTop: 3 }}>
            Live spot: {price.toFixed(2)} USD/oz
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <p className={LABEL}>Internal notes</p>
        <input
          type="text"
          placeholder="Setup rationale, session context…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={FIELD}
          style={{ background: '#141720' }}
        />
      </div>

      {/* Notional preview */}
      {quantity && entryPrice && !isNaN(parseFloat(quantity)) && !isNaN(parseFloat(entryPrice)) && (
        <div
          className="flex justify-between items-center px-2 py-1.5 rounded text-xs font-mono"
          style={{ background: '#0f1117', border: '1px solid #2c2410' }}
        >
          <span style={{ color: '#6b7385' }}>Notional</span>
          <span style={{ color: '#c9a84c', fontWeight: 600 }}>
            ${(parseFloat(quantity) * parseFloat(entryPrice)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      )}

      {error && (
        <p className="text-xs px-2 py-1.5 rounded" style={{ background: '#2a0a0a', color: '#e84040', border: '1px solid #7a1a1a' }}>
          {error}
        </p>
      )}

      <button
        type="submit" disabled={loading}
        className="py-2.5 rounded text-xs font-bold tracking-widest uppercase transition-all"
        style={{
          background: success ? '#1a4a2a' : loading ? '#141720' : 'linear-gradient(135deg, #2c2410 0%, #1a1508 100%)',
          color: success ? '#2dcc6f' : loading ? '#6b7385' : '#c9a84c',
          border: `1px solid ${success ? '#2dcc6f44' : '#c9a84c44'}`,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {success ? '✓ DRAFT CREATED' : loading ? 'Processing…' : `◆ DRAFT ${side} ORDER`}
      </button>

      <p style={{ color: '#6b7385', fontSize: 9, textAlign: 'center', letterSpacing: 1 }}>
        Orders enter DRAFT state · require submission + review
      </p>
    </form>
  );
}
