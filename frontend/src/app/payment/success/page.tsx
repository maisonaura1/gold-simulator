'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/'), 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0d0d0d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <div
        style={{
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: 8,
          padding: '2.5rem',
          maxWidth: 420,
          width: '90%',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h1 style={{ color: '#f0b429', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
          ¡Pago completado!
        </h1>
        <p style={{ color: '#ccc', fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
          Tu acceso completo a <strong>GoldTrader MT</strong> está activo.
          Redirigiendo al simulador…
        </p>
        <div style={{ width: '100%', height: 3, background: '#333', borderRadius: 2, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              background: '#f0b429',
              animation: 'progress 4s linear forwards',
            }}
          />
        </div>
        <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
      </div>
    </div>
  );
}
