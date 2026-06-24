'use client';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { api } from '@/lib/api';
import type { UserMission } from '@/types';
import clsx from 'clsx';

export default function LearnPage() {
  const [missions, setMissions] = useState<UserMission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await api.get<UserMission[]>('/missions');
    setMissions(data);
    setLoading(false);
  };

  const evaluate = async () => {
    const { data } = await api.post<UserMission[]>('/missions/evaluate');
    setMissions(data);
  };

  useEffect(() => { fetch(); }, []);

  const active    = missions.filter((m) => m.status === 'ACTIVE');
  const completed = missions.filter((m) => m.status === 'COMPLETED');

  return (
    <AppShell>
      <div className="flex flex-col h-full overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] shrink-0" style={{ fontSize: 11 }}>
          <span className="text-[var(--mt-text-label)] font-medium uppercase tracking-wide">Misiones de formación</span>
          <button onClick={evaluate} className="mt-btn text-[10px] border border-[var(--mt-sep)]">
            🔄 Evaluar progreso
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-[var(--mt-text-dim)]" style={{ fontSize: 11 }}>Cargando...</div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Active missions */}
            <div>
              <div className="text-[10px] text-[var(--mt-text-dim)] uppercase tracking-wide font-medium mb-2">
                Activas ({active.length})
              </div>
              <div className="space-y-2">
                {active.map((um) => {
                  const pct = Math.min(100, (um.currentProgress / um.targetProgress) * 100);
                  return (
                    <div key={um.id} className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-[var(--mt-white)]" style={{ fontSize: 12 }}>
                            🎯 {um.mission.name}
                          </div>
                          <div className="text-[var(--mt-text-dim)] mt-0.5" style={{ fontSize: 10 }}>
                            {um.mission.description}
                          </div>
                        </div>
                        <span className="text-[var(--mt-yellow)] font-mono text-[10px] border border-yellow-500/20 px-2 py-0.5 bg-yellow-500/5">
                          +{um.mission.xpReward} XP
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[var(--mt-toolbar)] border border-[var(--mt-border)] rounded-none overflow-hidden">
                          <div
                            className="h-full bg-[var(--mt-blue)] transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-[var(--mt-text-dim)] w-20 text-right">
                          {um.currentProgress.toFixed(0)} / {um.targetProgress.toFixed(0)}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--mt-cyan)] w-10 text-right">
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
                {active.length === 0 && (
                  <div className="text-[var(--mt-text-dim)] text-[11px]">No hay misiones activas pendientes.</div>
                )}
              </div>
            </div>

            {/* Completed missions */}
            {completed.length > 0 && (
              <div>
                <div className="text-[10px] text-[var(--mt-text-dim)] uppercase tracking-wide font-medium mb-2">
                  Completadas ({completed.length})
                </div>
                <div className="space-y-1">
                  {completed.map((um) => (
                    <div key={um.id} className="flex items-center gap-3 bg-[var(--mt-bg)] border border-[var(--mt-border)] p-2.5 opacity-70">
                      <span className="text-[var(--mt-green)]">✅</span>
                      <div className="flex-1">
                        <span className="text-[var(--mt-text)]" style={{ fontSize: 11 }}>{um.mission.name}</span>
                      </div>
                      <span className="text-[var(--mt-green)] font-mono text-[10px]">+{um.mission.xpReward} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Educational content */}
            <div className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-4">
              <div className="text-[11px] text-[var(--mt-text-label)] font-medium uppercase tracking-wide mb-3">
                📚 Conceptos clave de trading de oro
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: 'Gestión de riesgo', body: 'Nunca arriesgues más del 1-2% de tu capital por operación. Si tienes $10,000, tu máxima pérdida por trade debe ser $100-$200.' },
                  { title: 'Relación R/R', body: 'Busca siempre una relación riesgo/beneficio de al menos 2:1. Por cada $1 que arriesgas, debes poder ganar $2.' },
                  { title: 'Stop Loss', body: 'Es tu seguro. Colócalo en un nivel técnico relevante (soporte/resistencia), no a un precio arbitrario.' },
                  { title: 'Oro (XAUUSD)', body: 'El oro se mueve con la inflación, el dólar y el riesgo global. 1 lote = 100 oz. Pip value ≈ $10 por pip.' },
                ].map((item) => (
                  <div key={item.title} className="border border-[var(--mt-border)] p-2.5">
                    <div className="font-medium text-[var(--mt-cyan)] mb-1" style={{ fontSize: 11 }}>{item.title}</div>
                    <div className="text-[var(--mt-text-dim)] leading-relaxed" style={{ fontSize: 10 }}>{item.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
