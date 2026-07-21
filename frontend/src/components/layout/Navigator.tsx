'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChartStore } from '@/store/chart.store';
import { useAccount } from '@/hooks/useAccount';
import { useT } from '@/hooks/useT';
import clsx from 'clsx';

// Global event to switch TerminalPanel to the "account" tab
export const terminalTabEvent = typeof window !== 'undefined'
  ? new EventTarget()
  : null;

interface TreeNode {
  label: string;
  icon?: string;
  href?: string;
  action?: () => void;
  active?: boolean;
  children?: TreeNode[];
}

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth === 0);
  const router = useRouter();
  const hasChildren = !!node.children?.length;

  return (
    <div>
      <div
        className={clsx(
          'flex items-center gap-1 py-1 hover:bg-[var(--mt-hover)] cursor-pointer transition-colors',
          node.active && 'bg-[var(--mt-hover)]',
        )}
        style={{ paddingLeft: `${8 + depth * 12}px`, fontSize: 11 }}
        onClick={() => {
          if (hasChildren) setOpen((v) => !v);
          else if (node.action) node.action();
          else if (node.href) router.push(node.href);
        }}
      >
        {hasChildren && (
          <span className="text-[var(--mt-text-dim)] w-3 text-center" style={{ fontSize: 9 }}>
            {open ? '▼' : '▶'}
          </span>
        )}
        {!hasChildren && <span className="w-3" />}
        {node.icon && <span style={{ fontSize: 12 }}>{node.icon}</span>}
        <span className={clsx('flex-1', node.active ? 'text-[var(--mt-cyan)]' : 'text-[var(--mt-text)]')}>
          {node.label}
        </span>
        {node.active !== undefined && !hasChildren && (
          <span className={clsx('w-2 h-2 rounded-full mr-2', node.active ? 'bg-[var(--mt-cyan)]' : 'bg-[var(--mt-border)]')} />
        )}
      </div>
      {hasChildren && open && (
        <div>
          {node.children!.map((child) => (
            <TreeItem key={child.label} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Navigator() {
  const t = useT();
  const router = useRouter();
  const chart = useChartStore();
  const { reset } = useAccount();
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    if (!confirm('Reset account to $10,000? All open trades will be lost.')) return;
    setResetting(true);
    await reset();
    setResetting(false);
    // Switch terminal to account tab
    terminalTabEvent?.dispatchEvent(new CustomEvent('setTab', { detail: 'account' }));
  };

  const handleAccountData = () => {
    terminalTabEvent?.dispatchEvent(new CustomEvent('setTab', { detail: 'account' }));
  };

  const TREE: TreeNode[] = [
    {
      label: t.demoAccount,
      icon: '👤',
      children: [
        {
          label: t.accountData,
          action: handleAccountData,
        },
        {
          label: resetting ? 'Resetting…' : t.resetAccount,
          action: handleReset,
        },
      ],
    },
    {
      label: t.indicators,
      icon: '📐',
      children: [
        { label: 'MA 20',             icon: '〰️', active: chart.showMA20,   action: chart.toggleMA20   },
        { label: 'MA 50',             icon: '〰️', active: chart.showMA50,   action: chart.toggleMA50   },
        { label: 'RSI',               icon: '〰️', active: chart.showRSI,    action: chart.toggleRSI    },
        { label: 'MACD',              icon: '〰️', active: chart.showMACD,   action: chart.toggleMACD   },
        { label: 'Bollinger Bands',   icon: '〰️', active: chart.showBB,     action: chart.toggleBB     },
        { label: 'Volume',            icon: '〰️', active: chart.showVolume, action: chart.toggleVolume },
      ],
    },
    {
      label: t.missions,
      icon: '🎯',
      children: [
        { label: t.activeMissions,    href: '/learn' },
        { label: t.completedMissions, href: '/learn' },
      ],
    },
    {
      label: 'Academy',
      icon: '🎓',
      children: [
        { label: 'Level 1 — Beginner',     href: '/academy' },
        { label: 'Level 2 — Intermediate', href: '/academy' },
        { label: 'Level 3 — Advanced',     href: '/academy' },
      ],
    },
    {
      label: t.stats,
      icon: '📊',
      children: [
        { label: t.winrate,      href: '/stats' },
        { label: t.riskAnalysis, href: '/stats' },
        { label: t.fullHistory,  href: '/history' },
      ],
    },
  ];

  return (
    <div className="mt-panel w-44 shrink-0 flex flex-col">
      <div className="mt-panel-header">{t.navigator}</div>
      <div className="flex-1 overflow-y-auto py-1">
        {TREE.map((node) => (
          <TreeItem key={node.label} node={node} />
        ))}
      </div>
    </div>
  );
}
