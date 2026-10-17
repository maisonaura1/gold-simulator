'use client';
import Link from 'next/link';
import clsx from 'clsx';
import { ArrowRight, BookOpen, CandlestickChart, CheckCircle2, Flag, Lightbulb, PlayCircle, Target, Trophy } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useProgress } from '@/store/progress.store';
import { useBilling } from '@/store/billing.store';
import { currentLesson, levelProgress, overallProgress } from '@/lib/catalog';
import { useCatalog } from '@/components/academy/CatalogProvider';
import { fmtDateTime, fmtPct, fmtPrice, fmtUsd } from '@/lib/format';
import { firstName, isPositiveFinding, stripLeadingSymbols } from '@/lib/text';
import { ButtonLink } from '@/components/ui/Button';
import { ProgressBar, ProgressRing } from '@/components/ui/Progress';
import { Stat } from '@/components/ui/Stat';
import { Empty } from '@/components/ui/Empty';
import type { SimAccount, Stats, Trade, UserMission } from '@/types';

function greeting() {
  const h = new Date().getHours();
  return h < 13 ? 'Buenos días' : h < 21 ? 'Buenas tardes' : 'Buenas noches';
}

export function Dashboard() {
  const { data: account } = useApi<SimAccount>('/account');
  const { data: stats } = useApi<Stats>('/stats');
  const { data: missions } = useApi<UserMission[]>('/missions');
  const { data: trades } = useApi<Trade[]>('/trades');
  const lessons = useProgress((s) => s.lessons);
  const status = useBilling((s) => s.status);

  const catalog = useCatalog();
  const LEVELS = catalog.levels;
  const overall = overallProgress(catalog, lessons);
  const next = currentLesson(catalog, lessons);
  const name = firstName(account?.user?.name);
  const pnl = account ? account.currentBalance - account.initialBalance : 0;

  const activeMissions = (missions ?? [])
    .filter((m) => m.status === 'ACTIVE')
    .sort((a, b) => Number(b.mission.isDaily) - Number(a.mission.isDaily) || b.currentProgress / b.targetProgress - a.currentProgress / a.targetProgress)
    .slice(0, 4);
  const completedMissions = (missions ?? []).filter((m) => m.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[14px] text-fg-dim">{greeting()}{name ? `, ${name}` : ''}</div>
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-fg sm:text-[30px]">Tu plan de hoy: aprender, practicar y revisar</h1>
      </div>

      {/* Paso 1 y 2 */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="card card-pad lg:col-span-3">
          <div className="flex items-center gap-2 text-gold-300">
            <BookOpen className="h-4 w-4" />
            <span className="eyebrow">1 · Aprende</span>
          </div>
          <div className="mt-4 flex items-center gap-5">
            <ProgressRing value={overall.pct} size={76} />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-fg-dim">
                {overall.done === 0 ? 'Tu primera lección' : overall.done === overall.total ? 'Academia completada' : 'Siguiente lección'}
              </div>
              <div className="mt-0.5 text-[18px] font-semibold leading-snug text-fg">{next.title}</div>
              <div className="mt-0.5 text-[13px] text-fg-muted">
                Etapa {next.level.number} · {next.level.title} · {next.minutes} min
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ButtonLink href={`/academy/${next.id}`} icon={<PlayCircle className="h-4 w-4" />}>
              {overall.done === 0 ? 'Empezar' : 'Continuar'}
            </ButtonLink>
            <Link href="/academy" className="text-[14px] text-fg-muted hover:text-fg">
              Ver temario completo
            </Link>
          </div>
        </div>

        <div className="card card-pad lg:col-span-2">
          <div className="flex items-center gap-2 text-gold-300">
            <CandlestickChart className="h-4 w-4" />
            <span className="eyebrow">2 · Practica</span>
          </div>
          <div className="mt-4">
            <div className="text-[13px] text-fg-dim">Balance de tu cuenta demo</div>
            <div className="text-[30px] font-semibold num tracking-tight text-fg">{account ? fmtUsd(account.currentBalance) : '—'}</div>
            <div className={clsx('text-[13px] num', pnl > 0 ? 'text-green-400' : pnl < 0 ? 'text-red-400' : 'text-fg-dim')}>
              {account ? `${fmtUsd(pnl, { sign: true })} (${fmtPct(account.totalPnlPct, { sign: true, decimals: 2 })}) desde el inicio` : ' '}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ButtonLink href="/trade" variant="secondary" icon={<CandlestickChart className="h-4 w-4" />}>
              Abrir simulador
            </ButtonLink>
            {status && !status.paid && (
              <span className="text-[13px] text-fg-dim">
                {Math.max(0, status.simulationsLimit - status.simulationsUsed)} simulaciones gratis
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Paso 3: revisar */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gold-300">
            <Flag className="h-4 w-4" />
            <span className="eyebrow">3 · Revisa</span>
          </div>
          <Link href="/journal" className="inline-flex items-center gap-1 text-[13px] text-fg-muted hover:text-fg">
            Diario completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Operaciones" value={stats?.totalTrades ?? 0} sub={stats ? `${stats.wins} ganadas · ${stats.losses} perdidas` : undefined} />
          <Stat label="% de acierto" value={stats?.totalTrades ? fmtPct(stats.winRate) : '—'} />
          <Stat label="R:R medio" value={stats?.totalTrades ? `1:${stats.avgRR.toFixed(1)}` : '—'} tone={stats && stats.avgRR >= 2 ? 'gold' : undefined} />
          <Stat
            label="Riesgo medio"
            value={stats?.totalTrades ? fmtPct(stats.avgRisk, { decimals: 2 }) : '—'}
            tone={stats && stats.totalTrades > 0 ? (stats.avgRisk > 2 ? 'down' : 'up') : undefined}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Retos */}
        <div className="card card-pad">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[16px] font-semibold text-fg">
              <Trophy className="h-4 w-4 text-gold-400" /> Retos
            </h2>
            <span className="text-[12px] text-fg-dim">{completedMissions} completados</span>
          </div>
          {activeMissions.length === 0 ? (
            <p className="mt-4 text-[14px] text-fg-dim">Haz tu primera simulación para activar los retos.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {activeMissions.map((m) => {
                const pct = m.targetProgress ? m.currentProgress / m.targetProgress : 0;
                return (
                  <li key={m.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="text-[14px] font-medium text-fg">
                        {stripLeadingSymbols(m.mission.name)}
                        {m.mission.isDaily && <span className="ml-2 rounded bg-info/15 px-1.5 py-0.5 text-[11px] text-blue-300">Hoy</span>}
                      </div>
                      <span className="shrink-0 text-[12px] num text-fg-dim">
                        {Math.min(m.currentProgress, m.targetProgress)}/{m.targetProgress} · +{m.mission.xpReward} XP
                      </span>
                    </div>
                    <p className="mt-0.5 text-[13px] text-fg-dim">{m.mission.description}</p>
                    <ProgressBar value={pct} className="mt-2" />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Consejos */}
        <div className="card card-pad">
          <h2 className="flex items-center gap-2 text-[16px] font-semibold text-fg">
            <Lightbulb className="h-4 w-4 text-gold-400" /> Tu entrenador
          </h2>
          {!stats || stats.totalTrades === 0 ? (
            <p className="mt-4 text-[14px] text-fg-dim">
              Cuando tengas operaciones, aquí verás qué estás haciendo bien y qué conviene corregir.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {stats.behaviours.map((b) => (
                <li key={b} className="flex gap-2.5 text-[14px] text-fg-muted">
                  {isPositiveFinding(b) ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" /> : <Target className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />}
                  {stripLeadingSymbols(b)}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 border-t border-ink-700 pt-4">
            <div className="text-[12px] font-medium uppercase tracking-wide text-fg-dim">Etapas de la academia</div>
            <ul className="mt-3 space-y-2.5">
              {LEVELS.map((l) => {
                const p = levelProgress(l, lessons);
                return (
                  <li key={l.id} className="flex items-center gap-3 text-[13px]">
                    <span className="w-5 text-fg-dim num">{l.number}</span>
                    <span className="w-40 truncate text-fg-muted sm:w-48">{l.title}</span>
                    <ProgressBar value={p.pct} className="flex-1" />
                    <span className="w-10 text-right text-fg-dim num">
                      {p.done}/{p.total}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Últimas operaciones */}
      <div className="card">
        <div className="flex items-center justify-between px-5 pt-5 sm:px-6">
          <h2 className="text-[16px] font-semibold text-fg">Últimas operaciones</h2>
          <Link href="/journal" className="text-[13px] text-gold-300 hover:underline">
            Ver todas
          </Link>
        </div>
        {!trades || trades.length === 0 ? (
          <Empty
            icon={<CandlestickChart className="h-6 w-6" />}
            title="Aún no has simulado ninguna operación"
            text="Lee la lección «Tu primera operación en el simulador» y haz la práctica."
            action={<ButtonLink href="/academy/n1-primera-operacion" size="sm">Ir a la lección</ButtonLink>}
          />
        ) : (
          <ul className="mt-3 divide-y divide-ink-750">
            {trades.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-5 py-3 sm:px-6">
                <span className={clsx('w-16 shrink-0 text-[13px] font-semibold', t.type === 'BUY' ? 'text-green-300' : 'text-red-300')}>
                  {t.type === 'BUY' ? 'Compra' : 'Venta'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] text-fg-muted">{t.notes || 'Sin motivo anotado'}</div>
                  <div className="text-[12px] text-fg-dim num">
                    {fmtDateTime(t.entryAt)} · {t.lot.toFixed(2)} lotes a {fmtPrice(t.entryPrice)}
                  </div>
                </div>
                <span className={clsx('shrink-0 text-[14px] font-semibold num', (t.resultUsd ?? 0) >= 0 ? 'text-green-400' : 'text-red-400')}>
                  {fmtUsd(t.resultUsd, { sign: true })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
