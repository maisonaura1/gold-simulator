import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

const FROM = 'GoldTrader <hello@goldtrader.app>';

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);
  private resend: Resend | null;

  constructor() {
    const key = process.env.RESEND_API_KEY;
    this.resend = key ? new Resend(key) : null;
    if (!key) this.logger.warn('RESEND_API_KEY not set — emails disabled');
  }

  private async send(to: string, subject: string, html: string) {
    if (!this.resend) return;
    try {
      await this.resend.emails.send({ from: FROM, to, subject, html });
    } catch (e: any) {
      this.logger.error(`Email send failed to ${to}: ${e.message}`);
    }
  }

  async sendInactivityReminder(email: string, daysSinceLastTrade: number, traderScore: number | null) {
    const scoreText = traderScore
      ? `Tu Trader Score actual es <strong style="color:#c9a84c">${traderScore}</strong>. `
      : '';

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#09090d;color:#c8cdd8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:0">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:48px 16px">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#0b0d11;border:1px solid #1d2029;border-radius:4px;overflow:hidden">
        <!-- Gold bar -->
        <tr><td style="height:3px;background:linear-gradient(90deg,#c9a84c,#4a3810)"></td></tr>
        <!-- Header -->
        <tr><td style="padding:32px 32px 0">
          <p style="color:#c9a84c;font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px">◆ GoldTrader</p>
          <h1 style="color:#e8ecf4;font-size:22px;font-weight:800;margin:0 0 8px;line-height:1.3">
            Han pasado ${daysSinceLastTrade} días sin simular.
          </h1>
          <p style="color:#8893a8;font-size:14px;line-height:1.7;margin:0 0 24px">
            ${scoreText}El mercado del oro no espera — y tampoco tu progreso. Los traders que practican a diario mejoran su score un 73% más rápido que los que simulan de forma esporádica.
          </p>
        </td></tr>
        <!-- Metric highlight -->
        <tr><td style="padding:0 32px">
          <div style="background:#0f1117;border:1px solid #1d2029;border-radius:4px;padding:20px;text-align:center">
            <p style="color:#6b7385;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:monospace;margin:0 0 8px">Tu próxima misión te espera</p>
            <p style="color:#c9a84c;font-size:13px;font-weight:600;margin:0">🎯 Completa 1 simulación hoy · Recupera tu racha</p>
          </div>
        </td></tr>
        <!-- CTA -->
        <tr><td style="padding:28px 32px">
          <a href="https://goldtrader.app/trade"
            style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#a8893c);color:#000;font-weight:800;font-size:13px;padding:12px 28px;border-radius:4px;text-decoration:none">
            Simular ahora →
          </a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:0 32px 32px">
          <p style="color:#3a3f4d;font-size:11px;line-height:1.6;margin:0">
            Recibes este email porque tienes una cuenta en GoldTrader.
            <a href="https://goldtrader.app/account" style="color:#3a3f4d">Gestionar preferencias</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await this.send(email, `Han pasado ${daysSinceLastTrade} días — el mercado sigue abierto`, html);
  }

  async sendPreRenewalReminder(email: string, renewalDate: Date, plan: string, price: string) {
    const days = Math.round((renewalDate.getTime() - Date.now()) / 86400000);
    const dateStr = renewalDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#09090d;color:#c8cdd8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:0">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:48px 16px">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#0b0d11;border:1px solid #1d2029;border-radius:4px;overflow:hidden">
        <tr><td style="height:3px;background:linear-gradient(90deg,#c9a84c,#4a3810)"></td></tr>
        <tr><td style="padding:32px 32px 0">
          <p style="color:#c9a84c;font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px">◆ GoldTrader · Facturación</p>
          <h1 style="color:#e8ecf4;font-size:22px;font-weight:800;margin:0 0 8px;line-height:1.3">
            Tu plan se renueva en ${days} días.
          </h1>
          <p style="color:#8893a8;font-size:14px;line-height:1.7;margin:0 0 24px">
            Tu suscripción <strong style="color:#c9a84c">${plan}</strong> se renovará automáticamente el <strong>${dateStr}</strong> por <strong>${price}</strong>. No tienes que hacer nada.
          </p>
        </td></tr>
        <tr><td style="padding:0 32px">
          <div style="background:#0f1117;border:1px solid #1d2029;border-radius:4px;padding:20px">
            <p style="color:#6b7385;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:monospace;margin:0 0 12px">¿Quieres gestionar tu suscripción?</p>
            <ul style="color:#8893a8;font-size:13px;line-height:1.8;margin:0;padding-left:20px">
              <li>Cambiar método de pago</li>
              <li>Descargar facturas anteriores</li>
              <li>Cancelar la renovación automática</li>
            </ul>
          </div>
        </td></tr>
        <tr><td style="padding:28px 32px">
          <a href="https://goldtrader.app/account"
            style="display:inline-block;background:#141720;color:#c9a84c;font-weight:700;font-size:13px;padding:12px 28px;border-radius:4px;text-decoration:none;border:1px solid #2c2410">
            Gestionar suscripción →
          </a>
        </td></tr>
        <tr><td style="padding:0 32px 32px">
          <p style="color:#3a3f4d;font-size:11px;line-height:1.6;margin:0">
            Si no haces nada, tu suscripción continuará activa. Si cancelas antes del ${dateStr}, no se te cobrará nada más.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await this.send(email, `Tu suscripción GoldTrader se renueva el ${dateStr}`, html);
  }

  async sendPasswordReset(email: string, resetUrl: string) {
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#09090d;color:#c8cdd8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:0">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:48px 16px">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#0b0d11;border:1px solid #1d2029;border-radius:4px;overflow:hidden">
        <tr><td style="height:3px;background:linear-gradient(90deg,#c9a84c,#4a3810)"></td></tr>
        <tr><td style="padding:32px 32px 24px">
          <p style="color:#c9a84c;font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px">◆ GoldTrader · Seguridad</p>
          <h1 style="color:#e8ecf4;font-size:22px;font-weight:800;margin:0 0 12px;line-height:1.3">
            Restablecer contraseña
          </h1>
          <p style="color:#8893a8;font-size:14px;line-height:1.7;margin:0 0 24px">
            Has solicitado restablecer tu contraseña. El enlace es válido durante <strong style="color:#c9a84c">1 hora</strong>. Si no lo solicitaste tú, puedes ignorar este email.
          </p>
          <a href="${resetUrl}"
            style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#a8893c);color:#000;font-weight:800;font-size:13px;padding:12px 28px;border-radius:4px;text-decoration:none">
            Restablecer contraseña →
          </a>
          <p style="color:#3a3f4d;font-size:11px;margin-top:20px;word-break:break-all">
            O copia este enlace: <span style="color:#6b7385">${resetUrl}</span>
          </p>
        </td></tr>
        <tr><td style="padding:0 32px 32px">
          <p style="color:#3a3f4d;font-size:11px;line-height:1.6;margin:0">
            Si no solicitaste este cambio, tu contraseña sigue siendo la misma. Nada cambiará si ignoras este email.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
    await this.send(email, 'Restablece tu contraseña — GoldTrader', html);
  }

  async sendWelcome(email: string) {
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#09090d;color:#c8cdd8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:0">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:48px 16px">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#0b0d11;border:1px solid #1d2029;border-radius:4px;overflow:hidden">
        <tr><td style="height:3px;background:linear-gradient(90deg,#c9a84c,#4a3810)"></td></tr>
        <tr><td style="padding:32px 32px 24px">
          <p style="color:#c9a84c;font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px">◆ Bienvenido a GoldTrader</p>
          <h1 style="color:#e8ecf4;font-size:22px;font-weight:800;margin:0 0 12px;line-height:1.3">
            Tu mesa de operaciones está lista.
          </h1>
          <p style="color:#8893a8;font-size:14px;line-height:1.7;margin:0 0 24px">
            Tienes <strong style="color:#c9a84c">20 simulaciones gratuitas</strong> sobre datos reales de XAUUSD. Úsalas para descubrir tu estilo de trading antes de arriesgar capital real.
          </p>
          <div style="background:#0f1117;border:1px solid #1d2029;border-radius:4px;padding:20px;margin-bottom:24px">
            <p style="color:#6b7385;font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:monospace;margin:0 0 12px">Por dónde empezar</p>
            ${[
              ['01', 'Completa tu primera simulación', '/trade'],
              ['02', 'Revisa tu Trader Score inicial', '/stats'],
              ['03', 'Activa tu primera misión', '/learn'],
            ].map(([n, text, href]) => `
            <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px">
              <span style="color:#c9a84c;font-family:monospace;font-weight:700;font-size:11px;flex-shrink:0;margin-top:1px">${n}</span>
              <a href="https://goldtrader.app${href}" style="color:#c8cdd8;font-size:13px;text-decoration:none">${text}</a>
            </div>`).join('')}
          </div>
          <a href="https://goldtrader.app/trade"
            style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#a8893c);color:#000;font-weight:800;font-size:13px;padding:12px 28px;border-radius:4px;text-decoration:none">
            Empezar a simular →
          </a>
        </td></tr>
        <tr><td style="padding:0 32px 32px">
          <p style="color:#3a3f4d;font-size:11px;line-height:1.6;margin:0">
            GoldTrader · goldtrader.app ·
            <a href="https://goldtrader.app/account" style="color:#3a3f4d">Gestionar cuenta</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await this.send(email, 'Tu mesa de operaciones está lista — GoldTrader', html);
  }
}
