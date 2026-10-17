import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';
import { FREE_SIMULATIONS } from '@/lib/plans';

export const metadata: Metadata = { title: 'Términos del servicio' };

const SECTIONS = [
  {
    title: '1. Aceptación',
    body: 'Al crear una cuenta o usar GoldTrader MT («el Servicio») aceptas estos términos. Si no estás de acuerdo, no uses el Servicio.',
  },
  {
    title: '2. Naturaleza del servicio',
    body: 'GoldTrader MT es una plataforma educativa con un simulador. No es un bróker, ni un asesor de inversiones, ni presta servicios financieros. Todas las operaciones usan capital ficticio y datos históricos de mercado. No se arriesga dinero real ni se envían órdenes a ningún mercado. Los resultados en el simulador no garantizan resultados futuros.',
  },
  {
    title: '3. No es asesoramiento financiero',
    body: 'Nada de lo publicado en el Servicio (lecciones, estadísticas, retos o cualquier otro contenido) constituye asesoramiento financiero, de inversión o de trading. El contenido tiene fines exclusivamente educativos. Operar con productos apalancados conlleva un riesgo alto de perder dinero.',
  },
  {
    title: '4. Cuenta',
    body: 'Debes tener al menos 18 años. Eres responsable de la confidencialidad de tus credenciales y de que tus datos sean correctos. Una cuenta por persona. Podemos cerrar cuentas que incumplan estos términos.',
  },
  {
    title: '5. Plan gratuito y planes de pago',
    body: `El plan gratuito incluye todas las lecciones de la academia y ${FREE_SIMULATIONS} simulaciones. Los planes Pro (mensual o anual) desbloquean simulaciones ilimitadas y funciones adicionales. Las suscripciones se renuevan automáticamente hasta que las canceles desde tu cuenta; al cancelar mantienes el acceso hasta el final del periodo pagado. Los pagos los procesa Stripe.`,
  },
  {
    title: '6. Devoluciones',
    body: 'Ofrecemos una garantía de devolución de 30 días en el primer pago de cualquier plan Pro. Para solicitarla escribe a support@goldtrader.app dentro de ese plazo. La devolución se hace al método de pago original en 5–10 días hábiles.',
  },
  {
    title: '7. Datos de mercado',
    body: 'Los precios históricos del XAU/USD proceden de proveedores externos. Hacemos lo razonable para que sean correctos, pero no garantizamos que estén completos o actualizados. Se ofrecen solo para la simulación y pueden diferir de las condiciones reales del mercado.',
  },
  {
    title: '8. Usos prohibidos',
    body: 'No puedes intentar extraer nuestros datos o contenidos de forma masiva, usar scripts para generar simulaciones, compartir tu cuenta, usar el Servicio con fines ilícitos ni suplantar a otras personas.',
  },
  {
    title: '9. Propiedad intelectual',
    body: 'El contenido de la academia, el código, el diseño y las marcas de GoldTrader MT son de nuestra propiedad o los usamos con licencia. No puedes copiarlos ni distribuirlos sin permiso por escrito.',
  },
  {
    title: '10. Responsabilidad',
    body: 'En la medida máxima permitida por la ley, GoldTrader MT no responde de daños indirectos derivados del uso del Servicio, incluidas las pérdidas sufridas en mercados reales después de usar el simulador o la academia.',
  },
  {
    title: '11. Cambios',
    body: 'Podemos actualizar estos términos. Avisaremos por email de los cambios importantes con al menos 14 días de antelación. Seguir usando el Servicio después implica aceptarlos.',
  },
  {
    title: '12. Ley aplicable',
    body: 'Estos términos se rigen por la normativa de la Unión Europea y, cuando proceda, por la ley neerlandesa. Las disputas se resolverán ante los tribunales de los Países Bajos, sin perjuicio de tus derechos como consumidor.',
  },
  {
    title: '13. Contacto',
    body: 'Para cualquier consulta sobre estos términos: legal@goldtrader.app.',
  },
];

export default function TermsPage() {
  return <LegalPage title="Términos del servicio" updated="octubre de 2026" sections={SECTIONS} />;
}
