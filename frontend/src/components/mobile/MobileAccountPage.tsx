'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useAccount } from '@/hooks/useAccount';
import { useSuperwall } from '@/hooks/useSuperwall';
import { useChartStore } from '@/store/chart.store';
import clsx from 'clsx';
import type { Lang } from '@/lib/i18n';
import { useLangStore } from '@/store/lang.store';

type AppLang = Lang | 'es';
const LANGS: { code: AppLang; flag: string; label: string }[] = [
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'nl', flag: '🇳🇱', label: 'Nederlands' },
];

export function MobileAccountPage() {
  const router = useRouter();
  const { clearTokens } = useAuthStore();
  const { account, reset } = useAccount();
  const { status } = useSuperwall();
  const chart = useChartStore();
  const { lang, setLang } = useLangStore();

  if (!account) return null;

  const isPro = status?.plan === 'lifetime';

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ overscrollBehavior: 'contain' }}>

      {/* Profile card */}
      <div style={{ background: '#12161f', border: '1px solid #1d2029', borderRadius: 14, padding: '16px' }}>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center font-bold text-lg font-mono"
            style={{
              width: 48, height: 48, borderRadius: 10,
              background: '#1a1508', border: '1px solid #c9a84c44', color: '#c9a84c',
            }}
          >
            {(account.user?.name ?? account.user?.email ?? '?')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ fontWeight: 700, color: '#e8ecf4', fontSize: 15, letterSpacing: '-0.01em' }}>
              {account.user?.name ?? '—'}
            </div>
            <div style={{ fontSize: 11, color: '#6b7385', marginTop: 1 }} className="truncate">
              {account.user?.email ?? '—'}
            </div>
          </div>
          <div
            className="font-mono text-xs font-bold uppercase tracking-widest px-2.5 py-1"
            style={{
              background: isPro ? '#1a1508' : '#0e1118',
              border: `1px solid ${isPro ? '#c9a84c66' : '#2e3340'}`,
              color: isPro ? '#c9a84c' : '#4a5568',
              borderRadius: 6,
            }}
          >
            {isPro ? '◆ PRO' : 'FREE'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {[
            { label: 'Balance',   value: `$${account.currentBalance.toFixed(2)}`,  color: '#e8ecf4' },
            { label: 'Nivel',     value: `${account.level}`,                        color: '#f0b429' },
            { label: 'XP',        value: `${account.xp} pts`,                       color: '#f0b429' },
            { label: 'Balance 0', value: `$${account.initialBalance.toFixed(2)}`,   color: '#4a5568' },
          ].map((item) => (
            <div key={item.label} style={{ background: '#0b0d14', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, color: '#4a5568', marginBottom: 3 }}>{item.label}</div>
              <div className="font-mono font-bold" style={{ fontSize: 14, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Free tier bar */}
      {status && !status.paid && (
        <div style={{ background: '#12161f', border: '1px solid #1d2029', borderRadius: 12, padding: '14px 16px' }}>
          <div className="flex justify-between mb-2" style={{ fontSize: 11, color: '#6b7385' }}>
            <span>Simulaciones gratuitas</span>
            <span style={{ color: status.simulationsUsed >= status.simulationsLimit ? '#e84040' : '#c9a84c', fontFamily: 'monospace' }}>
              {status.simulationsUsed} / {status.simulationsLimit}
            </span>
          </div>
          <div style={{ height: 6, background: '#0b0d14', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, (status.simulationsUsed / status.simulationsLimit) * 100)}%`,
              background: status.simulationsUsed >= status.simulationsLimit ? '#e84040' : '#c9a84c',
              borderRadius: 3,
            }} />
          </div>
          <button
            onClick={() => router.push('/payment/checkout')}
            className="w-full mt-3 py-2.5 font-bold text-sm"
            style={{
              background: 'linear-gradient(135deg, #c9a84c 0%, #e8b84b 100%)',
              color: '#0a0c11', borderRadius: 8,
            }}
          >
            ◆ Activar PRO — €9.95
          </button>
        </div>
      )}

      {/* Chart toggles */}
      <div style={{ background: '#12161f', border: '1px solid #1d2029', borderRadius: 12, padding: '14px 16px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#8893a8', marginBottom: 12, letterSpacing: 0.5 }}>
          INDICADORES
        </div>
        <div className="space-y-1">
          {[
            { label: 'MA20', active: chart.showMA20, toggle: chart.toggleMA20 },
            { label: 'MA50', active: chart.showMA50, toggle: chart.toggleMA50 },
            { label: 'RSI',  active: chart.showRSI,  toggle: chart.toggleRSI  },
            { label: 'MACD', active: chart.showMACD, toggle: chart.toggleMACD },
            { label: 'Bollinger Bands', active: chart.showBB, toggle: chart.toggleBB },
            { label: 'Volumen', active: chart.showVolume, toggle: chart.toggleVolume },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.toggle}
              className="w-full flex items-center justify-between py-2.5 px-1"
              style={{ borderBottom: '1px solid #1d2029' }}
            >
              <span style={{ fontSize: 13, color: '#c8cdd8' }}>{item.label}</span>
              <div
                className="flex items-center"
                style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: item.active ? '#4a6cf7' : '#2e3340',
                  padding: '2px',
                  transition: 'background 0.2s',
                }}
              >
                <div
                  style={{
                    width: 18, height: 18, borderRadius: 9,
                    background: '#fff',
                    transform: item.active ? 'translateX(18px)' : 'translateX(0)',
                    transition: 'transform 0.2s',
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div style={{ background: '#12161f', border: '1px solid #1d2029', borderRadius: 12, padding: '14px 16px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#8893a8', marginBottom: 12, letterSpacing: 0.5 }}>
          IDIOMA
        </div>
        <div className="flex gap-2">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className="flex-1 flex flex-col items-center py-3 gap-1"
              style={{
                borderRadius: 8,
                background: lang === l.code ? '#4a6cf720' : 'transparent',
                border: `1px solid ${lang === l.code ? '#4a6cf7' : '#2e3340'}`,
              }}
            >
              <span style={{ fontSize: 20 }}>{l.flag}</span>
              <span style={{ fontSize: 10, color: lang === l.code ? '#33c2ff' : '#6b7385' }}>{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ background: '#12161f', border: '1px solid #1d2029', borderRadius: 12, padding: '8px' }}>
        <button
          onClick={async () => { if (confirm('¿Resetear cuenta demo? Se pierden todos los trades.')) { await reset(); } }}
          className="w-full flex items-center gap-3 px-4 py-3"
          style={{ color: '#f0b429', fontSize: 14 }}
        >
          <span>🔄</span>
          <span>Reiniciar cuenta demo</span>
        </button>
        <div style={{ height: 1, background: '#1d2029' }} />
        <button
          onClick={() => { clearTokens(); router.replace('/auth/login'); }}
          className="w-full flex items-center gap-3 px-4 py-3"
          style={{ color: '#e84040', fontSize: 14 }}
        >
          <span>→</span>
          <span>Cerrar sesión</span>
        </button>
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}
