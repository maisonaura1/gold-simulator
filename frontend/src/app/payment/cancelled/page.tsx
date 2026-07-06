'use client';

import { useRouter } from 'next/navigation';

export default function PaymentCancelledPage() {
  const router = useRouter();

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
        <div style={{ fontSize: 48, marginBottom: 16 }}>↩️</div>
        <h1 style={{ color: '#ccc', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
          Pago cancelado
        </h1>
        <p style={{ color: '#888', fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
          No se ha realizado ningún cargo. Puedes seguir usando la versión de prueba o
          activar el acceso completo cuando quieras.
        </p>
        <button
          onClick={() => router.replace('/')}
          style={{
            background: '#f0b429',
            color: '#000',
            border: 'none',
            borderRadius: 4,
            padding: '10px 24px',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Volver al simulador
        </button>
      </div>
    </div>
  );
}
