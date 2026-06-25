'use client';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { api } from '@/lib/api';
import type { UserMission } from '@/types';
import { useT } from '@/hooks/useT';
import clsx from 'clsx';

export default function LearnPage() {
  const [missions, setMissions] = useState<UserMission[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useT();

  const fetchMissions = async () => {
    const { data } = await api.get<UserMission[]>('/missions');
    setMissions(data);
    setLoading(false);
  };

  const evaluate = async () => {
    const { data } = await api.post<UserMission[]>('/missions/evaluate');
    setMissions(data);
  };

  useEffect(() => { fetchMissions(); }, []);

  const active    = missions.filter((m) => m.status === 'ACTIVE');
  const completed = missions.filter((m) => m.status === 'COMPLETED');

  return (
    <AppShell>
      <div className="flex flex-col h-full overflow-auto">
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--mt-toolbar)] border-b border-[var(--mt-border)] shrink-0" style={{ fontSize: 11 }}>
          <span className="text-[var(--mt-text-label)] font-medium uppercase tracking-wide">{t.trainingMissions}</span>
          <button onClick={evaluate} className="mt-btn text-[10px] border border-[var(--mt-sep)]">
            {t.evaluateProgress}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-[var(--mt-text-dim)]" style={{ fontSize: 11 }}>{t.loading}</div>
        ) : (
          <div className="p-4 space-y-4">
            <div>
              <div className="text-[10px] text-[var(--mt-text-dim)] uppercase tracking-wide font-medium mb-2">
                {t.active(active.length)}
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
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[var(--mt-toolbar)] border border-[var(--mt-border)] rounded-none overflow-hidden">
                          <div className="h-full bg-[var(--mt-blue)] transition-all duration-500" style={{ width: `${pct}%` }} />
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
                  <div className="text-[var(--mt-text-dim)] text-[11px]">{t.noActiveMissions}</div>
                )}
              </div>
            </div>

            {completed.length > 0 && (
              <div>
                <div className="text-[10px] text-[var(--mt-text-dim)] uppercase tracking-wide font-medium mb-2">
                  {t.completed(completed.length)}
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

            <div className="bg-[var(--mt-bg)] border border-[var(--mt-border)] p-4">
              <div className="text-[11px] text-[var(--mt-text-label)] font-medium uppercase tracking-wide mb-3">
                {t.keyConceptsTitle}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {t.concepts.map((item) => (
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
