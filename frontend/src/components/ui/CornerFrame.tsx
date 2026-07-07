import React from 'react';

const MARK_SIZE = 10;
const MARK_COLOR = '#c9a84c55';
const MARK_THICK = 1.5;

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const top    = pos === 'tl' || pos === 'tr';
  const left   = pos === 'tl' || pos === 'bl';
  return (
    <div style={{
      position: 'absolute',
      ...(top  ? { top: -1 }    : { bottom: -1 }),
      ...(left ? { left: -1 }   : { right: -1  }),
      width:  MARK_SIZE,
      height: MARK_SIZE,
      pointerEvents: 'none',
    }}>
      {/* horizontal arm */}
      <div style={{
        position: 'absolute',
        top: '50%', left: 0, right: 0,
        height: MARK_THICK,
        marginTop: -MARK_THICK / 2,
        background: MARK_COLOR,
      }} />
      {/* vertical arm */}
      <div style={{
        position: 'absolute',
        left: '50%', top: 0, bottom: 0,
        width: MARK_THICK,
        marginLeft: -MARK_THICK / 2,
        background: MARK_COLOR,
      }} />
    </div>
  );
}

export function CornerFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, borderTop: '1px solid #1d2029', borderBottom: '1px solid #1d2029', pointerEvents: 'none' }} />
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />
      {children}
    </div>
  );
}
