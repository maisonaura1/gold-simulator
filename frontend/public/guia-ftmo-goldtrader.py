"""
Genera: guia-ftmo-goldtrader.pdf
Paleta GoldTrader: negro / oro / verde / rojo
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    Table, TableStyle, PageBreak, KeepTogether
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import Flowable

# ── Colores ──────────────────────────────────────────────────
BG       = HexColor("#08090c")
GOLD     = HexColor("#c9a84c")
GOLD_LT  = HexColor("#ffe082")
GREEN    = HexColor("#2dcc6f")
RED      = HexColor("#e84040")
TEXT     = HexColor("#e8ecf4")
MUTED    = HexColor("#6b7385")
SUB      = HexColor("#8893a8")
DARK2    = HexColor("#0f1117")
BORDER   = HexColor("#2c2410")

W, H = A4  # 210 x 297 mm

# ── Estilos ──────────────────────────────────────────────────
def s(name, **kw):
    base = dict(
        fontName="Helvetica", fontSize=11,
        textColor=TEXT, leading=16,
        leftIndent=0, rightIndent=0,
        spaceAfter=0, spaceBefore=0,
    )
    base.update(kw)
    return ParagraphStyle(name, **base)

ST = {
    "kicker":   s("kicker",  fontName="Helvetica-Bold", fontSize=8,
                   textColor=GOLD, leading=12, letterSpacing=1.4,
                   spaceAfter=6),
    "h1":       s("h1",      fontName="Helvetica-Bold", fontSize=28,
                   textColor=TEXT, leading=34, spaceAfter=8),
    "h1gold":   s("h1gold",  fontName="Helvetica-Bold", fontSize=28,
                   textColor=GOLD, leading=34, spaceAfter=16),
    "h2":       s("h2",      fontName="Helvetica-Bold", fontSize=16,
                   textColor=TEXT, leading=22, spaceBefore=18, spaceAfter=6),
    "h3":       s("h3",      fontName="Helvetica-Bold", fontSize=12,
                   textColor=GOLD, leading=16, spaceBefore=10, spaceAfter=4),
    "body":     s("body",    fontSize=10, textColor=SUB, leading=16, spaceAfter=8),
    "bodyW":    s("bodyW",   fontSize=10, textColor=TEXT, leading=16, spaceAfter=8),
    "callout":  s("callout", fontName="Helvetica-Bold", fontSize=11,
                   textColor=TEXT, leading=16, spaceAfter=6),
    "mono":     s("mono",    fontName="Courier", fontSize=9,
                   textColor=GOLD, leading=14),
    "small":    s("small",   fontSize=8, textColor=MUTED, leading=12),
    "center":   s("center",  fontSize=10, textColor=SUB, leading=15,
                   alignment=TA_CENTER, spaceAfter=6),
    "tag":      s("tag",     fontName="Helvetica-Bold", fontSize=8,
                   textColor=GREEN, leading=12),
    "tag_r":    s("tag_r",   fontName="Helvetica-Bold", fontSize=8,
                   textColor=RED, leading=12),
}

# ── Bloque de color de fondo para toda la página ─────────────
class DarkBackground(Flowable):
    def __init__(self, w, h):
        Flowable.__init__(self)
        self.w, self.h = w, h
    def draw(self):
        self.canv.setFillColor(BG)
        self.canv.rect(0, 0, self.w, self.h, fill=1, stroke=0)

class ColorRect(Flowable):
    def __init__(self, w, h, fill, radius=4):
        Flowable.__init__(self)
        self.width, self.height = w, h
        self._fill, self._r = fill, radius
    def draw(self):
        self.canv.setFillColor(self._fill)
        self.canv.roundRect(0, 0, self.width, self.height,
                             self._r, fill=1, stroke=0)

class GoldRule(Flowable):
    def __init__(self, w, thick=0.6):
        Flowable.__init__(self)
        self.width, self.height = w, thick + 4
        self._thick = thick
    def draw(self):
        self.canv.setStrokeColor(BORDER)
        self.canv.setLineWidth(self._thick)
        self.canv.line(0, 2, self.width, 2)

# ── Fondo de página ──────────────────────────────────────────
def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BG)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)

    # borde dorado sutil arriba y abajo
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(18*mm, H - 14*mm, W - 18*mm, H - 14*mm)
    canvas.line(18*mm, 12*mm,     W - 18*mm, 12*mm)

    # número de página
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(W/2, 8*mm, f"GoldTrader · XAUUSD Simulator  ·  Página {doc.page}")
    canvas.restoreState()

# ── Tarjeta de regla ─────────────────────────────────────────
def rule_card(label, value, ok, desc):
    c_border = HexColor("#1a3d24") if ok else HexColor("#3d1a1a")
    c_val    = GREEN if ok else RED
    mark     = "✓" if ok else "✗"
    data = [[
        Paragraph(f'<font color="#{("2dcc6f" if ok else "e84040")}">{mark}  {label}</font>',
                  s("rk", fontName="Courier", fontSize=9, textColor=c_val, leading=12)),
        Paragraph(f'<font color="#{("2dcc6f" if ok else "e84040")}">{value}</font>',
                  s("rv", fontName="Courier-Bold", fontSize=10,
                    textColor=c_val, leading=12, alignment=TA_RIGHT)),
    ]]
    ts = TableStyle([
        ("BACKGROUND",  (0,0), (-1,-1), HexColor("#0f1117")),
        ("LINEABOVE",   (0,0), (-1,-1), 0.4, c_border),
        ("LINEBELOW",   (0,0), (-1,-1), 0.4, c_border),
        ("LINEBEFORE",  (0,0), (-1,-1), 0.4, c_border),
        ("LINEAFTER",   (0,0), (-1,-1), 0.4, c_border),
        ("ROUNDEDCORNERS", [3,3,3,3]),
        ("TOPPADDING",  (0,0), (-1,-1), 6),
        ("BOTTOMPADDING",(0,0),(-1,-1), 6),
        ("LEFTPADDING", (0,0), (-1,-1), 10),
        ("RIGHTPADDING",(0,0), (-1,-1), 10),
        ("VALIGN",      (0,0), (-1,-1), "MIDDLE"),
    ])
    col_w = (W - 36*mm) * 0.9
    tbl = Table(data, colWidths=[col_w*0.65, col_w*0.35])
    tbl.setStyle(ts)
    return tbl

# ── Tip box ──────────────────────────────────────────────────
def tip_box(title, body, color=GOLD):
    cname = "c9a84c" if color == GOLD else ("2dcc6f" if color == GREEN else "e84040")
    data = [[
        Paragraph(f'<font color="#{cname}">◆  {title}</font>',
                  s("th", fontName="Helvetica-Bold", fontSize=9,
                    textColor=color, leading=13)),
        Paragraph(body, s("tb", fontSize=9, textColor=SUB, leading=14)),
    ]]
    ts = TableStyle([
        ("BACKGROUND",   (0,0), (-1,-1), DARK2),
        ("LINEABOVE",    (0,0), (-1,-1), 1.5, color),
        ("LINEBELOW",    (0,0), (-1,-1), 0.4, BORDER),
        ("LINEBEFORE",   (0,0), (-1,-1), 0.4, BORDER),
        ("LINEAFTER",    (0,0), (-1,-1), 0.4, BORDER),
        ("TOPPADDING",   (0,0), (-1,-1), 8),
        ("BOTTOMPADDING",(0,0), (-1,-1), 8),
        ("LEFTPADDING",  (0,0), (-1,-1), 10),
        ("RIGHTPADDING", (0,0), (-1,-1), 10),
        ("VALIGN",       (0,0), (-1,-1), "TOP"),
    ])
    col_w = W - 36*mm
    tbl = Table(data, colWidths=[col_w*0.32, col_w*0.68])
    tbl.setStyle(ts)
    return tbl

# ── Tabla de checklist ────────────────────────────────────────
def checklist(items):
    rows = []
    for ok, text in items:
        c   = GREEN if ok else RED
        mk  = "✓" if ok else "✗"
        ch  = "2dcc6f" if ok else "e84040"
        rows.append([
            Paragraph(f'<font color="#{ch}">{mk}</font>',
                      s("ck", fontName="Courier-Bold", fontSize=10,
                        textColor=c, leading=14, alignment=TA_CENTER)),
            Paragraph(text, s("ci", fontSize=9, textColor=SUB, leading=14)),
        ])
    ts = TableStyle([
        ("BACKGROUND",   (0,0), (-1,-1), DARK2),
        ("LINEBEFORE",   (0,0), (-1,-1), 0.4, BORDER),
        ("LINEAFTER",    (0,0), (-1,-1), 0.4, BORDER),
        ("LINEABOVE",    (0,0), (0,0),   0.4, BORDER),
        ("LINEBELOW",    (0,-1),(-1,-1), 0.4, BORDER),
        ("LINEBELOW",    (0,0), (-1,-2), 0.3, HexColor("#1d2029")),
        ("TOPPADDING",   (0,0), (-1,-1), 6),
        ("BOTTOMPADDING",(0,0), (-1,-1), 6),
        ("LEFTPADDING",  (0,0), (0,-1),  10),
        ("RIGHTPADDING", (0,0), (-1,-1), 10),
        ("VALIGN",       (0,0), (-1,-1), "MIDDLE"),
    ])
    col_w = W - 36*mm
    tbl = Table(rows, colWidths=[16*mm, col_w - 16*mm])
    tbl.setStyle(ts)
    return tbl

# ── Construir documento ───────────────────────────────────────
OUT = "/Users/maisonaura/gold-simulator/frontend/public/guia-ftmo-goldtrader.pdf"

doc = SimpleDocTemplate(
    OUT, pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm,
    topMargin=20*mm,  bottomMargin=20*mm,
    onFirstPage=on_page, onLaterPages=on_page,
)

story = []
sp = lambda n=1: Spacer(1, n * 5*mm)

# ════════════════════════════════════════
# PORTADA
# ════════════════════════════════════════
story += [
    sp(3),
    Paragraph("CHALLENGE PREP GUIDE", ST["kicker"]),
    Paragraph("Cómo pasar un FTMO", ST["h1"]),
    Paragraph("sin quemarte el primer día", ST["h1gold"]),
    sp(),
    GoldRule(W - 36*mm),
    sp(),
    Paragraph(
        "La mayoría de traders fallan el challenge en los primeros 3 días. "
        "No por falta de estrategia — sino por no entender las reglas exactas que les evalúan. "
        "Esta guía te explica cada métrica, cómo protegerlas, y cómo usar GoldTrader "
        "para llegar al día 1 del challenge ya entrenado.",
        ST["body"]),
    sp(),
    tip_box("Para quién es esta guía",
            "Traders que preparan un FTMO, Funded Next, The5ers u otro "
            "prop firm challenge. Nivel: principiante a intermedio. Instrumento: XAUUSD."),
    sp(3),
    Paragraph("LAS 4 REGLAS QUE ELIMINAN AL 85%", ST["kicker"]),
    sp(0.5),
    rule_card("Max Drawdown",    "< 10% del balance inicial",  True,  ""),
    sp(0.5),
    rule_card("Daily Drawdown",  "< 5% del balance del día",   True,  ""),
    sp(0.5),
    rule_card("Consistency",     "≥ 70/100 en GoldTrader",     False, ""),
    sp(0.5),
    rule_card("Avg R:R",         "≥ 2:1 por operación",        False, ""),
    sp(),
    Paragraph(
        "Los dos primeros son límites duros — si los rompes, el challenge termina automáticamente. "
        "Los dos últimos son los que más traders ignoran hasta que es demasiado tarde.",
        ST["small"]),
    PageBreak(),
]

# ════════════════════════════════════════
# CAP. 1 — MAX DRAWDOWN
# ════════════════════════════════════════
story += [
    Paragraph("01 · MAX DRAWDOWN", ST["kicker"]),
    Paragraph("La regla que más elimina — y la más fácil de evitar", ST["h2"]),
    Paragraph(
        "El Max Drawdown mide cuánto ha caído tu balance desde su punto más alto durante "
        "todo el challenge. Si empiezas con €100.000 y en algún momento llegas a €89.999, "
        "has roto el límite.",
        ST["body"]),
    tip_box("Definición exacta",
            "Max DD = (Pico máximo de balance − Balance actual) / Balance inicial. "
            "Se calcula sobre el balance total incluyendo posiciones abiertas.", GOLD),
    sp(),
    Paragraph("Errores más comunes", ST["h3"]),
    checklist([
        (False, "Olvidar que las posiciones abiertas cuentan en el DD — no solo las cerradas"),
        (False, "Doblar posición después de una pérdida para 'recuperar' — el DD se acumula"),
        (False, "Operar sin stop loss definido antes de entrar"),
        (True,  "Calcular el máximo de riesgo por operación antes de abrir"),
        (True,  "Nunca arriesgar más del 1% del balance por trade"),
        (True,  "Cerrar todo si el DD llega al 7% — margen de seguridad del 3%"),
    ]),
    sp(),
    tip_box("En GoldTrader",
            "El panel de Max Drawdown se actualiza en tiempo real. Cada sesión muestra "
            "tu pico histórico y el margen restante antes del límite. "
            "Practica hasta que el DD nunca supere el 6% en ninguna sesión.", GREEN),
    PageBreak(),
]

# ════════════════════════════════════════
# CAP. 2 — DAILY DRAWDOWN
# ════════════════════════════════════════
story += [
    Paragraph("02 · DAILY DRAWDOWN", ST["kicker"]),
    Paragraph("5% al día — la trampa de los traders impacientes", ST["h2"]),
    Paragraph(
        "El Daily DD es el más traicionero porque se resetea cada día — "
        "pero se calcula desde el balance a las 00:00 UTC (o apertura del servidor del broker), "
        "no desde el primer trade del día. Muchos traders lo rompen el primer día "
        "tras una noche de gap.",
        ST["body"]),
    tip_box("Cálculo exacto",
            "Daily DD = (Balance 00:00 UTC − Balance mínimo del día) / Balance inicial. "
            "Si empezaste el día con €102.000 y caes a €96.899 → has roto el límite "
            "aunque tu balance inicial era €100.000.", RED),
    sp(),
    Paragraph("Protocolo anti-DD diario", ST["h3"]),
    checklist([
        (True,  "Calcula tu límite diario cada mañana: Balance de hoy × 5%"),
        (True,  "Pon una alerta o alarma cuando llegues al 3% de pérdida en el día"),
        (True,  "Si el mercado abre con gap en contra, cierra inmediatamente y espera"),
        (False, "Seguir operando después de 2 pérdidas consecutivas en el mismo día"),
        (False, "Intentar recuperar el DD del día con una posición grande al cierre"),
        (False, "Operar noticias de alto impacto (NFP, FOMC) sin reducir tamaño a la mitad"),
    ]),
    sp(),
    Paragraph("Sesiones de mayor riesgo en XAUUSD", ST["h3"]),
    Paragraph(
        "El oro (XAUUSD) tiene sus mayores movimientos en la apertura de Londres (08:00 GMT) "
        "y en las noticias americanas (13:30–15:00 GMT). "
        "Si no eres trader de noticias, evita posiciones abiertas en esas ventanas.",
        ST["body"]),
    tip_box("En GoldTrader",
            "Activa el 'Daily DD Alert' en el panel de métricas. Te avisa cuando "
            "llegas al 3% de pérdida diaria para que pares antes del límite real. "
            "Practica esta disciplina hasta que sea automática.", GREEN),
    PageBreak(),
]

# ════════════════════════════════════════
# CAP. 3 — CONSISTENCY SCORE
# ════════════════════════════════════════
story += [
    Paragraph("03 · CONSISTENCY SCORE", ST["kicker"]),
    Paragraph("La métrica que nadie enseña — y que elimina a los mejores", ST["h2"]),
    Paragraph(
        "El Consistency Score mide si tus ganancias son uniformes o si dependes de un "
        "solo día de suerte. Los prop firms buscan traders predecibles, no jugadores. "
        "Un trader que gana €8.000 en un día y pierde los otros 9 no pasa — "
        "aunque tenga beneficio neto.",
        ST["body"]),
    tip_box("Fórmula simplificada",
            "Consistency = 1 − (Mayor ganancia de un día / Ganancia total del período). "
            "Si el 60% de tus ganancias vienen de un solo día, tu score es bajo. "
            "GoldTrader lo calcula automáticamente después de cada sesión.", GOLD),
    sp(),
    Paragraph("Cómo construir consistency real", ST["h3"]),
    checklist([
        (True,  "Operar el mismo tamaño de posición todos los días (sin excepciones)"),
        (True,  "Apuntar a un objetivo diario pequeño y constante: 0.5–1% del balance"),
        (True,  "Parar en cuanto alcances el objetivo diario — no ser codicioso"),
        (True,  "Mínimo 5–8 sesiones de trading durante el challenge"),
        (False, "Intentar hacer el profit target en 1–2 días con posiciones grandes"),
        (False, "Saltarse días y luego 'recuperar' con volumen alto al final"),
        (False, "Variar el tamaño de posición según 'cómo te sientes' ese día"),
    ]),
    sp(),
    tip_box("Regla de oro",
            "Si el 25% de tus ganancias vienen de un solo día, estás en zona de riesgo. "
            "Apunta a que ningún día represente más del 20% del profit total.", GOLD),
    PageBreak(),
]

# ════════════════════════════════════════
# CAP. 4 — RISK/REWARD
# ════════════════════════════════════════
story += [
    Paragraph("04 · AVG R:R ≥ 2:1", ST["kicker"]),
    Paragraph("El hábito que separa traders rentables de los que 'casi' pasan", ST["h2"]),
    Paragraph(
        "Un R:R de 2:1 significa que por cada euro que arriesgas, ganas dos si el trade va bien. "
        "Con este ratio solo necesitas acertar el 34% de tus trades para ser rentable. "
        "Sin él, necesitas acertar más del 60% — casi imposible de forma consistente.",
        ST["body"]),
    Paragraph("Cálculo antes de cada trade", ST["h3"]),
    tip_box("Fórmula",
            "R:R = (TP − Entrada) / (Entrada − SL)\n"
            "Ejemplo: Entrada 3340, SL 3330, TP 3360\n"
            "R:R = (3360−3340) / (3340−3330) = 20/10 = 2:1 ✓", GOLD),
    sp(),
    checklist([
        (True,  "Define SL y TP antes de entrar — nunca después"),
        (True,  "Usa la Risk Calculator de GoldTrader para calcular el tamaño exacto"),
        (True,  "Si no encuentras un setup con R:R ≥ 2:1 — no operes ese día"),
        (False, "Mover el SL para 'darle más espacio' al trade"),
        (False, "Cerrar el TP antes si el precio 'casi llega' por miedo"),
        (False, "Entrar en trades de momentum sin nivel claro de SL"),
    ]),
    sp(),
    tip_box("En GoldTrader",
            "El Risk Calculator integrado calcula el R:R en tiempo real mientras "
            "ajustas Entry, SL y TP. No pulses 'Draft Buy' hasta que el R:R "
            "sea ≥ 2:1. Practica este hábito hasta que sea reflejo automático.", GREEN),
    PageBreak(),
]

# ════════════════════════════════════════
# CAP. 5 — PLAN DE 10 DÍAS
# ════════════════════════════════════════
story += [
    Paragraph("05 · PLAN DE PREPARACIÓN", ST["kicker"]),
    Paragraph("10 días en GoldTrader antes del challenge", ST["h2"]),
    Paragraph(
        "Usa GoldTrader para simular exactamente las condiciones del challenge. "
        "El objetivo no es ganar dinero virtual — es instalar los hábitos correctos "
        "antes de que haya dinero real en juego.",
        ST["body"]),
    sp(0.5),
]

# tabla plan 10 días
plan_data = [
    [Paragraph("DÍA", s("ph", fontName="Courier-Bold", fontSize=8, textColor=GOLD, leading=12)),
     Paragraph("FOCO", s("ph", fontName="Courier-Bold", fontSize=8, textColor=GOLD, leading=12)),
     Paragraph("OBJETIVO", s("ph", fontName="Courier-Bold", fontSize=8, textColor=GOLD, leading=12))],
    [Paragraph("1–2", ST["mono"]),
     Paragraph("Max DD",       s("pc", fontSize=9, textColor=SUB, leading=13)),
     Paragraph("Nunca superar 6% de DD en ninguna sesión", s("pc", fontSize=9, textColor=SUB, leading=13))],
    [Paragraph("3–4", ST["mono"]),
     Paragraph("Daily DD",     s("pc", fontSize=9, textColor=SUB, leading=13)),
     Paragraph("Poner alarma al 3%, parar antes del 5%", s("pc", fontSize=9, textColor=SUB, leading=13))],
    [Paragraph("5–6", ST["mono"]),
     Paragraph("R:R",          s("pc", fontSize=9, textColor=SUB, leading=13)),
     Paragraph("Zero trades con R:R < 2:1 — cancelar si no se cumple", s("pc", fontSize=9, textColor=SUB, leading=13))],
    [Paragraph("7–8", ST["mono"]),
     Paragraph("Consistency",  s("pc", fontSize=9, textColor=SUB, leading=13)),
     Paragraph("Mismo tamaño todos los días, profit ≤ 20%/día", s("pc", fontSize=9, textColor=SUB, leading=13))],
    [Paragraph("9–10", ST["mono"]),
     Paragraph("Full challenge", s("pc", fontSize=9, textColor=SUB, leading=13)),
     Paragraph("Simula los 10 días completos con todas las reglas activas", s("pc", fontSize=9, textColor=SUB, leading=13))],
]
plan_style = TableStyle([
    ("BACKGROUND",   (0,0), (-1,0),  HexColor("#141720")),
    ("BACKGROUND",   (0,1), (-1,-1), DARK2),
    ("LINEABOVE",    (0,0), (-1,-1), 0.4, BORDER),
    ("LINEBELOW",    (0,0), (-1,-1), 0.4, BORDER),
    ("LINEBEFORE",   (0,0), (-1,-1), 0.4, BORDER),
    ("LINEAFTER",    (0,0), (-1,-1), 0.4, BORDER),
    ("LINEBELOW",    (0,0), (-1,-2), 0.3, HexColor("#1d2029")),
    ("TOPPADDING",   (0,0), (-1,-1), 6),
    ("BOTTOMPADDING",(0,0), (-1,-1), 6),
    ("LEFTPADDING",  (0,0), (-1,-1), 10),
    ("RIGHTPADDING", (0,0), (-1,-1), 10),
    ("VALIGN",       (0,0), (-1,-1), "MIDDLE"),
])
col_w = W - 36*mm
plan_tbl = Table(plan_data, colWidths=[col_w*0.12, col_w*0.25, col_w*0.63])
plan_tbl.setStyle(plan_style)
story.append(plan_tbl)
story.append(sp())

story += [
    tip_box("Criterio de 'listo para el challenge'",
            "Completa 3 sesiones seguidas con: DD < 6%, R:R ≥ 2:1, "
            "Consistency ≥ 70 y sin romper ninguna regla. "
            "Si puedes hacerlo en simulación, puedes hacerlo con dinero real.", GREEN),
    PageBreak(),
]

# ════════════════════════════════════════
# CIERRE
# ════════════════════════════════════════
story += [
    sp(2),
    Paragraph("RESUMEN EJECUTIVO", ST["kicker"]),
    Paragraph("Las 6 reglas de oro del challenge", ST["h2"]),
    checklist([
        (True,  "Nunca arriesgues más del 1% por operación — sin excepciones"),
        (True,  "Calcula tu límite de DD diario cada mañana antes de abrir el terminal"),
        (True,  "R:R ≥ 2:1 antes de entrar — si no existe, no hay trade ese día"),
        (True,  "Objetivo diario pequeño y constante: 0.5–1% del balance"),
        (True,  "Para cuando llegues al objetivo — la codicia rompe la consistency"),
        (True,  "Practica 10 días en GoldTrader antes de pagar el challenge"),
    ]),
    sp(2),
    GoldRule(W - 36*mm),
    sp(),
    Paragraph(
        "GoldTrader · XAUUSD Simulator",
        s("ft", fontName="Helvetica-Bold", fontSize=10, textColor=GOLD,
          leading=14, alignment=TA_CENTER)),
    Paragraph(
        "goldtrader.app  ·  Datos reales Twelve Data  ·  8 timeframes  ·  20 simulaciones gratis",
        s("ft2", fontSize=8, textColor=MUTED, leading=12, alignment=TA_CENTER)),
    sp(0.5),
    Paragraph(
        "Esta guía es solo material educativo. GoldTrader no es un broker ni da asesoría financiera. "
        "El trading con fondos reales implica riesgo de pérdida de capital.",
        s("disc", fontSize=7, textColor=HexColor("#3a3f4d"), leading=10, alignment=TA_CENTER)),
]

doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
print(f"✓ PDF generado: {OUT}")
