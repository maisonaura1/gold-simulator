# RoxanneAlexia Language Coach — web + panel de administración

Web de **Roxanne** (profesora de inglés jurídico y de negocios) construida con
**Next.js 16.3**, React 19, Tailwind CSS v4, `motion` y three.js
(`@react-three/fiber` + `drei`). Textos tomados del Excel del cliente
(“Website”, pestañas 1–8) y editables desde el panel.

- Diseño inspirado en la plantilla Squarespace **Bloom (fluid)**: marfil cálido,
  terracota, azul tinta, detalles de latón, marcos de foto en arco,
  tipografía Cormorant Garamond + Manrope (autoalojadas).
- Contacto: WhatsApp **+1 (586) 850-5625** · **lawbusinessenglishspeechcoach@gmail.com**

---

## Qué incluye

| Área | Detalle |
| --- | --- |
| **Páginas indexables** | `/` · `/about` · `/courses` · `/courses/business-english` · `/courses/legal-english` (incluye el track *Litigation English*) · `/courses/beginner-english` · `/courses/speech-presentation-coaching` · `/freelance` · `/contact` · `/privacy` · 404 propia |
| **Popups** | “Book a Free Consultation” (Calendly / WhatsApp / mensaje) · “Package options” por curso · menú desplegable de cursos · menú móvil |
| **WhatsApp** | Botón flotante con mensaje predefinido + enlaces en cabecera móvil, contacto y pie |
| **Calendly** | Popup y calendario en `/contact`. Se carga **solo al hacer clic** (sin cookies de terceros antes; no hace falta banner de cookies) |
| **Formulario** | Validación, honeypot anti‑spam, límite por IP, consentimiento RGPD, aviso opcional por email (Resend). Los mensajes llegan al panel |
| **Panel `/admin`** | Mensajes, reuniones de Calendly, textos de todas las páginas, testimonios, fotos, ajustes, cambio de contraseña, copia de seguridad |
| **3D y animación** | Escena 3D en el hero (balanza de la justicia en latón + forma fluida “bloom”), motivos 3D por página, tarjetas con inclinación 3D, apariciones al hacer scroll, marquee. Respeta `prefers-reduced-motion` |
| **SEO** | Títulos y descripciones del Excel por página, canonical, Open Graph + imagen social generada, `sitemap.xml`, `robots.txt`, JSON‑LD (ProfessionalService, Person, Course, FAQPage, BreadcrumbList) |
| **Seguridad** | Auditada (sin hallazgos críticos; todos los altos/medios corregidos): CSP y cabeceras, cookie `__Host-` firmada (HMAC), verificación de sesión en cada acción, bloqueo de login y límites del formulario guardados en el almacén (válidos entre instancias), IP de cliente solo desde proxies de confianza, escrituras atómicas, bandeja que nunca borra mensajes sin leer, scrypt reforzado, descarga de imágenes protegida contra SSRF |

---

## Arranque local

```bash
cd roxanne-web
cp .env.example .env.local      # rellena ADMIN_PASSWORD y SESSION_SECRET
npm install
npm run dev                     # http://localhost:3000 — panel en /admin
```

Comprobaciones: `npm run typecheck && npm run lint && npm run build`

## Despliegue

### Opción A — Vercel (recomendada)
1. Importa el repositorio en Vercel y pon **Root Directory = `roxanne-web`**.
2. **Storage → Upstash Redis** (Marketplace) y conéctalo al proyecto. Es
   imprescindible: el disco de Vercel es de solo lectura y sin Redis el panel no
   puede guardar cambios (el panel muestra un aviso si falta).
3. Variables de entorno: `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`
   (**mínimo 12 caracteres**; si es más corta el login queda desactivado a propósito),
   `SESSION_SECRET` (32+ caracteres) y, opcionales, `CALENDLY_TOKEN`,
   `RESEND_API_KEY`, `RESEND_FROM`.
4. Añade el dominio.

### Opción B — Servidor Node (Railway, Render, VPS, Docker)
`npm ci && npm run build && npm start`, con un **volumen persistente** en
`./data` (o la ruta de `DATA_DIR`). Ahí se guardan ediciones, mensajes y fotos.
Sírvelo **detrás de un proxy inverso** (nginx, el de Railway/Render…) y ajusta
`TRUSTED_PROXY_HOPS` (normalmente `1`): los límites anti‑abuso usan la IP que
añade tu proxy, nunca la que declara el visitante.

## Fotos
Las 7 fotos por defecto son bodegones generados con IA (Higgsfield · Z‑Image),
**sin personas**, para que nada se confunda con Roxanne o sus clientes. Están en
el CDN de Higgsfield; para alojarlas dentro del proyecto ejecuta, con internet:

```bash
npm run photos:localize   # descarga a public/images y actualiza src/content/photos.local.json
```

y haz commit de ambos. Roxanne puede cambiar cualquier foto desde **Panel → Photos**
(la más importante: su **retrato** en About).

## Calendly
- **Panel → Settings → Calendly booking link**: pega el enlace del evento
  (p. ej. `https://calendly.com/usuario/consulta-gratuita`). Al guardarlo aparece
  “Pick a time in my calendar” en el popup y el calendario en `/contact`.
- Para ver las próximas reuniones en el panel: Calendly → *Integrations & apps* →
  *API and webhooks* → **Personal access token**, y pégalo en **Panel → Meetings**
  (o en la variable `CALENDLY_TOKEN`).

## Arquitectura
```
src/
  app/(site)/        páginas públicas (estáticas; se regeneran al editar en el panel)
  app/admin/         panel privado
  app/media/[id]/    fotos subidas desde el panel
  content/           modelo de contenidos, textos del Excel (defaults.ts), fotos
  lib/               datos (data.ts), almacenamiento (store.ts), auth, SEO
  components/site/   cabecera, pie, popups, WhatsApp, Calendly, formulario
  components/three/  escenas 3D (carga diferida, fuera del bundle inicial)
  proxy.ts           puerta de acceso a /admin (Next 16: antes “middleware”)
```

## Pendiente de revisar con Roxanne
El Excel tiene pestañas sin revisar o vacías; todo lo que no venía del Excel está
marcado `// DRAFT` en `src/content/defaults.ts` y aparece en la checklist del panel.

1. **Nombre**: la pestaña Home (revisada) usa **“RoxanneAlexia”** como marca y la
   pestaña About (sin revisar) **“Roxanne Maison”**. La web usa RoxanneAlexia como
   marca y Roxanne Maison como nombre personal; ambos se cambian en
   *Pages → Brand & global*.
2. **Textos redactados por nosotros** (no estaban en el Excel): página Freelance;
   páginas de Legal, Beginner y Speech (pestañas 5 y 7 vacías; la 6 contenía el
   texto de *Litigation English*, que se usó como track especializado dentro de
   Legal English); títulos de los pasos 2 y 3 de “Launch Your Training”;
   descripciones de paquetes; FAQ del contacto; política de privacidad (plantilla,
   **revisar legalmente**).
3. About decía “1‑to‑1, always / no group dynamics”, lo que contradice los cursos
   en grupo de la pestaña Courses → se adaptó como **“Personal attention, always”**.
4. **Testimonios**: no se inventó ninguno. La sección está oculta hasta que
   Roxanne publique testimonios reales desde el panel.
5. **Cualificaciones** (About): lista vacía, se muestra al rellenarla.
6. Ortografía unificada a **inglés americano** (como las revisiones de Roxanne) y
   erratas corregidas (“coarses”, “professionalswho”, dobles espacios…).
7. Falta: enlace de Calendly, perfil de LinkedIn, retrato.

---

## Dashboard guide for Roxanne

1. Go to **your-site.com/admin** and sign in with your password.
2. **Messages** — every enquiry from the contact form. Open one to mark it as
   read, reply by email in one click, archive or delete it.
3. **Meetings** — your Calendly booking link plus quick links to manage
   availability and scheduled calls. Connect Calendly once to see upcoming
   meetings here.
4. **Pages** — edit every text on the website, page by page. Press **Save**;
   the live site updates within seconds. **Reset** restores the original text.
5. **Testimonials** — add real client quotes (Quote + Name, Role, City/Country)
   and switch **Published** on. The section appears on the site automatically.
6. **Photos** — replace any photo; please upload your **portrait** for the About
   page first.
7. **Settings** — email, WhatsApp number, Calendly link, social profiles and
   your dashboard password.
