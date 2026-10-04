"use strict";
/* Voz de Élite — curso diario de oratoria. Sin dependencias; el progreso vive en localStorage. */
const KEY = "vozdeelite.v1";
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = n => String(n).padStart(2, "0");
const dkey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const mmss = s => `${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}`;
const skillName = id => SKILLS.find(s => s.id === id).name;
const GOALS = ["Hablar en reuniones y trabajo", "Presentaciones y charlas", "Entrevistas y ventas", "Perder el miedo escénico", "Liderazgo y carisma"];
const LEVELS = [[0, "Aprendiz"], [300, "Orador"], [900, "Comunicador"], [1800, "Líder"], [3000, "Maestro"]];
const DRILLS = {
  voz: "Zumbido «mmm» 1 min y cuenta hasta 20 en una sola exhalación.",
  claridad: "Explica en 30 s un concepto de tu trabajo a un niño de 12 años.",
  estructura: "Responde un tema aleatorio con PREP: Punto, Razón, Ejemplo, Punto.",
  confianza: "Graba 60 s sobre cualquier tema sin cortar. El objetivo es no parar.",
  presencia: "Habla 60 s de pie con gestos intencionados y sostén 3 s la mirada al cerrar.",
  persuasion: "Cuenta una mini historia (personaje, problema, resultado) en 45 s.",
};
const QUOTES = ["La pausa es tu mejor aliada.", "Habla para servir, no para impresionar.", "La práctica pequeña y diaria vence al talento ocasional.", "Una idea, una mirada, una pausa.", "Los nervios son energía: úsala.", "Claridad antes que elocuencia."];

/* ---------- estado ---------- */
let S = load();
function load() {
  try { const r = JSON.parse(localStorage.getItem(KEY)); if (r && r.profile) return r; } catch (e) {}
  return { profile: null, base: {}, done: {}, draft: {}, sessions: [], minutes: {} };
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast("No se pudo guardar en este navegador"); } }
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2600); }

/* ---------- métricas derivadas ---------- */
function activityDates() {
  const set = new Set(Object.keys(S.minutes).filter(k => S.minutes[k] > 0));
  Object.values(S.done).forEach(x => set.add(x.date));
  return set;
}
function streak() {
  const a = activityDates(); let d = new Date();
  if (!a.has(dkey(d))) d = addDays(d, -1);
  let n = 0; while (a.has(dkey(d))) { n++; d = addDays(d, -1); }
  return n;
}
function bestStreak() {
  const ds = [...activityDates()].sort(); let best = 0, cur = 0, prev = null;
  for (const k of ds) { const [y, m, d] = k.split("-").map(Number); const t = new Date(y, m - 1, d); cur = prev && Math.round((t - prev) / 864e5) === 1 ? cur + 1 : 1; best = Math.max(best, cur); prev = t; }
  return best;
}
const completedCount = () => Object.keys(S.done).length;
const totalMinutes = () => Math.round(Object.values(S.minutes).reduce((a, b) => a + b, 0));
const xp = () => completedCount() * 100 + S.sessions.length * 10;
function level() { const x = xp(); let i = 0; LEVELS.forEach((l, k) => { if (x >= l[0]) i = k; }); const nx = LEVELS[i + 1]; return { name: LEVELS[i][1], i, next: nx, pct: nx ? Math.round((x - LEVELS[i][0]) / (nx[0] - LEVELS[i][0]) * 100) : 100 }; }
function skillScores() {
  const cur = {}, base = {};
  SKILLS.forEach(sk => {
    base[sk.id] = S.base[sk.id] || 5;
    const r = Object.values(S.done).sort((a, b) => a.ts - b.ts).map(x => x.ratings && x.ratings[sk.id]).filter(Boolean);
    const last = r.slice(-3);
    cur[sk.id] = last.length ? last.reduce((a, b) => a + b, 0) / last.length : base[sk.id];
  });
  return { cur, base };
}
function weakest() { const { cur } = skillScores(); return SKILLS.map(s => s.id).sort((a, b) => cur[a] - cur[b])[0]; }
function nextLesson() { return LESSONS.find(l => !S.done[l.d]); }
const unlocked = d => d === 1 || !!S.done[d - 1];
function moduleDone() { const o = {}; MODULES.forEach(m => o[m.id] = LESSONS.filter(l => l.m === m.id).every(l => S.done[l.d])); return o; }
function badgeState() { const st = { completed: completedCount(), streak: Math.max(streak(), bestStreak()), moduleDone: moduleDone(), sessions: S.sessions.length, minutes: totalMinutes() }; return BADGES.map(b => ({ ...b, on: b.test(st) })); }
function addMinutes(m) { const k = dkey(); S.minutes[k] = Math.round(((S.minutes[k] || 0) + m) * 10) / 10; }

/* ---------- cronómetro global ---------- */
let TM = null;
function beep() { try { const a = new (window.AudioContext || window.webkitAudioContext)(), o = a.createOscillator(), g = a.createGain(); o.connect(g); g.connect(a.destination); o.frequency.value = 880; g.gain.value = .15; o.start(); o.stop(a.currentTime + .35); } catch (e) {} navigator.vibrate && navigator.vibrate(200); }
function startTimer(secs, label) {
  stopTimer(); const end = Date.now() + secs * 1000; const bar = $("#timerbar"); bar.hidden = false;
  const draw = () => { const left = Math.max(0, Math.ceil((end - Date.now()) / 1000)); bar.innerHTML = `<span>${esc(label || "Cronómetro")}</span><span class="t">${mmss(left)}</span><button data-act="timer-stop">Detener</button>`; if (left <= 0) { stopTimer(); beep(); toast("¡Tiempo! Buen trabajo"); } };
  draw(); TM = setInterval(draw, 250);
}
function stopTimer() { clearInterval(TM); TM = null; $("#timerbar").hidden = true; }

/* ---------- vistas ---------- */
const view = { cleanup: null };
function route() {
  if (view.cleanup) { view.cleanup(); view.cleanup = null; }
  const h = location.hash.replace(/^#\/?/, "") || "dashboard";
  const [r, arg] = h.split("/");
  renderTop(r);
  const app = $("#app"); app.onclick = app.oninput = null;
  if (!S.profile) return renderOnboarding(app);
  ({ dashboard: renderDashboard, course: renderCourse, lesson: () => renderLesson(app, +arg), lab: renderLabPage, badges: renderBadges }[r] || renderDashboard)(app);
  window.scrollTo(0, 0);
}
function renderTop(r) {
  const items = [["dashboard", "Panel"], ["course", "Curso"], ["lab", "Laboratorio"], ["badges", "Logros"]];
  $("#top").innerHTML = `<a class="brand" href="#/dashboard">🎙️ Voz de Élite<small>30 días</small></a>` + (S.profile ? `<nav aria-label="Principal">${items.map(([k, n]) => `<a href="#/${k}" class="${r === k || (r === "lesson" && k === "course") ? "on" : ""}">${n}</a>`).join("")}</nav>` : "");
}

function renderOnboarding(app) {
  app.innerHTML = `<div class="card onb"><h1>Bienvenido a Voz de Élite</h1>
  <p class="mut">Un curso diario de oratoria: 30 lecciones, actividades prácticas, laboratorio de voz y un panel que se adapta a ti. Empieza con tu diagnóstico (2 minutos).</p>
  <form id="ob">
  <label for="nm">¿Cómo te llamas?</label><input id="nm" type="text" required maxlength="40" autocomplete="given-name">
  <label for="gl">Tu objetivo principal</label><select id="gl">${GOALS.map(g => `<option>${g}</option>`).join("")}</select>
  <label for="dm">Minutos que puedes practicar al día: <b id="dmv">20</b></label><input id="dm" type="range" min="10" max="60" step="5" value="20" style="width:100%;accent-color:var(--gold)">
  <h3 style="margin-top:22px">Autodiagnóstico (1 = muy bajo, 10 = excelente)</h3>
  ${SKILLS.map(s => `<div class="rate"><span>${s.name}</span><input type="range" min="1" max="10" value="5" data-sk="${s.id}"><b>5</b></div>`).join("")}
  <p class="sm mut">Sé honesto: este es tu punto de partida y verás tu avance en el radar.</p>
  <button class="btn pri" type="submit">Comenzar mi curso →</button></form></div>`;
  const f = $("#ob");
  f.addEventListener("input", e => { if (e.target.dataset.sk) e.target.nextElementSibling.textContent = e.target.value; if (e.target.id === "dm") $("#dmv").textContent = e.target.value; });
  f.addEventListener("submit", e => {
    e.preventDefault();
    S.profile = { name: $("#nm").value.trim(), goal: $("#gl").value, daily: +$("#dm").value, created: dkey() };
    f.querySelectorAll("[data-sk]").forEach(i => S.base[i.dataset.sk] = +i.value);
    save(); location.hash = "#/dashboard"; route();
  });
}

function radarSVG(cur, base) {
  const n = SKILLS.length, R = 95, C = 130, pt = (i, v) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n, r = R * v / 10; return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
  const poly = o => SKILLS.map((s, i) => pt(i, o[s.id]).join(",")).join(" ");
  const rings = [2, 4, 6, 8, 10].map(v => `<polygon points="${SKILLS.map((s, i) => pt(i, v).join(",")).join(" ")}" fill="none" stroke="#283246"/>`).join("");
  const axes = SKILLS.map((s, i) => { const [x, y] = pt(i, 10), [lx, ly] = pt(i, 12.3); return `<line x1="${C}" y1="${C}" x2="${x}" y2="${y}" stroke="#283246"/><text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle">${s.name}</text>`; }).join("");
  const dots = SKILLS.map((s, i) => { const [x, y] = pt(i, cur[s.id]); return `<circle cx="${x}" cy="${y}" r="3.5" fill="#f5b83d"/>`; }).join("");
  return `<svg class="rad" viewBox="0 0 260 260" role="img" aria-label="Radar de habilidades: ${SKILLS.map(s => `${s.name} ${cur[s.id].toFixed(1)}`).join(", ")}" style="width:100%;max-width:340px;display:block;margin:auto">${rings}${axes}<polygon points="${poly(base)}" fill="none" stroke="#9aa6bb" stroke-dasharray="4 3"/><polygon points="${poly(cur)}" fill="#f5b83d33" stroke="#f5b83d" stroke-width="2"/>${dots}</svg>`;
}

function renderDashboard(app) {
  const p = S.profile, now = new Date(), hr = now.getHours(), hi = hr < 6 ? "Buenas noches" : hr < 13 ? "Buenos días" : hr < 20 ? "Buenas tardes" : "Buenas noches";
  const nl = nextLesson(), lv = level(), st = streak(), { cur, base } = skillScores(), weak = weakest();
  const today = S.minutes[dkey()] || 0, goalPct = Math.min(100, Math.round(today / p.daily * 100)), pct = Math.round(completedCount() / LESSONS.length * 100);
  const doneToday = Object.values(S.done).some(x => x.date === dkey());
  // heatmap: últimas 5 semanas alineadas a lunes
  const first = addDays(now, -((now.getDay() + 6) % 7) - 28); const cells = [];
  for (let i = 0; i < 35; i++) { const d = addDays(first, i), k = dkey(d), m = S.minutes[k] || 0; const l = m <= 0 ? "" : m < p.daily * .5 ? "l1" : m < p.daily ? "l2" : "l3"; cells.push(`<div class="${l} ${k === dkey() ? "today" : ""}" title="${k}: ${Math.round(m)} min">${d.getDate()}</div>`); }
  // minutos últimos 7 días
  const days7 = [...Array(7)].map((_, i) => { const d = addDays(now, i - 6); return { l: "DLMXJVS"[d.getDay()], m: S.minutes[dkey(d)] || 0 }; }); const mx = Math.max(p.daily, ...days7.map(x => x.m));
  const bars = days7.map((x, i) => { const h = Math.round(x.m / mx * 80); return `<g><rect x="${i * 38 + 8}" y="${90 - h}" width="26" height="${Math.max(h, 2)}" rx="5" fill="${x.m >= p.daily ? "#f5b83d" : "#8a6a1b"}"/><text x="${i * 38 + 21}" y="106" text-anchor="middle" font-size="11" fill="#9aa6bb">${x.l}</text><text x="${i * 38 + 21}" y="${84 - h}" text-anchor="middle" font-size="10" fill="#eef1f6">${x.m ? Math.round(x.m) : ""}</text></g>`; }).join("");
  const last = S.sessions.slice(-1)[0];
  app.innerHTML = `
  <div class="card hero"><div class="row sp"><div><h1>${hi}, ${esc(p.name)} 👋</h1><p class="mut" style="margin:0">Objetivo: ${esc(p.goal)} · «${QUOTES[(now.getDate() + now.getMonth()) % QUOTES.length]}»</p></div>
  <div class="row"><div class="ring" style="--p:${pct}"><b>${pct}%</b></div><div><b class="gold">${lv.name}</b><div class="sm mut">${xp()} XP${lv.next ? ` · faltan ${lv.next[0] - xp()} para ${lv.next[1]}` : ""}</div><div class="bar" style="width:150px;margin-top:6px"><i style="width:${lv.pct}%"></i></div></div></div></div></div>
  <div class="grid g4" style="margin:16px 0">
    <div class="card stat"><b>🔥 ${st}</b><span>días de racha (mejor ${bestStreak()})</span></div>
    <div class="card stat"><b>${completedCount()}/${LESSONS.length}</b><span>lecciones</span></div>
    <div class="card stat"><b>${totalMinutes()}</b><span>minutos practicados</span></div>
    <div class="card stat"><b>${S.sessions.length}</b><span>grabaciones</span></div></div>
  <div class="grid g2">
    <div class="card"><h2>🎯 Tu plan de hoy</h2>
      ${nl ? `<p><span class="pill">Día ${nl.d} · ${MODULES[nl.m - 1].name}</span></p><h3>${esc(nl.title)}</h3><p class="mut">${esc(nl.concept.slice(0, 150))}…</p><p class="sm mut">⏱ ${nl.min} min · entrena: ${nl.skills.map(skillName).join(", ")}</p><a class="btn pri" href="#/lesson/${nl.d}">${S.draft[nl.d] ? "Continuar lección" : "Empezar lección"} →</a>` : `<h3>🏆 ¡Curso completado!</h3><p class="mut">Repite las lecciones que quieras o sigue puliendo en el laboratorio.</p><a class="btn pri" href="#/lab">Ir al laboratorio</a>`}
      <hr style="border:0;border-top:1px solid var(--line);margin:16px 0">
      <p class="sm"><b>🔥 Calentamiento del día</b><br>${esc(WARMUPS[(Math.floor(now / 864e5)) % WARMUPS.length])}</p>
      <div class="bar" title="Meta diaria"><i style="width:${goalPct}%"></i></div><p class="sm mut" style="margin-top:6px">Meta diaria: ${Math.round(today)} / ${p.daily} min ${doneToday ? "· ✅ lección de hoy hecha" : ""}</p></div>
    <div class="card"><h2>🕸️ Tu radar de habilidades</h2>${radarSVG(cur, base)}<p class="sm mut" style="text-align:center;margin:8px 0 0">Línea punteada = tu punto de partida · Dorado = ahora</p></div>
    <div class="card"><h2>💡 Foco recomendado: <span class="gold">${skillName(weak)}</span></h2><p>Es tu habilidad con menor puntuación (${cur[weak].toFixed(1)}/10). Microejercicio de 3 minutos:</p><div class="ex">${esc(DRILLS[weak])}</div><div class="row"><a class="btn" href="#/lab">Practicar en el laboratorio</a><button class="btn" data-act="breath">🫁 Guía de respiración</button></div><div id="breathbox"></div></div>
    <div class="card"><h2>📅 Constancia (5 semanas)</h2><div class="sm mut heat" style="margin-bottom:5px">${"LMXJVSD".split("").map(l => `<span style="text-align:center">${l}</span>`).join("")}</div><div class="heat">${cells.join("")}</div></div>
    <div class="card"><h2>📈 Minutos esta semana</h2><svg viewBox="0 0 270 112" style="width:100%" role="img" aria-label="Minutos practicados los últimos 7 días">${bars}</svg></div>
    <div class="card"><h2>🎤 Última grabación</h2>${last ? `<p class="sm mut">${new Date(last.ts).toLocaleDateString("es")} · ${esc(last.topic || "Práctica libre")}</p><div class="grid g3"><div class="stat"><b>${mmss(last.dur)}</b><span>duración</span></div><div class="stat"><b>${last.wpm || "–"}</b><span>palabras/min</span></div><div class="stat"><b>${last.fillers}</b><span>muletillas</span></div></div>` : `<p class="mut">Aún no tienes grabaciones. El laboratorio mide tu ritmo y muletillas.</p><a class="btn" href="#/lab">Hacer mi primera</a>`}</div>
  </div>`;
}

function renderCourse(app) {
  const nl = nextLesson();
  app.innerHTML = `<h1>Programa de 30 días</h1><p class="mut">Una lección al día: ~15–45 min con teoría, actividades cronometradas y autoevaluación. Cada lección se desbloquea al completar la anterior.</p>` + MODULES.map(m => {
    const ls = LESSONS.filter(l => l.m === m.id), dn = ls.filter(l => S.done[l.d]).length;
    return `<section class="mod"><h2><span class="dot" style="background:${m.color}"></span>Módulo ${m.id}: ${m.name} <span class="pill">${dn}/${ls.length}</span></h2><div class="grid g3">${ls.map(l => `<a class="les ${S.done[l.d] ? "done" : nl && nl.d === l.d ? "next" : unlocked(l.d) ? "" : "lock"}" href="#/lesson/${l.d}"><div class="n">DÍA ${l.d}</div><b>${esc(l.title)}</b><div class="sm mut">⏱ ${l.min} min${!unlocked(l.d) ? " · 🔒" : ""}</div></a>`).join("")}</div></section>`;
  }).join("");
}

function renderLesson(app, d) {
  const L = LESSONS.find(l => l.d === d);
  if (!L) { location.hash = "#/course"; return; }
  if (!unlocked(d)) { app.innerHTML = `<div class="card"><h2>🔒 Lección bloqueada</h2><p>Completa primero el día ${d - 1}.</p><a class="btn" href="#/lesson/${d - 1}">Ir al día ${d - 1}</a></div>`; return; }
  const done = S.done[d], dr = S.draft[d] = S.draft[d] || { steps: [], ratings: {}, note: "" };
  const ratings = done ? done.ratings : dr.ratings, note = done ? done.note : dr.note;
  const checked = i => (done ? true : !!dr.steps[i]);
  const hasLab = L.steps.some(s => s.lab), mod = MODULES[L.m - 1];
  app.innerHTML = `<a href="#/course" class="sm">← Programa</a>
  <div class="row sp" style="margin:8px 0 16px"><div><span class="pill" style="color:${mod.color}">Módulo ${mod.id} · ${mod.name}</span><h1 style="margin-top:8px">Día ${L.d}: ${esc(L.title)}</h1><div class="sm mut">⏱ ${L.min} min · entrena ${L.skills.map(skillName).join(", ")}</div></div>${done ? `<span class="pill" style="color:var(--ok)">✓ Completada</span>` : ""}</div>
  <div class="grid g2"><div>
    <div class="card"><h2>📖 Concepto</h2><p>${esc(L.concept)}</p><h3>Claves</h3><ul class="pts">${L.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul><div class="ex"><b>Ejemplo.</b> ${esc(L.example)}</div></div>
    <div class="card" style="margin-top:16px"><h2>🎯 Actividades</h2><p class="sm mut">Calentamiento de hoy: <i>${esc(WARMUPS[(d - 1) % WARMUPS.length])}</i></p>
    ${L.steps.map((s, i) => `<div class="step"><input type="checkbox" id="st${i}" data-step="${i}" ${checked(i) ? "checked" : ""} ${done ? "disabled" : ""} aria-label="Paso ${i + 1} completado"><div class="b"><label for="st${i}" style="margin:0"><b>${i + 1}. ${esc(s.t)}</b></label><p style="margin:4px 0 8px">${esc(s.x)}</p><div class="row">${s.s ? `<button class="btn" data-act="timer" data-s="${s.s}" data-l="${esc(s.t)}">⏱ Cronómetro ${mmss(s.s)}</button>` : ""}${s.lab ? `<button class="btn" data-act="openlab">🎤 Laboratorio de voz</button>` : ""}</div></div></div>`).join("")}</div>
    ${hasLab ? `<div class="card" id="labslot" style="margin-top:16px" hidden></div>` : ""}</div>
  <div><div class="card"><h2>📝 Autoevaluación</h2><p class="sm mut">Puntúa cómo lo hiciste hoy (1–10). Alimenta tu radar.</p>${L.skills.map(sk => `<div class="rate"><span>${skillName(sk)}</span><input type="range" min="1" max="10" value="${ratings[sk] || 6}" data-rate="${sk}"><b>${ratings[sk] || 6}</b></div>`).join("")}
    <label for="note">Reflexión: ${esc(L.reflect)}</label><textarea id="note" placeholder="Escribe aquí tus aprendizajes…">${esc(note)}</textarea>
    <div class="row" style="margin-top:14px"><button class="btn pri" data-act="complete" ${done ? "disabled" : ""}>${done ? "Lección completada" : "Completar lección (+100 XP)"}</button>${done ? `<button class="btn" data-act="redo">Repetir</button>` : ""}</div><p class="sm mut" id="cmsg"></p></div>
    <div class="row" style="margin-top:16px">${d > 1 ? `<a class="btn" href="#/lesson/${d - 1}">← Anterior</a>` : ""}${d < LESSONS.length && unlocked(d + 1) ? `<a class="btn" href="#/lesson/${d + 1}">Siguiente →</a>` : ""}</div></div></div>`;
  app.onclick = e => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    if (b.dataset.act === "openlab") { const slot = $("#labslot"); slot.hidden = false; slot.innerHTML = ""; view.cleanup && view.cleanup(); view.cleanup = mountLab(slot, { lesson: d }); slot.scrollIntoView({ behavior: "smooth" }); }
    if (b.dataset.act === "complete") {
      const miss = L.steps.findIndex((_, i) => !dr.steps[i]); if (miss >= 0) { $("#cmsg").textContent = `Marca el paso ${miss + 1} como hecho antes de completar.`; return; }
      S.done[d] = { ts: Date.now(), date: dkey(), ratings: { ...dr.ratings, ...Object.fromEntries(L.skills.map(sk => [sk, +(dr.ratings[sk] || 6)])) }, note: $("#note").value, steps: dr.steps };
      delete S.draft[d]; addMinutes(L.min); const before = new Set(badgeState().filter(x => x.on).map(x => x.id)); save();
      const nb = badgeState().filter(x => x.on && !before.has(x.id));
      toast(nb.length ? `🏅 Nueva insignia: ${nb[0].name}` : "¡Lección completada! +100 XP"); renderLesson(app, d);
    }
    if (b.dataset.act === "redo") { S.draft[d] = { steps: [], ratings: { ...S.done[d].ratings }, note: S.done[d].note }; delete S.done[d]; save(); renderLesson(app, d); }
  };
  app.oninput = e => {
    if (done) return;
    if (e.target.dataset.step !== undefined) { dr.steps[+e.target.dataset.step] = e.target.checked; save(); }
    if (e.target.dataset.rate) { dr.ratings[e.target.dataset.rate] = +e.target.value; e.target.nextElementSibling.textContent = e.target.value; save(); }
    if (e.target.id === "note") { dr.note = e.target.value; save(); }
  };
}

function renderBadges(app) {
  const bs = badgeState(), icons = { first: "🌱", streak3: "🔥", streak7: "⚡", streak21: "💎", mod1: "🎵", mod2: "🧘", mod3: "🏛️", mod4: "📖", mod5: "🎭", mod6: "👑", lab5: "🎤", lab20: "🏅", min300: "⏳" };
  app.innerHTML = `<h1>Logros</h1><p class="mut">${bs.filter(b => b.on).length} de ${bs.length} desbloqueados.</p><div class="badges">${bs.map(b => `<div class="badge ${b.on ? "on" : ""}"><div class="ic">${icons[b.id]}</div><b>${b.name}</b><div class="sm mut">${b.desc}</div></div>`).join("")}</div>
  <div class="card" style="margin-top:28px"><h2>⚙️ Tus datos</h2><p class="sm mut">Todo se guarda solo en este navegador. Exporta una copia para no perderlo o pasarlo a otro dispositivo.</p><div class="row"><button class="btn" data-act="export">⬇ Exportar progreso</button><label class="btn" style="margin:0">⬆ Importar<input type="file" id="imp" accept="application/json" hidden></label><button class="btn" data-act="reset" style="color:var(--bad)">Reiniciar todo</button></div></div>`;
  app.onclick = e => {
    const a = e.target.closest("[data-act]")?.dataset.act;
    if (a === "export") { const u = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: "application/json" })), l = document.createElement("a"); l.href = u; l.download = `voz-de-elite-${dkey()}.json`; l.click(); URL.revokeObjectURL(u); }
    if (a === "reset" && confirm("¿Borrar todo tu progreso? No se puede deshacer.")) { localStorage.removeItem(KEY); S = load(); location.hash = "#/dashboard"; route(); }
  };
  $("#imp").onchange = ev => { const f = ev.target.files[0]; if (!f) return; f.text().then(t => { try { const o = JSON.parse(t); if (!o.profile || !o.done) throw 0; S = { sessions: [], minutes: {}, draft: {}, base: {}, ...o }; save(); toast("Progreso importado"); route(); } catch (e) { toast("Archivo no válido"); } }); };
}

/* ---------- laboratorio de voz ---------- */
const FILL_RE = /(?:^|[\s,.¿?¡!])(eh+|em+|mm+|este|o sea|osea|bueno|pues|tipo|como que|digamos|básicamente|basicamente|a ver)(?=$|[\s,.¿?¡!])/gi;
function renderLabPage(app) {
  app.innerHTML = `<h1>Laboratorio de voz</h1><p class="mut">Graba tu práctica: mide tu ritmo (palabras por minuto), detecta posibles muletillas y escúchate. El audio nunca sale de tu dispositivo.</p><div class="card" id="labslot"></div><div class="card" style="margin-top:16px"><h2>Historial</h2>${S.sessions.length ? `<table style="width:100%;border-collapse:collapse;font-size:.9rem"><tr class="mut"><th align="left">Fecha</th><th align="left">Tema</th><th>Dur.</th><th>ppm</th><th>Mulet.</th></tr>${S.sessions.slice(-12).reverse().map(s => `<tr style="border-top:1px solid var(--line)"><td>${new Date(s.ts).toLocaleDateString("es")}</td><td>${esc((s.topic || "Libre").slice(0, 40))}</td><td align="center">${mmss(s.dur)}</td><td align="center">${s.wpm || "–"}</td><td align="center">${s.fillers}</td></tr>`).join("")}</table>` : `<p class="mut">Aún no hay sesiones.</p>`}</div>`;
  view.cleanup = mountLab($("#labslot"), {});
}
function mountLab(el, opts) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let topic = TOPICS[Math.floor(Math.random() * TOPICS.length)], rec = null, stream = null, sr = null, chunks = [], t0 = 0, tick = null, final = "", interim = "", manual = 0, running = false, audioUrl = null;
  const ui = () => {
    el.innerHTML = `<h2>🎤 Laboratorio</h2><div class="topic" id="tp">${esc(topic)}</div>
    <div class="row"><button class="btn" data-l="topic">🎲 Otro tema</button><button class="btn pri" data-l="go" id="go">● Grabar con micrófono</button><button class="btn" data-l="nomic" id="nomic">⏱ Solo cronómetro</button></div>
    <p class="sm mut" id="lst" style="margin-top:10px">${SR ? "Se transcribe en vivo (Chrome/Edge/Safari) para calcular tu ritmo." : "Tu navegador no transcribe voz: verás duración y podrás contar muletillas a mano."}</p>
    <div id="live" hidden><div class="stat"><b id="lt">00:00</b><span>tiempo</span></div><p class="sm" id="ltx" style="min-height:2.4em;color:var(--mut)"></p></div>
    <div id="res"></div>`;
  };
  ui();
  const clock = () => mmss((Date.now() - t0) / 1000);
  async function start(useMic) {
    final = interim = ""; manual = 0; chunks = []; $("#res").innerHTML = ""; if (audioUrl) { URL.revokeObjectURL(audioUrl); audioUrl = null; }
    if (useMic) {
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { toast("Sin acceso al micrófono: usa el modo cronómetro"); return; }
      rec = new MediaRecorder(stream); rec.ondataavailable = e => e.data.size && chunks.push(e.data); rec.start();
      if (SR) { sr = new SR(); sr.lang = "es-ES"; sr.continuous = true; sr.interimResults = true; sr.onresult = ev => { interim = ""; for (let i = ev.resultIndex; i < ev.results.length; i++) { const t = ev.results[i][0].transcript; if (ev.results[i].isFinal) final += t + " "; else interim += t; } const x = $("#ltx"); if (x) x.textContent = (final + interim).slice(-160); }; sr.onend = () => { if (running) try { sr.start(); } catch (e) {} }; try { sr.start(); } catch (e) {} }
    }
    running = true; t0 = Date.now(); $("#live").hidden = false;
    $("#go").textContent = "■ Detener"; $("#go").classList.add("rec"); $("#go").dataset.l = "stop"; $("#nomic").disabled = true;
    tick = setInterval(() => { const t = $("#lt"); if (t) t.textContent = clock(); }, 250);
  }
  function stop() {
    if (!running) return; running = false; clearInterval(tick); const dur = Math.max(1, Math.round((Date.now() - t0) / 1000));
    try { sr && sr.stop(); } catch (e) {} sr = null;
    const finish = () => { stream && stream.getTracks().forEach(t => t.stop()); stream = null; if (chunks.length) audioUrl = URL.createObjectURL(new Blob(chunks, { type: chunks[0].type })); results(dur); };
    if (rec && rec.state !== "inactive") { rec.onstop = finish; rec.stop(); } else finish();
    rec = null;
  }
  function results(dur) {
    const text = (final + interim).trim(), words = text ? text.split(/\s+/).length : 0, wpm = words >= 15 && dur >= 10 ? Math.round(words / dur * 60) : 0;
    const auto = (text.match(FILL_RE) || []).length;
    const tip = !wpm ? "Habla al menos 10 s con transcripción para medir tu ritmo." : wpm < 110 ? "Ritmo pausado: sube un poco la energía, pero conserva tus pausas." : wpm <= 170 ? "Ritmo ideal (120–160 ppm aprox.). ¡Sigue así!" : "Vas rápido: respira y haz pausas de 1–2 segundos entre ideas.";
    $("#live").hidden = true; $("#go").textContent = "● Grabar de nuevo"; $("#go").classList.remove("rec"); $("#go").dataset.l = "go"; $("#nomic").disabled = false;
    $("#res").innerHTML = `<div class="grid g4" style="margin:14px 0"><div class="stat"><b>${mmss(dur)}</b><span>duración</span></div><div class="stat"><b>${wpm || "–"}</b><span>palabras/min</span></div><div class="stat"><b id="fc">${auto}</b><span>posibles muletillas (auto)</span></div><div class="stat"><div class="tally"><button data-l="m-">−</button><b id="mc" style="font-size:1.6rem;color:var(--gold)">0</b><button data-l="m+">+</button></div><span>muletillas (a mano)</span></div></div><p>💬 ${tip}</p>${audioUrl ? `<audio controls src="${audioUrl}" style="width:100%"></audio>` : ""}${text ? `<details style="margin-top:8px"><summary class="sm mut">Ver transcripción</summary><p class="sm">${esc(text)}</p></details>` : ""}<button class="btn pri" data-l="save" style="margin-top:12px">💾 Guardar sesión</button>`;
    el._cur = { dur, wpm, auto };
  }
  const onclick = e => {
    const a = e.target.closest("[data-l]")?.dataset.l; if (!a) return;
    if (a === "topic") { topic = TOPICS[Math.floor(Math.random() * TOPICS.length)]; $("#tp").textContent = topic; }
    if (a === "go") start(true); if (a === "nomic") { start(false); }
    if (a === "stop") stop();
    if (a === "m+" || a === "m-") { manual = Math.max(0, manual + (a === "m+" ? 1 : -1)); $("#mc").textContent = manual; }
    if (a === "save") {
      const c = el._cur; if (!c) return;
      S.sessions.push({ ts: Date.now(), date: dkey(), dur: c.dur, wpm: c.wpm, fillers: Math.max(c.auto, manual), topic, lesson: opts.lesson || null });
      addMinutes(c.dur / 60); save(); el._cur = null; toast("Sesión guardada 🎉"); e.target.disabled = true; e.target.textContent = "✓ Guardada";
    }
  };
  el.addEventListener("click", onclick);
  return () => { running = false; clearInterval(tick); try { sr && sr.stop(); } catch (e) {} try { rec && rec.state !== "inactive" && rec.stop(); } catch (e) {} stream && stream.getTracks().forEach(t => t.stop()); audioUrl && URL.revokeObjectURL(audioUrl); el.removeEventListener("click", onclick); };
}

/* ---------- respiración guiada ---------- */
let breathT = null;
function breath() {
  const box = $("#breathbox"); if (!box) return; if (breathT) { clearTimeout(breathT); breathT = null; box.innerHTML = ""; return; }
  box.innerHTML = `<div class="breath" id="bc">Preparado</div><p class="sm mut" style="text-align:center">Inhala 4 s · retén 4 s · exhala 6 s. Pulsa de nuevo el botón para parar.</p>`;
  const ph = [["Inhala", "in", 4], ["Retén", "hold", 4], ["Exhala", "out", 6]]; let i = 0;
  const step = () => { const c = $("#bc"); if (!c) { breathT = null; return; } const [t, cl, s] = ph[i % 3]; c.className = "breath " + cl; c.textContent = t; i++; breathT = setTimeout(step, s * 1000); };
  setTimeout(step, 50);
}

/* ---------- eventos globales ---------- */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  if (b.dataset.act === "timer") startTimer(+b.dataset.s, b.dataset.l);
  if (b.dataset.act === "timer-stop") stopTimer();
  if (b.dataset.act === "breath") breath();
});
window.addEventListener("hashchange", route);
route();
