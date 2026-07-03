'use client';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { api } from '@/lib/api';
import { useAccount } from '@/hooks/useAccount';
import type { UserMission } from '@/types';
import Link from 'next/link';
import clsx from 'clsx';

const LEVEL_TAG: Record<string, { label: string; color: string; bar: string; xpRequired: number }> = {
  '🟡': { label: 'Nivel 1 · Principiante', color: 'border-yellow-500/30 bg-yellow-500/5',  bar: 'bg-yellow-400',  xpRequired: 0    },
  '🔵': { label: 'Nivel 2 · Intermedio',   color: 'border-blue-500/30 bg-blue-500/5',       bar: 'bg-blue-400',    xpRequired: 500  },
  '🔴': { label: 'Nivel 3 · Avanzado',     color: 'border-red-500/30 bg-red-500/5',          bar: 'bg-red-400',     xpRequired: 1500 },
  '📅': { label: 'Diaria',                 color: 'border-purple-500/30 bg-purple-500/5',   bar: 'bg-purple-400',  xpRequired: 0    },
};

function getMissionLevel(name: string) {
  return LEVEL_TAG[name[0]] ?? LEVEL_TAG['📅'];
}

function XpBar({ xp }: { xp: number }) {
  const levels = [
    { label: 'N1', xp: 0,    next: 500,  color: 'bg-yellow-400' },
    { label: 'N2', xp: 500,  next: 1500, color: 'bg-blue-400'   },
    { label: 'N3', xp: 1500, next: 3500, color: 'bg-red-400'    },
  ];
  const current = [...levels].reverse().find((l) => xp >= l.xp) ?? levels[0];
  const pct = Math.min(100, ((xp - current.xp) / (current.next - current.xp)) * 100);
  const nextLevel = levels[levels.indexOf(current) + 1];

  return (
    <div className="px-4 py-3 bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)]">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-[var(--mt-text-dim)] uppercase tracking-wide">XP Total</span>
          <span className="font-mono text-[12px] font-bold text-[var(--mt-yellow)]">⚡ {xp}</span>
        </div>
        <div className="flex items-center gap-3">
          {levels.map((l) => (
            <div key={l.label} className={clsx('flex items-center gap-1', xp >= l.xp ? 'opacity-100' : 'opacity-30')}>
              <div className={clsx('w-2 h-2 rounded-full', l.color)} />
              <span className="text-[9px] text-[var(--mt-text-dim)]">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-[var(--mt-bg)] border border-[var(--mt-border)] overflow-hidden">
          <div className={clsx('h-full transition-all duration-700', current.color)} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[9px] font-mono text-[var(--mt-text-dim)] w-28 text-right">
          {xp} / {current.next} XP {nextLevel ? `→ ${nextLevel.label}` : '🏆 MAX'}
        </span>
      </div>
    </div>
  );
}

function MissionCard({ um }: { um: UserMission }) {
  const meta = getMissionLevel(um.mission.name);
  const pct = Math.min(100, (um.currentProgress / um.targetProgress) * 100);
  const done = um.status === 'COMPLETED';

  return (
    <div className={clsx('border p-3 transition-all', done ? 'border-[#16a34a]/30 bg-[#16a34a]/5 opacity-70' : meta.color)}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className={clsx('font-medium', done ? 'text-[#4ade80]' : 'text-[var(--mt-white)]')} style={{ fontSize: 11 }}>
              {done ? '✅ ' : ''}{um.mission.name}
            </span>
            <span className="text-[8px] px-1 py-0.5 border border-[var(--mt-border)] text-[var(--mt-text-dim)] uppercase tracking-wide whitespace-nowrap">
              {meta.label}
            </span>
          </div>
          <p className="text-[var(--mt-text-dim)] leading-relaxed" style={{ fontSize: 10 }}>
            {um.mission.description}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[var(--mt-yellow)] font-mono font-bold" style={{ fontSize: 11 }}>+{um.mission.xpReward}</div>
          <div className="text-[9px] text-[var(--mt-text-dim)]">XP</div>
        </div>
      </div>
      {!done && (
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1.5 bg-[var(--mt-bg)] border border-[var(--mt-border)] overflow-hidden">
            <div className={clsx('h-full transition-all duration-500', meta.bar)} style={{ width: `${pct}%` }} />
          </div>
          <span className="font-mono text-[9px] text-[var(--mt-text-dim)] tabular-nums w-20 text-right">
            {um.currentProgress.toFixed(0)} / {um.targetProgress.toFixed(0)}
          </span>
          <span className={clsx('font-mono text-[10px] tabular-nums w-8 text-right', pct >= 75 ? 'text-[var(--mt-green)]' : pct >= 40 ? 'text-[var(--mt-yellow)]' : 'text-[var(--mt-text-dim)]')}>
            {pct.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
}

type Section = 'active' | 'daily' | 'completed' | 'all';

export default function LearnPage() {
  const [missions, setMissions] = useState<UserMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [section, setSection] = useState<Section>('active');
  const { account } = useAccount();

  const fetchMissions = async () => {
    const { data } = await api.get<UserMission[]>('/missions');
    setMissions(data);
    setLoading(false);
  };

  const evaluate = async () => {
    setEvaluating(true);
    const { data } = await api.post<UserMission[]>('/missions/evaluate');
    setMissions(data);
    setEvaluating(false);
  };

  useEffect(() => { fetchMissions(); }, []);

  const active    = missions.filter((m) => m.status === 'ACTIVE' && !m.mission.isDaily);
  const daily     = missions.filter((m) => m.mission.isDaily);
  const completed = missions.filter((m) => m.status === 'COMPLETED');

  const displayed =
    section === 'active'    ? active :
    section === 'daily'     ? daily :
    section === 'completed' ? completed :
    missions;

  const xp = account?.xp ?? 0;
  const xpPending = missions.filter((m) => m.status === 'ACTIVE').reduce((s, m) => s + m.mission.xpReward, 0);

  const TABS: { key: Section; label: string; count: number }[] = [
    { key: 'active',    label: 'Activas',     count: active.length    },
    { key: 'daily',     label: 'Diarias',     count: daily.length     },
    { key: 'completed', label: 'Completadas', count: completed.length },
    { key: 'all',       label: 'Todas',       count: missions.length  },
  ];

  return (
    <AppShell>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] shrink-0">
          <span className="text-[var(--mt-text-label)] font-medium uppercase tracking-wide" style={{ fontSize: 11 }}>
            🎯 Misiones de Entrenamiento XAU/USD
          </span>
          <div className="flex items-center gap-2">
            <Link href="/academy" className="text-[10px] border border-[var(--mt-sep)] px-2 py-1 text-[var(--mt-cyan)] hover:bg-[var(--mt-hover)] transition-colors">
              🎓 Academia →
            </Link>
            <button onClick={evaluate} disabled={evaluating} className="mt-btn text-[10px] border border-[var(--mt-sep)] disabled:opacity-40">
              {evaluating ? '⏳ Evaluando...' : '🔄 Evaluar progreso'}
            </button>
          </div>
        </div>

        {/* XP bar */}
        <XpBar xp={xp} />

        {/* Stats */}
        <div className="flex border-b border-[var(--mt-border)] shrink-0">
          {[
            { label: 'Completadas',  value: completed.length,   color: 'text-[var(--mt-green)]'    },
            { label: 'En progreso',  value: active.length,      color: 'text-[var(--mt-cyan)]'     },
            { label: 'XP ganado',    value: `${xp} pts`,        color: 'text-[var(--mt-yellow)]'   },
            { label: 'XP pendiente', value: `${xpPending} pts`, color: 'text-[var(--mt-text-dim)]' },
          ].map((s) => (
            <div key={s.label} className="flex-1 px-3 py-2 border-r border-[var(--mt-border)] last:border-0">
              <div className={clsx('font-mono font-bold', s.color)} style={{ fontSize: 13 }}>{s.value}</div>
              <div className="text-[var(--mt-text-dim)]" style={{ fontSize: 9 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--mt-border)] bg-[#0e1118] shrink-0">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setSection(tab.key)} className={clsx('mt-tab flex items-center gap-1.5', section === tab.key && 'mt-tab-active')}>
              {tab.label}
              <span className={clsx('text-[9px] px-1 rounded-sm', section === tab.key ? 'bg-[var(--mt-blue)]/30 text-[var(--mt-cyan)]' : 'text-[var(--mt-text-dim)]')}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-[var(--mt-text-dim)]" style={{ fontSize: 11 }}>Cargando misiones...</div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <span className="text-2xl">{section === 'completed' ? '🏆' : '🎯'}</span>
              <div className="text-[var(--mt-text-dim)] text-[11px]">
                {section === 'completed' ? 'Completa misiones operando en el simulador' : 'No hay misiones aquí'}
              </div>
              <Link href="/trade" className="text-[10px] text-[var(--mt-cyan)] border border-[var(--mt-sep)] px-3 py-1 hover:bg-[var(--mt-hover)] transition-colors">
                ⚡ Ir al simulador
              </Link>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {section === 'active' && (
                <div className="border border-[var(--mt-sep)] bg-[var(--mt-toolbar)] p-3 mb-1">
                  <div className="text-[10px] text-[var(--mt-yellow)] font-medium mb-1">💡 Cómo ganar XP más rápido</div>
                  <div className="text-[9px] text-[var(--mt-text-dim)] leading-relaxed">
                    Cada trade con <span className="text-[var(--mt-white)]">SL activo + riesgo ≤ 2% + R:R ≥ 2:1</span> avanza 3 misiones simultáneamente.
                    Pulsa <span className="text-[var(--mt-cyan)]">Evaluar progreso</span> después de cerrar trades para actualizar tu XP.
                  </div>
                </div>
              )}

              {section === 'all' ? (
                ['🟡', '🔵', '🔴', '📅'].map((emoji) => {
                  const group = displayed.filter((m) => m.mission.name[0] === emoji);
                  if (group.length === 0) return null;
                  const meta = LEVEL_TAG[emoji];
                  return (
                    <div key={emoji} className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span style={{ fontSize: 14 }}>{emoji}</span>
                        <span className="text-[10px] font-medium text-[var(--mt-text-dim)] uppercase tracking-wide">{meta.label}</span>
                        {meta.xpRequired > 0 && <span className="text-[9px] text-[var(--mt-text-dim)]">· Requiere {meta.xpRequired} XP para desbloquear nivel</span>}
                        <span className="ml-auto text-[9px] text-[var(--mt-text-dim)]">
                          {group.filter(m=>m.status==='COMPLETED').length}/{group.length} completadas
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {group.map((um) => <MissionCard key={um.id} um={um} />)}
                      </div>
                    </div>
                  );
                })
              ) : (
                displayed.map((um) => <MissionCard key={um.id} um={um} />)
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--mt-border)] px-4 py-2 bg-[var(--mt-toolbar)] flex items-center justify-between shrink-0">
          <span className="text-[9px] text-[var(--mt-text-dim)]">
            Trade con SL + R:R ≥ 2:1 avanza múltiples misiones a la vez
          </span>
          <Link href="/trade" className="text-[10px] text-[var(--mt-green)] border border-[#16a34a]/30 px-3 py-1 hover:bg-[#16a34a]/10 transition-colors">
            ⚡ Simular ahora →
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
