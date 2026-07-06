'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePricesStore } from '@/store/prices.store';
import { useAuthStore } from '@/store/auth.store';
import { useLangStore } from '@/store/lang.store';
import { useChartStore } from '@/store/chart.store';
import { useAccount } from '@/hooks/useAccount';
import { useTrades } from '@/hooks/useTrades';
import { useT } from '@/hooks/useT';
import { resetOnboarding } from '@/components/onboarding/OnboardingWizard';
import { LotCalculator } from '@/components/trade/LotCalculator';
import type { Lang } from '@/lib/i18n';
import clsx from 'clsx';

const LANG_OPTIONS: { code: 'es' | Lang; flag: string }[] = [
  { code: 'es', flag: '🇪🇸' },
  { code: 'en', flag: '🇬🇧' },
  { code: 'nl', flag: '🇳🇱' },
];

// ─── Dropdown primitives ──────────────────────────────────────────────────────

interface MenuItem {
  label?: string;
  shortcut?: string;
  action?: () => void;
  checked?: boolean;
  separator?: boolean;
  disabled?: boolean;
  danger?: boolean;
}

function Dropdown({
  items,
  onClose,
  style,
}: {
  items: MenuItem[];
  onClose: () => void;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 z-50 min-w-[200px] bg-[#1a1d24] border border-[#2e3340] shadow-2xl py-1"
      style={style}
    >
      {items.map((item, i) => {
        if (item.separator) {
          return <div key={i} className="h-px bg-[#2e3340] my-1" />;
        }
        return (
          <button
            key={i}
            disabled={item.disabled}
            onClick={() => { item.action?.(); onClose(); }}
            className={clsx(
              'w-full flex items-center justify-between px-4 py-1 text-left transition-colors',
              item.disabled
                ? 'text-[#4a5568] cursor-not-allowed'
                : item.danger
                ? 'text-[#f87171] hover:bg-[#ef4444]/10'
                : 'text-[#c8cdd8] hover:bg-[#2e3340]',
            )}
            style={{ fontSize: 11 }}
          >
            <span className="flex items-center gap-2">
              {item.checked !== undefined && (
                <span className="w-3 text-[var(--mt-cyan)]">{item.checked ? '✓' : ''}</span>
              )}
              {item.checked === undefined && <span className="w-3" />}
              {item.label}
            </span>
            {item.shortcut && (
              <span className="text-[#4a5568] ml-6" style={{ fontSize: 10 }}>{item.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Menu button with dropdown ────────────────────────────────────────────────

function MenuButton({
  label,
  items,
  open,
  onOpen,
  onClose,
}: {
  label: string;
  items: MenuItem[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={() => (open ? onClose() : onOpen())}
        className={clsx(
          'px-3 h-full transition-colors',
          open
            ? 'bg-[var(--mt-hover)] text-[var(--mt-white)]'
            : 'text-[var(--mt-text-dim)] hover:bg-[var(--mt-hover)] hover:text-[var(--mt-text)]',
        )}
        style={{ fontSize: 11 }}
      >
        {label}
      </button>
      {open && <Dropdown items={items} onClose={onClose} />}
    </div>
  );
}

// ─── Main toolbar ─────────────────────────────────────────────────────────────

export function MTToolbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { currentPrice, connected } = usePricesStore();
  const { clearTokens } = useAuthStore();
  const { lang, setLang } = useLangStore();
  const { account, reset } = useAccount();
  const { openTrades } = useTrades();
  const chart = useChartStore();
  const t = useT();
  const [time, setTime] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showLotCalc, setShowLotCalc] = useState(false);

  const close = useCallback(() => setOpenMenu(null), []);

  const totalLivePnl = openTrades.reduce((sum, tr) => {
    if (currentPrice <= 0) return sum;
    return sum + (tr.type === 'BUY'
      ? (currentPrice - tr.entryPrice) * tr.lot * 100
      : (tr.entryPrice - currentPrice) * tr.lot * 100);
  }, 0);
  const equity = (account?.currentBalance ?? 0) + totalLivePnl;

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('es', { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Menu definitions ────────────────────────────────────────────────────────

  const MENUS: { key: string; label: string; items: MenuItem[] }[] = [
    {
      key: 'file',
      label: t.menuFile,
      items: [
        { label: t.newDemoAccount, action: async () => { if (confirm(t.confirmReset)) { await reset(); } } },
        { separator: true },
        { label: t.exportHistoryCsv, action: () => exportCSV(), shortcut: '⌘E' },
        { separator: true },
        { label: t.logout, action: () => { clearTokens(); router.replace('/auth/login'); }, danger: true },
      ],
    },
    {
      key: 'view',
      label: t.menuView,
      items: [
        { label: t.menuItemChart,     action: () => router.push('/dashboard'), shortcut: '⌘1' },
        { label: t.menuItemSimulator, action: () => router.push('/trade'),     shortcut: '⌘2' },
        { label: t.menuItemHistory,   action: () => router.push('/history'),   shortcut: '⌘3' },
        { label: t.menuItemMissions,  action: () => router.push('/learn'),     shortcut: '⌘4' },
        { label: t.menuItemAcademy,   action: () => router.push('/academy'),   shortcut: '⌘5' },
        { label: t.menuItemStats,     action: () => router.push('/stats'),     shortcut: '⌘6' },
        { separator: true },
        { label: t.menuItemVolume, action: chart.toggleVolume, checked: chart.showVolume },
      ],
    },
    {
      key: 'insert',
      label: t.menuInsert,
      items: [
        { label: t.menuItemNewOrder, action: () => router.push('/trade'), shortcut: 'F9' },
        { separator: true },
        { label: t.menuItemHLine, disabled: true },
        { label: t.menuItemTLine, disabled: true },
        { label: t.menuItemFib,   disabled: true },
      ],
    },
    {
      key: 'charts',
      label: t.menuCharts,
      items: [
        { label: 'M5',  action: () => chart.setTimeframe('M5'),  checked: chart.timeframe === 'M5'  },
        { label: 'M15', action: () => chart.setTimeframe('M15'), checked: chart.timeframe === 'M15' },
        { label: 'H1',  action: () => chart.setTimeframe('H1'),  checked: chart.timeframe === 'H1'  },
        { label: 'H4',  action: () => chart.setTimeframe('H4'),  checked: chart.timeframe === 'H4'  },
        { label: 'D1',  action: () => chart.setTimeframe('D1'),  checked: chart.timeframe === 'D1'  },
        { separator: true },
        { label: t.menuItemMA20, action: chart.toggleMA20, checked: chart.showMA20 },
        { label: t.menuItemMA50, action: chart.toggleMA50, checked: chart.showMA50 },
        { label: 'RSI',          action: chart.toggleRSI,  checked: chart.showRSI  },
        { label: 'MACD',         action: chart.toggleMACD, checked: chart.showMACD },
        { label: t.menuItemBB,   action: chart.toggleBB,   checked: chart.showBB   },
        { separator: true },
        { label: chart.replayMode ? t.menuItemReplayStop : t.menuItemReplayStart, action: () => chart.setReplayMode(!chart.replayMode) },
      ],
    },
    {
      key: 'tools',
      label: t.menuTools,
      items: [
        { label: t.menuItemRiskCalc, action: () => { setShowLotCalc(true); close(); } },
        { separator: true },
        { label: t.menuItemLangEs, action: () => setLang('es'), checked: lang === 'es' },
        { label: t.menuItemLangEn, action: () => setLang('en'), checked: lang === 'en' },
        { label: t.menuItemLangNl, action: () => setLang('nl'), checked: lang === 'nl' },
        { separator: true },
        { label: t.menuItemEvaluate, action: () => router.push('/learn') },
        { separator: true },
        { label: t.menuItemRelaunch, action: () => { resetOnboarding(); window.location.reload(); } },
      ],
    },
    {
      key: 'window',
      label: t.menuWindow,
      items: [
        { label: t.menuItemFullscreen, action: () => toggleFullscreen(), shortcut: '⌘⇧F' },
        { separator: true },
        { label: t.menuItemChart,     action: () => router.push('/dashboard') },
        { label: t.menuItemSimulator, action: () => router.push('/trade')     },
        { label: t.menuItemAcademy,   action: () => router.push('/academy')   },
      ],
    },
    {
      key: 'help',
      label: t.menuHelp,
      items: [
        { label: t.menuItemAcademy,   action: () => router.push('/academy') },
        { label: t.menuItemMissions,  action: () => router.push('/learn') },
        { separator: true },
        { label: 'GoldTrader MT v1.0', action: () => alert('GoldTrader MT v1.0\nXAU/USD Professional Simulator'), disabled: false },
      ],
    },
  ];

  // ── Toolbar actions ─────────────────────────────────────────────────────────

  const TOOLBAR_ACTIONS = [
    { icon: '📈', label: t.navChart,    href: '/dashboard' },
    { icon: '⚡', label: t.navNewOrder, href: '/trade' },
    { icon: '📋', label: t.navHistory,  href: '/history' },
    { icon: '🎯', label: t.navMissions, href: '/learn' },
    { icon: '🎓', label: 'Academia',    href: '/academy' },
    { icon: '📊', label: t.navStats,    href: '/stats' },
  ];

  return (
    <>
    <div className="flex flex-col shrink-0 select-none">
      {/* ── Menu bar ── */}
      <div className="flex items-center h-6 bg-[#0d1017] border-b border-[var(--mt-border)] px-1" style={{ fontSize: 11 }}>
        {MENUS.map((menu) => (
          <MenuButton
            key={menu.key}
            label={menu.label}
            items={menu.items}
            open={openMenu === menu.key}
            onOpen={() => setOpenMenu(menu.key)}
            onClose={close}
          />
        ))}

        <div className="flex-1" />

        {/* Language selector */}
        <div className="flex items-center gap-0.5 px-2 border-r border-[var(--mt-border)]">
          {LANG_OPTIONS.map(({ code, flag }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              title={code.toUpperCase()}
              className={clsx(
                'px-1.5 h-5 text-[11px] transition-colors rounded-sm',
                lang === code
                  ? 'bg-[var(--mt-blue)]/30 text-[var(--mt-white)]'
                  : 'text-[var(--mt-text-dim)] hover:bg-[var(--mt-hover)]',
              )}
            >
              {flag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 text-[10px] text-[var(--mt-text-dim)]">
          <span className={clsx('w-1.5 h-1.5 rounded-full', connected ? 'bg-[var(--mt-green)]' : 'bg-[var(--mt-red)]')} />
          {connected ? t.connected : t.disconnected}
        </div>
        <button
          onClick={() => { clearTokens(); router.replace('/auth/login'); }}
          className="px-3 h-full text-[var(--mt-text-dim)] hover:text-[var(--mt-red)] transition-colors"
        >
          {t.logout}
        </button>
      </div>

      {/* ── Icon toolbar ── */}
      <div className="flex items-center h-9 bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] px-1 gap-0.5">
        {TOOLBAR_ACTIONS.map((a) => {
          const active = pathname === a.href || (a.href !== '/dashboard' && pathname.startsWith(a.href));
          return (
            <button
              key={a.href}
              onClick={() => router.push(a.href)}
              className={clsx(
                'flex items-center gap-1.5 px-2.5 h-7 text-[11px] border transition-colors',
                active
                  ? 'bg-[var(--mt-hover)] border-[var(--mt-sep)] text-[var(--mt-white)]'
                  : 'border-transparent text-[var(--mt-text-dim)] hover:bg-[var(--mt-hover)] hover:border-[var(--mt-sep)] hover:text-[var(--mt-text)]',
              )}
            >
              <span style={{ fontSize: 12 }}>{a.icon}</span>
              <span>{a.label}</span>
            </button>
          );
        })}

        <div className="w-px h-5 bg-[var(--mt-sep)] mx-2" />

        {/* Timeframe pills */}
        {(['M5', 'M15', 'H1', 'H4', 'D1'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => chart.setTimeframe(tf)}
            className={clsx(
              'px-2 h-5 text-[10px] font-mono border transition-colors',
              chart.timeframe === tf
                ? 'border-[var(--mt-blue)] bg-[var(--mt-blue)]/20 text-[var(--mt-cyan)]'
                : 'border-transparent text-[var(--mt-text-dim)] hover:border-[var(--mt-sep)] hover:text-[var(--mt-text)]',
            )}
          >
            {tf}
          </button>
        ))}

        <div className="w-px h-5 bg-[var(--mt-sep)] mx-2" />

        {/* Precio en vivo */}
        <div className="flex items-center gap-2">
          <span className="text-[var(--mt-text-dim)] text-[11px]">XAUUSD</span>
          <span className="font-mono font-bold text-[var(--mt-cyan)] text-[10px] tracking-wide tabular-nums">
            {currentPrice > 0 ? currentPrice.toFixed(2) : '——.——'}
          </span>
        </div>

        <div className="flex-1" />

        {/* Replay badge */}
        {chart.replayMode && (
          <div className="flex items-center gap-1.5 px-2 h-5 border border-[var(--mt-yellow)]/40 bg-[var(--mt-yellow)]/10 mr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--mt-yellow)] animate-pulse" />
            <span className="text-[var(--mt-yellow)] text-[10px] font-mono">REPLAY</span>
            <button onClick={() => chart.setReplayMode(false)} className="text-[var(--mt-text-dim)] hover:text-[var(--mt-red)] ml-1 text-[10px]">✕</button>
          </div>
        )}

        {/* Account quick-view */}
        {account && (
          <div className="flex items-center gap-3 px-3 border-r border-[var(--mt-sep)] text-[11px]">
            <span className="text-[var(--mt-text-dim)]">
              {t.balance}: <span className="font-mono text-[var(--mt-white)] tabular-nums">${account.currentBalance.toFixed(2)}</span>
            </span>
            <span className="text-[var(--mt-text-dim)]">
              {t.equity}: <span className={clsx('font-mono tabular-nums', equity >= account.currentBalance ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>${equity.toFixed(2)}</span>
            </span>
            {totalLivePnl !== 0 && (
              <span className={clsx('font-mono tabular-nums text-[10px]', totalLivePnl >= 0 ? 'text-[var(--mt-green)]' : 'text-[var(--mt-red)]')}>
                {totalLivePnl >= 0 ? '+' : ''}{totalLivePnl.toFixed(2)}
              </span>
            )}
          </div>
        )}

        <div className="font-mono text-[11px] text-[var(--mt-text-dim)] px-3 tabular-nums">
          {time} GMT+0
        </div>
      </div>
    </div>

    {showLotCalc && <LotCalculator onClose={() => setShowLotCalc(false)} />}
    </>
  );
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function exportCSV() {
  try {
    const raw = localStorage.getItem('gold-trades') ?? '[]';
    const trades = JSON.parse(raw);
    if (!trades.length) { alert('No hay historial para exportar.'); return; }
    const header = 'Ticket,Tipo,Lote,Entrada,Salida,SL,TP,Resultado USD,R:R,Riesgo%,Fecha\n';
    const rows = trades.map((t: Record<string, unknown>) =>
      [t.id, t.type, t.lot, t.entryPrice, t.exitPrice ?? '', t.sl ?? '', t.tp ?? '', t.resultUsd ?? '', t.rrRatio ?? '', t.riskPct ?? '', t.entryAt].join(',')
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `goldtrader_historial_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  } catch {
    alert('Exporta el historial desde la sección Historial.');
  }
}

function openRiskCalc() {
  const balance = prompt('Balance de la cuenta ($):', '10000');
  if (!balance) return;
  const risk = prompt('Riesgo por trade (%):', '1');
  if (!risk) return;
  const sl = prompt('Stop Loss en pips (1 pip = $0.01 en oro):');
  if (!sl) return;

  const riskUsd = (parseFloat(balance) * parseFloat(risk)) / 100;
  const pipValue = 1; // $1 por pip con 1 lote estándar
  const lots = riskUsd / (parseFloat(sl) * pipValue);

  alert(
    `━━ Calculadora de Riesgo XAU/USD ━━\n\n` +
    `Balance: $${parseFloat(balance).toFixed(2)}\n` +
    `Riesgo: ${risk}% = $${riskUsd.toFixed(2)}\n` +
    `Stop Loss: ${sl} pips\n\n` +
    `▶ Tamaño de posición: ${lots.toFixed(2)} lotes\n` +
    `▶ Con 0.01 lotes: riesgo = $${(parseFloat(sl) * 0.1).toFixed(2)}\n` +
    `▶ Con 0.10 lotes: riesgo = $${(parseFloat(sl) * 1).toFixed(2)}\n\n` +
    `Regla: Nunca arriesgues más del 1-2% por trade.`
  );
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}
