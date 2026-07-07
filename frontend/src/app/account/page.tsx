'use client';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

interface PaymentStatus {
  plan: 'free' | 'monthly' | 'annual' | 'lifetime' | 'propfirm';
  paid: boolean;
  subscriptionStatus: string;
  subscriptionEndsAt: string | null;
  simulationsUsed: number;
  simulationsLimit: number;
  canSimulate: boolean;
}

const PLAN_META: Record<string, { label: string; color: string; bg: string; border: string; price: string; cycle: string }> = {
  free:     { label: 'Free',        color: '#6b7385', bg: '#0f1117', border: '#1d2029',     price: '€0',    cycle: '' },
  monthly:  { label: 'Pro Monthly', color: '#c9a84c', bg: '#1a1508', border: '#2c2410',     price: '€4.95', cycle: '/mes' },
  annual:   { label: 'Pro Annual',  color: '#e8c96d', bg: '#1a1508', border: '#c9a84c55',   price: '€39',   cycle: '/año' },
  propfirm: { label: 'Prop Firm',   color: '#4a6cf7', bg: '#080d14', border: '#4a6cf755',   price: '€149',  cycle: '/año' },
  lifetime: { label: 'Lifetime',    color: '#22c55e', bg: '#0a1a0e', border: '#2dcc6f44',   price: '€9.95', cycle: ' único' },
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  ACTIVE:    { label: 'Activa',          color: '#2dcc6f' },
  PAST_DUE:  { label: 'Pago pendiente',  color: '#f0b429' },
  CANCELLED: { label: 'Cancelada',       color: '#e84040' },
  FREE:      { label: 'Sin suscripción', color: '#6b7385' },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm overflow-hidden" style={{ border: '1px solid #1d2029' }}>
      <div className="px-4 py-3" style={{ background: '#0f1117', borderBottom: '1px solid #1d2029' }}>
        <span style={{ color: '#6b7385', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace' }}>
          {title}
        </span>
      </div>
      <div style={{ background: '#0b0d11' }}>{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #0f1117' }}>
      <span style={{ color: '#6b7385', fontSize: 12 }}>{label}</span>
      <div style={{ color: '#c8cdd8', fontSize: 12 }}>{children}</div>
    </div>
  );
}

function AccountInner() {
  const { accessToken } = useAuthStore();
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [promo, setPromo] = useState('');
  const [promoStatus, setPromoStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    api.get<PaymentStatus>('/payments/status')
      .then((r) => setStatus(r.data))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function openPortal() {
    setPortalLoading(true);
    try {
      const { data } = await api.get<{ url: string }>('/payments/portal');
      window.location.href = data.url;
    } catch {
      setPortalLoading(false);
    }
  }

  async function applyPromo() {
    if (!promo.trim()) return;
    setPromoLoading(true);
    setPromoStatus(null);
    try {
      const { data } = await api.post<{ ok: boolean; message: string }>('/payments/apply-promo', { code: promo.trim().toUpperCase() });
      setPromoStatus({ ok: true, msg: data.message });
      setPromo('');
    } catch (e: any) {
      setPromoStatus({ ok: false, msg: e?.response?.data?.message ?? 'Código no válido' });
    } finally {
      setPromoLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span style={{ color: '#3a3f4d', fontFamily: 'monospace', fontSize: 12 }}>Cargando cuenta…</span>
      </div>
    );
  }

  const meta = PLAN_META[status?.plan ?? 'free'];
  const statusMeta = STATUS_LABEL[status?.subscriptionStatus ?? 'FREE'] ?? STATUS_LABEL.FREE;
  const endsAt = status?.subscriptionEndsAt ? new Date(status.subscriptionEndsAt) : null;
  const isPaid = status?.paid && status.plan !== 'free';
  const isSubscription = isPaid && status?.plan !== 'lifetime';

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: '#09090d' }}>
      {/* Header */}
      <div className="px-5 py-3 border-b shrink-0" style={{ borderColor: '#1d2029', background: '#0b0d11' }}>
        <span style={{ color: '#c9a84c', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'monospace' }}>
          Mi cuenta
        </span>
        <div style={{ color: '#6b7385', fontSize: 10, marginTop: 1 }}>Gestión de suscripción y facturación</div>
      </div>

      <div className="p-5 space-y-5 max-w-2xl">

        {/* Plan actual */}
        <Section title="Plan actual">
          <Row label="Plan">
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded-sm font-mono font-bold text-xs"
                style={{ background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color }}
              >
                {meta.label}
              </span>
              {meta.price && (
                <span style={{ color: '#6b7385', fontSize: 11 }}>
                  {meta.price}<span style={{ color: '#3a3f4d' }}>{meta.cycle}</span>
                </span>
              )}
            </div>
          </Row>

          <Row label="Estado">
            <span style={{ color: statusMeta.color, fontWeight: 600 }}>{statusMeta.label}</span>
          </Row>

          {endsAt && (
            <Row label={status?.subscriptionStatus === 'CANCELLED' ? 'Acceso hasta' : 'Próxima renovación'}>
              <span style={{ color: endsAt < new Date() ? '#e84040' : '#c8cdd8' }}>
                {endsAt.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </Row>
          )}

          <Row label="Simulaciones">
            <div className="flex items-center gap-2">
              <span style={{ color: isPaid ? '#2dcc6f' : '#c8cdd8', fontFamily: 'monospace', fontWeight: 700 }}>
                {isPaid ? '∞ ilimitadas' : `${status?.simulationsUsed ?? 0} / ${status?.simulationsLimit ?? 20}`}
              </span>
              {!isPaid && (
                <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: '#1d2029' }}>
                  <div style={{
                    width: `${Math.min(100, ((status?.simulationsUsed ?? 0) / (status?.simulationsLimit ?? 20)) * 100)}%`,
                    height: '100%',
                    background: '#c9a84c',
                    borderRadius: 9999,
                  }} />
                </div>
              )}
            </div>
          </Row>

          {/* Upgrade CTA for free users */}
          {!isPaid && (
            <div className="px-4 py-3">
              <a
                href="/#pricing"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #a8893c)', color: '#000', textDecoration: 'none' }}
              >
                ◆ Mejorar plan
              </a>
            </div>
          )}
        </Section>

        {/* Facturación — solo usuarios con suscripción */}
        {isSubscription && (
          <Section title="Facturación y pago">
            <div className="px-4 py-4 space-y-3">
              <p style={{ color: '#8893a8', fontSize: 12, lineHeight: 1.6 }}>
                Desde el portal de Stripe puedes cambiar tu método de pago, descargar facturas pasadas, actualizar tu dirección de facturación o cancelar tu suscripción.
              </p>
              <button
                onClick={openPortal}
                disabled={portalLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold transition-opacity hover:opacity-80"
                style={{
                  background: '#141720',
                  color: '#c9a84c',
                  border: '1px solid #2c2410',
                  cursor: portalLoading ? 'not-allowed' : 'pointer',
                  opacity: portalLoading ? 0.5 : 1,
                }}
              >
                {portalLoading ? '↗ Abriendo portal…' : '↗ Abrir portal de facturación'}
              </button>

              <div className="pt-2" style={{ borderTop: '1px solid #1d2029' }}>
                <p style={{ color: '#3a3f4d', fontSize: 10, lineHeight: 1.5 }}>
                  También puedes cancelar desde el portal. Si cancelas, mantienes el acceso hasta el fin del período pagado.
                </p>
              </div>
            </div>
          </Section>
        )}

        {/* Código promocional — solo usuarios con suscripción activa */}
        {isSubscription && status?.subscriptionStatus === 'ACTIVE' && (
          <Section title="Código promocional">
            <div className="px-4 py-4 space-y-3">
              <p style={{ color: '#8893a8', fontSize: 12, lineHeight: 1.6 }}>
                Si tienes un código de descuento, aplícalo aquí. El descuento se aplicará a tu próxima factura.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                  placeholder="GT-DESCUENTO"
                  className="flex-1 px-3 py-2 rounded-sm text-xs font-mono"
                  style={{
                    background: '#0f1117',
                    border: '1px solid #1d2029',
                    color: '#e8ecf4',
                    outline: 'none',
                    letterSpacing: 1,
                  }}
                />
                <button
                  onClick={applyPromo}
                  disabled={promoLoading || !promo.trim()}
                  className="px-4 py-2 rounded-sm text-xs font-bold transition-opacity"
                  style={{
                    background: '#1a1508',
                    color: '#c9a84c',
                    border: '1px solid #2c2410',
                    cursor: promoLoading || !promo.trim() ? 'not-allowed' : 'pointer',
                    opacity: promoLoading || !promo.trim() ? 0.5 : 1,
                  }}
                >
                  {promoLoading ? '…' : 'Aplicar'}
                </button>
              </div>

              {promoStatus && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-sm text-xs"
                  style={{
                    background: promoStatus.ok ? '#0a1a0e' : '#1a0808',
                    border: `1px solid ${promoStatus.ok ? '#2dcc6f33' : '#e8404033'}`,
                    color: promoStatus.ok ? '#2dcc6f' : '#e84040',
                  }}
                >
                  <span>{promoStatus.ok ? '✓' : '✗'}</span>
                  {promoStatus.msg}
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Cancelar — botón rápido visible con aviso claro */}
        {isSubscription && status?.subscriptionStatus === 'ACTIVE' && (
          <Section title="Cancelar suscripción">
            <div className="px-4 py-4 space-y-3">
              <p style={{ color: '#8893a8', fontSize: 12, lineHeight: 1.6 }}>
                Puedes cancelar en cualquier momento. Seguirás teniendo acceso hasta el final del período ya pagado. No se realizan reembolsos parciales.
              </p>
              <button
                onClick={openPortal}
                disabled={portalLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-medium transition-colors"
                style={{
                  background: 'transparent',
                  color: '#e84040',
                  border: '1px solid #e8404033',
                  cursor: portalLoading ? 'not-allowed' : 'pointer',
                }}
              >
                Cancelar suscripción →
              </button>
            </div>
          </Section>
        )}

        {/* Free users - upsell */}
        {!isPaid && (
          <Section title="Desbloquear acceso completo">
            <div className="px-4 py-4 space-y-3">
              {[
                { plan: 'Pro Monthly', price: '€4.95/mes', features: 'Simulaciones ilimitadas, Trading Journal, Analytics' },
                { plan: 'Pro Annual',  price: '€39/año',   features: 'Todo lo de Pro · ahorra €20 al año' },
                { plan: 'Prop Firm',   price: '€149/año',  features: 'Challenge metrics, CSV export, badge verificado' },
              ].map(({ plan, price, features }) => (
                <div key={plan} className="flex items-center justify-between p-3 rounded-sm" style={{ background: '#0f1117', border: '1px solid #1d2029' }}>
                  <div>
                    <div style={{ color: '#c8cdd8', fontSize: 12, fontWeight: 600 }}>{plan}</div>
                    <div style={{ color: '#6b7385', fontSize: 10, marginTop: 2 }}>{features}</div>
                  </div>
                  <div className="text-right">
                    <div style={{ color: '#c9a84c', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>{price}</div>
                    <a href="/#pricing" style={{ color: '#6b7385', fontSize: 10, textDecoration: 'none' }}>Ver →</a>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <AppShell>
      <AccountInner />
    </AppShell>
  );
}
