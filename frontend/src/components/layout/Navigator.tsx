'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TreeNode {
  label: string;
  icon?: string;
  href?: string;
  children?: TreeNode[];
}

const TREE: TreeNode[] = [
  {
    label: 'Cuenta Demo',
    icon: '👤',
    children: [
      { label: 'Datos de cuenta', href: '/dashboard' },
      { label: 'Resetear cuenta', href: '/dashboard' },
    ],
  },
  {
    label: 'Indicadores',
    icon: '📐',
    children: [
      { label: 'Media Móvil (MA)', icon: '〰️' },
      { label: 'RSI', icon: '〰️' },
      { label: 'MACD', icon: '〰️' },
      { label: 'Bandas Bollinger', icon: '〰️' },
    ],
  },
  {
    label: 'Misiones',
    icon: '🎯',
    children: [
      { label: 'Misiones activas', href: '/learn' },
      { label: 'Completadas',      href: '/learn' },
    ],
  },
  {
    label: 'Estadísticas',
    icon: '📊',
    children: [
      { label: 'Winrate', href: '/stats' },
      { label: 'Análisis de riesgo', href: '/stats' },
      { label: 'Historial completo', href: '/history' },
    ],
  },
];

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth === 0);
  const router = useRouter();
  const hasChildren = !!node.children?.length;

  return (
    <div>
      <div
        className="flex items-center gap-1 px-2 py-1 hover:bg-[var(--mt-hover)] cursor-pointer transition-colors"
        style={{ paddingLeft: `${8 + depth * 12}px`, fontSize: 11 }}
        onClick={() => {
          if (hasChildren) setOpen((v) => !v);
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
        <span className="text-[var(--mt-text)]">{node.label}</span>
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
  return (
    <div className="mt-panel w-44 shrink-0 flex flex-col">
      <div className="mt-panel-header">Navigator</div>
      <div className="flex-1 overflow-y-auto py-1">
        {TREE.map((node) => (
          <TreeItem key={node.label} node={node} />
        ))}
      </div>
    </div>
  );
}
