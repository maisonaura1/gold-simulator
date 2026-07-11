'use client';
import clsx from 'clsx';

export type MobileTab = 'chart' | 'trade' | 'history' | 'stats' | 'account';

const TABS: { key: MobileTab; icon: string; label: string }[] = [
  { key: 'chart',   icon: '📈', label: 'Gráfico'   },
  { key: 'trade',   icon: '⚡', label: 'Operar'    },
  { key: 'history', icon: '📋', label: 'Historial'  },
  { key: 'stats',   icon: '📊', label: 'Stats'     },
  { key: 'account', icon: '👤', label: 'Cuenta'    },
];

interface Props {
  active: MobileTab;
  onChange: (tab: MobileTab) => void;
  openCount?: number;
}

export function MobileBottomNav({ active, onChange, openCount = 0 }: Props) {
  return (
    <nav
      className="flex shrink-0 select-none"
      style={{
        height: 'calc(56px + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: '#0a0c11',
        borderTop: '1px solid #1d2029',
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        const badge = tab.key === 'history' && openCount > 0 ? openCount : 0;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-colors"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* Active indicator line */}
            {isActive && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2"
                style={{ width: 28, height: 2, background: '#c9a84c', borderRadius: '0 0 2px 2px' }}
              />
            )}

            <span style={{ fontSize: 20, lineHeight: 1 }}>{tab.icon}</span>
            <span
              style={{
                fontSize: 9,
                letterSpacing: 0.5,
                color: isActive ? '#c9a84c' : '#4a5568',
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {tab.label}
            </span>

            {/* Badge */}
            {badge > 0 && (
              <div
                className="absolute top-1 right-1/4 flex items-center justify-center rounded-full font-bold"
                style={{
                  width: 14, height: 14, fontSize: 8,
                  background: '#e84040', color: '#fff',
                }}
              >
                {badge}
              </div>
            )}
          </button>
        );
      })}
    </nav>
  );
}
