'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check, Copy, Crown, Gift, LogOut, RefreshCcw, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { invalidate, useApi } from '@/hooks/useApi';
import { logout } from '@/hooks/useAuth';
import { useBilling } from '@/store/billing.store';
import { PageHeader } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/Progress';
import { apiError, fmtLongDate, fmtUsd } from '@/lib/format';
import { PLAN_LABEL } from '@/lib/plans';
import { START_BALANCE } from '@/lib/trading';
import type { ReferralInfo, SimAccount } from '@/types';

export function Account() {
  const { data: account } = useApi<SimAccount>('/account');
  const { data: referral } = useApi<ReferralInfo>('/referral/my-code');
  const { status, openPaywall, fetchStatus } = useBilling();

  const [portalBusy, setPortalBusy] = useState(false);
  const [portalError, setPortalError] = useState('');
  const [promo, setPromo] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [promoBusy, setPromoBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const shareUrl = referral?.code && typeof window !== 'undefined' ? `${window.location.origin}/auth/register?ref=${referral.code}` : '';

  const openPortal = async () => {
    setPortalBusy(true);
    setPortalError('');
    try {
      const { data } = await api.get<{ url: string }>('/payments/portal');
      window.location.href = data.url;
    } catch (e) {
      setPortalError(apiError(e, 'No se pudo abrir el portal de pagos.'));
      setPortalBusy(false);
    }
  };

  const applyPromo = async () => {
    if (!promo.trim()) return;
    setPromoBusy(true);
    setPromoMsg(null);
    try {
      const { data } = await api.post<{ ok?: boolean; message?: string }>('/payments/apply-promo', { code: promo.trim().toUpperCase() });
      setPromoMsg({ ok: data.ok !== false, text: data.message ?? 'Código aplicado.' });
      void fetchStatus();
    } catch (e) {
      setPromoMsg({ ok: false, text: apiError(e, 'Código no válido.') });
    } finally {
      setPromoBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* el usuario puede copiarlo a mano */
    }
  };

  const resetAccount = async () => {
    setResetting(true);
    try {
      await api.post('/account/reset');
      invalidate('/account', '/stats', '/trades');
      setConfirmReset(false);
    } finally {
      setResetting(false);
    }
  };

  const used = status ? Math.min(status.simulationsUsed, status.simulationsLimit) : 0;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="Ajustes" title="Tu cuenta" />

      <div className="space-y-5">
        <section className="card card-pad">
          <h2 className="text-[16px] font-semibold text-fg">Perfil</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-[12px] text-fg-dim">Nombre</dt>
              <dd className="text-[15px] text-fg">{account?.user?.name || '—'}</dd>
            </div>
            <div>
              <dt className="text-[12px] text-fg-dim">Email</dt>
              <dd className="truncate text-[15px] text-fg">{account?.user?.email || '—'}</dd>
            </div>
          </dl>
        </section>

        <section className="card card-pad">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[16px] font-semibold text-fg">Plan</h2>
            {status && (
              <Badge tone={status.paid ? 'gold' : 'neutral'} icon={status.paid ? <Crown className="h-3.5 w-3.5" /> : undefined}>
                {PLAN_LABEL[status.plan] ?? 'Gratis'}
              </Badge>
            )}
          </div>
          {!status ? (
            <p className="mt-3 text-[14px] text-fg-dim">Cargando…</p>
          ) : status.paid ? (
            <div className="mt-3 space-y-3 text-[14px] text-fg-muted">
              <p>Tienes simulaciones ilimitadas y todas las prácticas desbloqueadas.</p>
              {status.subscriptionStatus === 'PAST_DUE' && (
                <p className="rounded-xl border border-warn/30 bg-warn/10 px-3 py-2 text-amber-200">
                  Hubo un problema con tu último pago. Actualiza tu tarjeta para no perder el acceso.
                </p>
              )}
              {status.subscriptionEndsAt && <p>Próxima renovación o fin del periodo: {fmtLongDate(status.subscriptionEndsAt)}</p>}
              {status.plan !== 'lifetime' && (
                <Button variant="secondary" size="sm" loading={portalBusy} onClick={openPortal}>
                  Gestionar suscripción y facturas
                </Button>
              )}
              {portalError && <p className="text-red-300">{portalError}</p>}
            </div>
          ) : (
            <div className="mt-3">
              <div className="flex justify-between text-[13px] text-fg-muted">
                <span>Simulaciones gratuitas usadas</span>
                <span className="num">
                  {used} / {status.simulationsLimit}
                </span>
              </div>
              <ProgressBar value={status.simulationsLimit ? used / status.simulationsLimit : 0} className="mt-2" />
              <p className="mt-3 text-[14px] text-fg-muted">Las lecciones son gratis. Pro desbloquea las simulaciones ilimitadas y la exportación del diario.</p>
              <Button className="mt-4" onClick={() => openPaywall('upgrade')} icon={<Sparkles className="h-4 w-4" />}>
                Ver planes Pro
              </Button>
            </div>
          )}
          {status?.paid && status.plan !== 'lifetime' && (
            <div className="mt-5 border-t border-ink-700 pt-4">
              <label className="label" htmlFor="promo">
                ¿Tienes un código promocional?
              </label>
              <div className="flex gap-2">
                <input id="promo" className="input uppercase" value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="CODIGO" />
                <Button variant="secondary" loading={promoBusy} onClick={applyPromo}>
                  Aplicar
                </Button>
              </div>
              {promoMsg && <p className={promoMsg.ok ? 'mt-2 text-[13px] text-green-300' : 'mt-2 text-[13px] text-red-300'}>{promoMsg.text}</p>}
            </div>
          )}
        </section>

        <section className="card card-pad">
          <h2 className="flex items-center gap-2 text-[16px] font-semibold text-fg">
            <Gift className="h-4 w-4 text-gold-400" /> Invita a un amigo
          </h2>
          <p className="mt-1 text-[14px] text-fg-muted">Por cada amigo que se registre con tu enlace sumas 5 simulaciones gratis.</p>
          {referral?.code ? (
            <>
              <div className="mt-4 flex gap-2">
                <input readOnly className="input text-[13px]" value={shareUrl} onFocus={(e) => e.currentTarget.select()} />
                <Button variant="secondary" onClick={copy} icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}>
                  {copied ? 'Copiado' : 'Copiar'}
                </Button>
              </div>
              <p className="mt-2 text-[13px] text-fg-dim">
                Código <span className="font-mono text-fg-muted">{referral.code}</span> · {referral.referredCount} amigos registrados · +{referral.bonus} simulaciones
              </p>
            </>
          ) : (
            <p className="mt-3 text-[14px] text-fg-dim">Cargando tu enlace…</p>
          )}
        </section>

        <section className="card card-pad">
          <h2 className="text-[16px] font-semibold text-fg">Cuenta demo</h2>
          <p className="mt-1 text-[14px] text-fg-muted">
            Balance actual: <span className="font-semibold text-fg num">{account ? fmtUsd(account.currentBalance) : '—'}</span>. Puedes volver a empezar con{' '}
            {fmtUsd(START_BALANCE, { decimals: 0 })} cuando quieras.
          </p>
          <Button variant="secondary" size="sm" className="mt-4" icon={<RefreshCcw className="h-4 w-4" />} onClick={() => setConfirmReset(true)}>
            Reiniciar balance
          </Button>
        </section>

        <section className="card card-pad flex flex-wrap items-center justify-between gap-3">
          <div className="text-[13px] text-fg-dim">
            <Link href="/terms" className="hover:text-fg">
              Términos
            </Link>{' '}
            ·{' '}
            <Link href="/privacy" className="hover:text-fg">
              Privacidad
            </Link>{' '}
            · ¿Ayuda? Escríbenos desde la web.
          </div>
          <Button variant="danger" size="sm" icon={<LogOut className="h-4 w-4" />} onClick={logout}>
            Cerrar sesión
          </Button>
        </section>
      </div>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="¿Reiniciar la cuenta demo?" size="sm">
        <p className="text-[14px] text-fg-muted">
          Tu balance volverá a {fmtUsd(START_BALANCE, { decimals: 0 })}. Tu historial de operaciones y tu progreso en la academia se conservan.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmReset(false)}>
            Cancelar
          </Button>
          <Button loading={resetting} onClick={resetAccount}>
            Reiniciar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
