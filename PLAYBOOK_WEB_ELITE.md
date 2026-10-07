# Playbook Web Élite — lo aprendido de 5 videos y cómo lo aplicamos

> Fuente: 5 videos (Instagram/WhatsApp) de @prompteafacil, @aress.pw y @stopidesign.
> Método: extraje fotogramas cada 3 s y leí rótulos y subtítulos en pantalla. **No pude transcribir el audio**
> (no hay herramienta de voz en este entorno). Todo lo de abajo sale de lo que se ve; lo que sea inferencia
> está marcado como tal. Si algún video tiene un dato clave solo hablado, pásamelo en texto y lo añado.

---

## 1. Qué enseña cada video

| # | Autor | Tema | Técnica clave |
|---|-------|------|---------------|
| 1 | @prompteafacil | "Anima el fondo de tu web con Claude" | Usar una galería de fondos animados de componentes (tipo 21st.dev / reactbits) como **referencia**, copiar el prompt del componente y pedirle a Claude que lo integre en el hero de la web propia. Resultado: fondo oscuro con líneas topográficas animadas detrás del titular. |
| 2 | @aress.pw | Diseñar webs con IA sin que salgan "genéricas" | **Buscar referencias antes de diseñar**: galerías de webs reales (Godly, Land-book, Siteinspire, etc.) → capturar cómo están estructuradas y organizadas → pasarle a Claude **la captura + el pedido de replicar la estructura** ("pásasela a Claude, exactamente toda la página"). Ejemplo en pantalla: web inmobiliaria con tipografía serif enorme y fotografía arquitectónica. |
| 3 | @stopidesign | Animaciones interactivas por scroll | Flujo: (1) generar una **imagen hero** del producto, (2) con un modelo de video generar una animación de "desarmado/explosión" del objeto, (3) extraer el video a **secuencia de fotogramas `.webp`** (`frame_001.webp … frame_NNN.webp`), (4) pedir a Claude un componente que reproduzca los frames sincronizados con el scroll sobre un `<canvas>`. Ejemplo: hamburguesa que se separa en capas al hacer scroll. |
| 4 | @aress.pw | "Tu página web podría ser ilegal" (3 pasos) | Cumplimiento: **1) política de privacidad y multas, 2) consentimiento de cookies/datos (no recolectar sin pedir permiso), 3) usuarios expuestos / eres el responsable**; plantillas gratuitas paso a paso. |
| 5 | @prompteafacil | "Crea websites 3D con Claude" | **Una web no es una página, es una pila (stack) de capas**: cielo, montañas, cresta, sujeto, bruma, frente — cada capa es una imagen separada con su propia velocidad → efecto parallax/3D. Se guarda como **skill (`SKILL.md`)** para que Claude repita el flujo. Demo con una app de escritorio (Claude/Cowork) construyendo la web desde cero. |

### Patrones comunes (lo importante)
1. **Referencia primero, código después.** Nadie le pide a Claude "hazme una web bonita"; le dan una captura/URL concreta.
2. **Hero con movimiento propio**: fondo animado, parallax por capas o animación atada al scroll. Es lo que separa "web de plantilla" de "web premium".
3. **Imágenes generadas con IA como materia prima**, no como adorno (hero, capas, secuencias de frames).
4. **Capas separadas** (fondo / medio / sujeto / bruma / frente) en vez de una sola imagen plana.
5. **Skills reutilizables** (`SKILL.md`): el flujo se guarda una vez y se repite en todas las webs.
6. **Legal desde el día 1**: privacidad + consentimiento + responsabilidad.
7. **Tipografía con carácter** (serif display grande vs. sans genérica) y mucho espacio negativo.

---

## 2. Dónde estamos hoy (auditoría rápida de `frontend/`)

- Landing `src/app/page.tsx` (1322 líneas): estructura correcta, identidad dorado/negro, `CornerFrame` ya existe.
- **Sin** fondo animado en el hero, **sin** parallax, **sin** animación atada a scroll (no hay `canvas`, `IntersectionObserver` ni `prefers-reduced-motion` fuera del gráfico de velas).
- Sin librerías de animación en `package.json` (ni framer-motion, ni gsap, ni three).
- `/privacy` y `/terms` existen. La política dice que solo usamos cookies estrictamente necesarias y no hay trackers → **hoy no hace falta banner de consentimiento**, pero hay que mantenerlo así o añadirlo en cuanto metamos analítica/pixel.
- Ya tenemos `PROMPT_MEJORAS_UI_COMPETITIVO.md` (prueba social, pricing) y `CREATOR_MARKETING_PLAYBOOK.md`; este documento se centra en **movimiento y proceso**.

---

## 3. Plan de mejora priorizado

### Fase A — Movimiento del hero (1–2 días, bajo riesgo)
1. **Fondo animado dorado** en el hero: líneas de contorno/malla muy sutiles en `#c9a84c` al 6–10 % de opacidad sobre `#07080b`. Implementar con `<canvas>` propio o CSS/SVG (sin dependencias nuevas). Temática natural: "curvas de precio" fluyendo — coherente con un simulador de trading.
2. Reglas de calidad obligatorias: respetar `prefers-reduced-motion`, pausar con `IntersectionObserver` fuera de pantalla, `pointer-events: none`, ≤ 60 fps sin jank en móvil, nada que baje el LCP.

### Fase B — Profundidad por capas (2–3 días)
3. Convertir el hero en una **pila de capas** con parallax suave: fondo (malla) → vela/lingote grande desenfocado → mockup del producto → bruma/gradiente frontal. Imágenes en `.webp` con `loading`/`fetchpriority` correctos.
4. Generar los assets de capa con las herramientas de imagen disponibles (Higgsfield en esta sesión) y recortarlos por separado (quitar fondo).

### Fase C — Animación atada al scroll (3–5 días)
5. Secuencia de frames `.webp` (60–120 frames, ≤ 1280 px, comprimidos) sobre `<canvas>` sincronizada con el scroll en la sección `#preview`: p. ej. el gráfico de oro "armándose" vela a vela. Precarga progresiva y fallback a imagen estática en móvil lento / reduced-motion.
6. Presupuesto de peso: ≤ 2 MB para la secuencia en conexión móvil; lazy-load al acercarse a la sección.

### Fase D — Proceso (continuo)
7. **Referencias antes de diseñar**: carpeta `docs/referencias/` con 5–10 capturas por página (estructura, tipografía, jerarquía). Cada tarea de diseño cita la referencia que replica.
8. **Skill del repo** `.claude/skills/web-premium/SKILL.md` con el flujo: referencia → estructura → capas → motion → checklist de rendimiento y accesibilidad. Así cualquier sesión sigue el mismo estándar.
9. **Checklist legal** (video 4) antes de cada lanzamiento: política de privacidad vigente, consentimiento si hay cookies no esenciales, datos de contacto del responsable, derechos del usuario (acceso/borrado), aviso de riesgo de trading.

### Checklist de "listo para publicar"
- [ ] Lighthouse móvil ≥ 90 en Performance y Accessibility
- [ ] `prefers-reduced-motion` respetado
- [ ] Una sola animación protagonista por pantalla
- [ ] Un solo acento de color (dorado); verde/rojo solo para P&L
- [ ] Privacidad/Términos al día; sin trackers sin consentimiento

---

## 4. Advertencias honestas
- Copiar la **estructura** de una web de referencia es práctica normal; copiar su texto, imágenes o marca no. Replicamos patrones, no contenido.
- Las secuencias de frames y el parallax pueden perjudicar rendimiento y accesibilidad si se abusa; por eso van detrás de las reglas de la Fase A.
- "Cuerpo de élite": no encontré en el repo una definición de este equipo/proceso, así que lo traduje como **el estándar de trabajo del equipo (humano + agentes)**. Si te referías a otra cosa (p. ej. un conjunto concreto de agentes), dímelo y lo adapto.

## 5. Siguiente paso propuesto
Empezar por la **Fase A** (fondo animado del hero) sobre `src/app/page.tsx` y crear la skill `web-premium`. ¿Qué página quieres elevar primero: landing, dashboard o la web de Roxanne?
