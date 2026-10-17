import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';

export const metadata: Metadata = { title: 'Política de privacidad' };

const SECTIONS = [
  {
    title: '1. Quiénes somos',
    body: 'GoldTrader MT («nosotros») gestiona la academia y el simulador de trading de oro disponibles en este sitio web. Tratamos tus datos personales conforme al Reglamento General de Protección de Datos (RGPD) y la normativa europea aplicable.',
  },
  {
    title: '2. Qué datos recogemos',
    body: 'a) Datos de cuenta: nombre, email y contraseña cifrada (o tu identificador de Google si entras con Google). b) Datos de uso: operaciones simuladas, progreso en la academia, resultados de los tests y retos. c) Datos de pago: los procesa Stripe; nunca guardamos números de tarjeta. d) Datos técnicos: dirección IP y tipo de navegador necesarios para la seguridad del servicio.',
  },
  {
    title: '3. Para qué los usamos',
    body: 'Para prestarte el servicio (lecciones, simulador, diario y estadísticas), guardar tu progreso, enviarte comunicaciones esenciales de la cuenta (recuperar contraseña, confirmación de pago) y mejorar el producto a partir de datos agregados. No vendemos tus datos ni los usamos para publicidad.',
  },
  {
    title: '4. Base legal',
    body: 'Tratamos tus datos para ejecutar el contrato del servicio que solicitas, por interés legítimo en mantener la seguridad y mejorar la plataforma, y para cumplir obligaciones legales (por ejemplo, fiscales en el caso de los pagos).',
  },
  {
    title: '5. Conservación',
    body: 'Conservamos tus datos mientras tu cuenta esté activa. Si la eliminas, borramos tus datos personales en un plazo de 30 días, salvo los que la ley obligue a conservar (por ejemplo, los registros de pago).',
  },
  {
    title: '6. Tus derechos',
    body: 'Puedes acceder a tus datos, rectificarlos, suprimirlos, limitar u oponerte a su tratamiento y pedir su portabilidad. Para ejercerlos escribe a privacy@goldtrader.app. También puedes reclamar ante tu autoridad de protección de datos.',
  },
  {
    title: '7. Cookies y almacenamiento local',
    body: 'Usamos únicamente almacenamiento estrictamente necesario: la sesión de acceso y, en tu navegador, tu progreso de la academia y tus preferencias. No usamos cookies publicitarias ni de seguimiento de terceros.',
  },
  {
    title: '8. Proveedores',
    body: 'Usamos Stripe (pagos), Railway (servidor) y Vercel (web). Todos actúan como encargados del tratamiento con los acuerdos correspondientes. Si algún dato se transfiere fuera del Espacio Económico Europeo, se aplican garantías adecuadas como las cláusulas contractuales tipo.',
  },
  {
    title: '9. Contacto',
    body: 'Para cualquier consulta sobre privacidad: privacy@goldtrader.app.',
  },
];

export default function PrivacyPage() {
  return <LegalPage title="Política de privacidad" updated="octubre de 2026" sections={SECTIONS} />;
}
