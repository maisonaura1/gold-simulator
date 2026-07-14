'use client';
import Link from 'next/link';

export default function GuidePage() {
  return (
    <>
      <style>{`
        :root {
          --bg: #08090c; --bg2: #0f1117; --bg3: #141720;
          --border: #1d2029; --border-g: #2c2410;
          --gold: #c9a84c; --gold-lt: #ffe082;
          --green: #2dcc6f; --red: #e84040;
          --text: #e8ecf4; --sub: #8893a8; --muted: #6b7385;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text);
               font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

        .guide-wrap { max-width: 860px; margin: 0 auto; padding: 0 24px 80px; }

        /* ── NAV BAR ── */
        .g-nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(8,9,12,0.92); backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-g);
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 24px;
        }
        .g-nav-logo { display: flex; align-items: center; gap: 8px;
                       font-weight: 800; font-size: 15px; color: var(--text);
                       text-decoration: none; }
        .g-nav-logo span { color: var(--gold); }
        .btn-dl {
          display: inline-flex; align-items: center; gap-8px;
          padding: 8px 20px; border-radius: 4px; font-weight: 700;
          font-size: 13px; cursor: pointer; border: none;
          background: linear-gradient(135deg,#c9a84c,#a8893c); color: #000;
          text-decoration: none; transition: opacity .2s;
        }
        .btn-dl:hover { opacity: .85; }
        .btn-back {
          font-size: 12px; color: var(--muted); text-decoration: none;
          border: 1px solid var(--border); padding: 6px 14px; border-radius: 4px;
          transition: color .2s;
        }
        .btn-back:hover { color: var(--text); }

        /* ── COVER ── */
        .cover {
          padding: 72px 0 60px;
          border-bottom: 1px solid var(--border-g);
          margin-bottom: 56px;
        }
        .cover-kicker {
          font-family: 'Courier New', monospace;
          font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 16px;
        }
        .cover h1 {
          font-size: clamp(32px,5vw,56px); font-weight: 900;
          line-height: 1.05; letter-spacing: -.03em; margin-bottom: 6px;
          color: var(--text);
        }
        .cover h1 em { font-style: normal; color: var(--gold); }
        .cover-sub {
          font-size: 16px; color: var(--sub); line-height: 1.7;
          max-width: 620px; margin: 20px 0 32px;
        }
        .cover-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .ctag {
          font-family: 'Courier New', monospace; font-size: 11px;
          padding: 4px 12px; border-radius: 3px;
          background: var(--bg2); border: 1px solid var(--border);
          color: var(--muted);
        }

        /* ── ÍNDICE ── */
        .toc { margin-bottom: 56px; }
        .toc-title {
          font-family: 'Courier New', monospace; font-size: 10px;
          letter-spacing: .12em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 16px;
        }
        .toc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
        .toc-item {
          display: flex; align-items: baseline; gap: 10px;
          padding: 8px 12px; border-radius: 4px;
          background: var(--bg2); border: 1px solid var(--border);
          text-decoration: none; transition: border-color .2s;
        }
        .toc-item:hover { border-color: var(--border-g); }
        .toc-num { font-family: 'Courier New', monospace; font-size: 10px;
                    color: var(--gold); min-width: 20px; }
        .toc-label { font-size: 12px; color: var(--sub); }

        /* ── CAPÍTULOS ── */
        .chapter { margin-bottom: 64px; scroll-margin-top: 80px; }
        .ch-kicker {
          font-family: 'Courier New', monospace; font-size: 10px;
          letter-spacing: .12em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 8px;
        }
        .ch-title {
          font-size: clamp(20px,3vw,28px); font-weight: 800;
          letter-spacing: -.02em; line-height: 1.2;
          color: var(--text); margin-bottom: 16px;
          padding-bottom: 16px; border-bottom: 1px solid var(--border-g);
        }
        .ch-body { font-size: 14px; color: var(--sub); line-height: 1.8; margin-bottom: 16px; }
        .ch-body strong { color: var(--text); }
        .ch-body em { color: var(--gold); font-style: normal; }

        /* ── BOXES ── */
        .box {
          border-radius: 6px; padding: 16px 20px; margin: 16px 0;
          background: var(--bg2); border: 1px solid var(--border);
          border-top: 2px solid var(--gold);
        }
        .box.green { border-top-color: var(--green); }
        .box.red   { border-top-color: var(--red); }
        .box-title { font-weight: 700; font-size: 12px; color: var(--text); margin-bottom: 6px; }
        .box-body  { font-size: 13px; color: var(--sub); line-height: 1.7; }
        .box-body strong { color: var(--text); }
        .box-body code {
          font-family: 'Courier New', monospace; font-size: 12px;
          color: var(--gold); background: var(--bg3);
          padding: 1px 6px; border-radius: 3px;
        }

        /* ── RULE CARDS ── */
        .rules { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 16px 0; }
        .rule-card {
          padding: 14px 16px; border-radius: 5px;
          background: var(--bg2);
          display: flex; flex-direction: column; gap: 4px;
        }
        .rule-card.ok  { border: 1px solid rgba(45,204,111,.3); }
        .rule-card.bad { border: 1px solid rgba(232,64,64,.3); }
        .rule-label { font-family: 'Courier New', monospace; font-size: 10px;
                       letter-spacing: .08em; text-transform: uppercase; }
        .rule-card.ok  .rule-label { color: var(--green); }
        .rule-card.bad .rule-label { color: var(--red); }
        .rule-value { font-family: 'Courier New', monospace; font-size: 16px;
                       font-weight: 700; color: var(--text); }
        .rule-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }

        /* ── CHECKLIST ── */
        .checklist { margin: 14px 0; display: flex; flex-direction: column; gap: 0; }
        .cl-item {
          display: flex; align-items: baseline; gap: 12px;
          padding: 9px 14px;
          border: 1px solid var(--border);
          border-bottom: none;
          background: var(--bg2); font-size: 13px; color: var(--sub);
        }
        .cl-item:first-child { border-radius: 5px 5px 0 0; }
        .cl-item:last-child  { border-bottom: 1px solid var(--border); border-radius: 0 0 5px 5px; }
        .cl-mark { font-family: 'Courier New', monospace; font-size: 11px;
                    font-weight: 700; flex-shrink: 0; min-width: 14px; }
        .cl-mark.ok  { color: var(--green); }
        .cl-mark.bad { color: var(--red); }

        /* ── FORMULA ── */
        .formula {
          font-family: 'Courier New', monospace; font-size: 13px;
          color: var(--gold); background: var(--bg3);
          border: 1px solid var(--border-g); border-radius: 5px;
          padding: 14px 18px; margin: 14px 0; line-height: 1.8;
        }

        /* ── TABLE ── */
        .gtable { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 13px; }
        .gtable th {
          background: var(--bg3); color: var(--gold);
          font-family: 'Courier New', monospace; font-size: 10px;
          letter-spacing: .08em; text-transform: uppercase;
          padding: 10px 14px; text-align: left;
          border: 1px solid var(--border);
        }
        .gtable td {
          padding: 9px 14px; color: var(--sub); line-height: 1.5;
          border: 1px solid var(--border); background: var(--bg2);
          vertical-align: top;
        }
        .gtable td strong { color: var(--text); }
        .gtable td.mono { font-family: 'Courier New', monospace;
                           font-size: 12px; color: var(--gold); }
        .gtable tr:hover td { background: var(--bg3); }

        /* ── DIVIDER ── */
        .divider { border: none; border-top: 1px solid var(--border-g);
                    margin: 40px 0; }

        /* ── CTA FINAL ── */
        .final-cta {
          margin-top: 64px; padding: 48px 36px; text-align: center;
          border-radius: 8px; border: 1px solid var(--border-g);
          background: var(--bg2);
          background-image: radial-gradient(ellipse at center,
            rgba(201,168,76,.08) 0%, transparent 70%);
        }
        .final-cta h2 { font-size: 26px; font-weight: 900; margin-bottom: 12px;
                          letter-spacing: -.02em; }
        .final-cta h2 span { color: var(--gold); }
        .final-cta p { color: var(--sub); font-size: 14px; line-height: 1.7;
                         margin-bottom: 28px; }
        .cta-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn-primary {
          padding: 12px 28px; border-radius: 4px; font-weight: 700;
          font-size: 14px; background: linear-gradient(135deg,#c9a84c,#a8893c);
          color: #000; text-decoration: none; transition: opacity .2s;
        }
        .btn-primary:hover { opacity: .85; }
        .btn-sec {
          padding: 12px 28px; border-radius: 4px; font-size: 14px;
          border: 1px solid var(--border); color: var(--muted);
          text-decoration: none; transition: color .2s;
        }
        .btn-sec:hover { color: var(--text); }

        /* ── PRINT ── */
        @media print {
          .g-nav, .btn-dl, .btn-back, .final-cta .cta-row { display: none !important; }
          body { background: white; color: #111; }
          .cover h1, .ch-title { color: #111; }
          .ch-body, .cl-item, .gtable td, .box-body { color: #444; }
          .box, .rule-card, .cl-item, .gtable td { background: #f8f8f8 !important; border-color: #ddd !important; }
          .chapter { page-break-inside: avoid; }
          .gtable { page-break-inside: auto; }
        }

        @media (max-width: 640px) {
          .toc-grid { grid-template-columns: 1fr; }
          .rules { grid-template-columns: 1fr; }
          .g-nav { padding: 12px 16px; }
        }
      `}</style>

      {/* NAV */}
      <nav className="g-nav">
        <Link href="/" className="g-nav-logo">
          ◆ Gold<span>Trader</span>
        </Link>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/" className="btn-back">← Volver</Link>
          <button className="btn-dl" onClick={() => window.print()}>
            ↓ Descargar PDF
          </button>
        </div>
      </nav>

      <div className="guide-wrap">

        {/* PORTADA */}
        <div className="cover">
          <div className="cover-kicker">GoldTrader · Challenge Prep Guide · Edición 2026</div>
          <h1>Cómo operar oro XAUUSD<br /><em>desde cero hasta el challenge</em></h1>
          <p className="cover-sub">
            15 capítulos esenciales sobre trading de oro, gestión de riesgo,
            uso del simulador GoldTrader y preparación completa para superar
            un challenge de prop firm (FTMO, Funded Next, The5ers).
          </p>
          <div className="cover-tags">
            {['15 capítulos', 'XAUUSD · Oro', 'Gestión de riesgo', 'Prop firm prep',
              'Simulador incluido', 'Principiante → Intermedio'].map(t => (
              <span key={t} className="ctag">{t}</span>
            ))}
          </div>
        </div>

        {/* ÍNDICE */}
        <div className="toc">
          <div className="toc-title">Índice de contenidos</div>
          <div className="toc-grid">
            {[
              [1,'¿Qué es el trading de oro?'],
              [2,'XAUUSD — el mercado del oro'],
              [3,'Conceptos básicos: bid, ask, spread, pip'],
              [4,'Tipos de órdenes'],
              [5,'Stop Loss y Take Profit'],
              [6,'Risk/Reward ratio'],
              [7,'Position sizing y gestión de riesgo'],
              [8,'Análisis técnico básico'],
              [9,'Los 8 timeframes de GoldTrader'],
              [10,'Las 4 reglas del prop firm challenge'],
              [11,'Max Drawdown — la regla más eliminatoria'],
              [12,'Daily Drawdown — la trampa diaria'],
              [13,'Consistency Score'],
              [14,'Cómo usar el simulador GoldTrader'],
              [15,'Plan de 10 días antes del challenge'],
            ].map(([n, label]) => (
              <a key={n} href={`#cap${n}`} className="toc-item">
                <span className="toc-num">0{n}</span>
                <span className="toc-label">{label as string}</span>
              </a>
            ))}
          </div>
        </div>

        <hr className="divider" />

        {/* ── CAP 1 ── */}
        <div className="chapter" id="cap1">
          <div className="ch-kicker">Capítulo 01</div>
          <h2 className="ch-title">¿Qué es el trading de oro?</h2>
          <p className="ch-body">
            El trading de oro consiste en especular sobre el precio del oro sin poseerlo físicamente.
            No compras lingotes — compras y vendes <strong>contratos financieros</strong> cuyo valor
            sube y baja según el precio spot del oro en los mercados internacionales.
          </p>
          <p className="ch-body">
            El oro es uno de los activos más operados del mundo por tres razones:
            <strong> liquidez alta</strong> (siempre hay compradores y vendedores),
            <strong> movimientos amplios</strong> (oscilaciones de $10–$50 diarios son comunes) y
            <strong> reacción predecible</strong> a noticias macroeconómicas.
          </p>
          <div className="box">
            <div className="box-title">¿Por qué el oro y no otro activo?</div>
            <p className="box-body">
              Los prop firms (FTMO, Funded Next, The5ers) prefieren traders especializados
              en <strong>un solo instrumento</strong>. El oro (XAUUSD) es la elección más común
              porque sus movimientos son técnicamente limpios, respeta niveles de soporte
              y resistencia, y tiene sesiones de liquidez bien definidas.
            </p>
          </div>
          <div className="box green">
            <div className="box-title">Ventaja del oro sobre el forex</div>
            <p className="box-body">
              El oro mueve entre <strong>$8 y $40 dólares por día</strong> en condiciones normales.
              Con un lote estándar (100 oz), cada dólar de movimiento vale $100.
              Esto permite buscar setups de alto R:R con stops ajustados.
            </p>
          </div>
        </div>

        {/* ── CAP 2 ── */}
        <div className="chapter" id="cap2">
          <div className="ch-kicker">Capítulo 02</div>
          <h2 className="ch-title">XAUUSD — el mercado del oro</h2>
          <p className="ch-body">
            <strong>XAU</strong> es el símbolo ISO del oro (del latín <em>aurum</em>).
            <strong> USD</strong> es el dólar americano. El par XAUUSD indica cuántos dólares
            cuesta 1 onza troy de oro (~31,1 gramos).
          </p>
          <table className="gtable">
            <thead>
              <tr>
                <th>Sesión</th>
                <th>Horario (GMT)</th>
                <th>Volatilidad</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Asiática','00:00–08:00','Baja','Consolidación. Pocos setups.'],
                ['Londres','08:00–12:00','Alta','Mayor liquidez. Rupturas frecuentes.'],
                ['Solapamiento','12:00–16:00','Muy alta','Zona de máximo movimiento.'],
                ['Nueva York','13:30–20:00','Alta','Noticias americanas. Alto riesgo.'],
                ['Cierre NY','20:00–00:00','Baja','Evitar operar, liqudez cae.'],
              ].map(([s,h,v,n]) => (
                <tr key={s}>
                  <td><strong>{s}</strong></td>
                  <td className="mono">{h}</td>
                  <td style={{color: v==='Muy alta'?'var(--red)':v==='Alta'?'var(--gold)':'var(--muted)'}}>{v}</td>
                  <td>{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="box red">
            <div className="box-title">⚠ Cuidado con las noticias</div>
            <p className="box-body">
              El oro reacciona fuertemente a: <strong>NFP</strong> (primer viernes de mes, 13:30 GMT),
              decisiones de la <strong>FED</strong> (tipos de interés), <strong>IPC</strong> (inflación americana)
              y tensiones geopolíticas. En esos momentos el spread se dispara y el slippage es alto.
              Como principiante: <strong>no tengas posiciones abiertas en esas ventanas</strong>.
            </p>
          </div>
        </div>

        {/* ── CAP 3 ── */}
        <div className="chapter" id="cap3">
          <div className="ch-kicker">Capítulo 03</div>
          <h2 className="ch-title">Conceptos básicos: bid, ask, spread, pip, lote</h2>
          <table className="gtable">
            <thead>
              <tr><th>Término</th><th>Definición</th><th>Ejemplo XAUUSD</th></tr>
            </thead>
            <tbody>
              {[
                ['Bid','Precio al que el mercado compra (tú vendes)','3342.40'],
                ['Ask','Precio al que el mercado vende (tú compras)','3342.60'],
                ['Spread','Diferencia entre Ask y Bid (coste de la operación)','0.20 ($)'],
                ['Pip','Mínima variación de precio en XAUUSD','$0.01 (1 centavo)'],
                ['Lote estándar','Unidad de volumen = 100 onzas troy','Cada $1 = $100 ganancia/pérdida'],
                ['Minilote','0.10 lotes = 10 onzas','Cada $1 = $10'],
                ['Microlote','0.01 lotes = 1 onza','Cada $1 = $1'],
              ].map(([t,d,e]) => (
                <tr key={t}><td><strong>{t}</strong></td><td>{d}</td><td className="mono">{e}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="box">
            <div className="box-title">Cálculo de P&L (pérdida/ganancia)</div>
            <p className="box-body">
              <code>P&L = (Precio cierre − Precio entrada) × Lotes × 100</code><br />
              Ejemplo: Compra 0.10 lotes a 3340, cierra a 3350.<br />
              P&L = (3350 − 3340) × 0.10 × 100 = <strong style={{color:'var(--green)'}}>+$100</strong>
            </p>
          </div>
        </div>

        {/* ── CAP 4 ── */}
        <div className="chapter" id="cap4">
          <div className="ch-kicker">Capítulo 04</div>
          <h2 className="ch-title">Tipos de órdenes</h2>
          <p className="ch-body">
            Existen tres tipos de órdenes fundamentales que todo trader debe dominar antes de operar.
          </p>
          <table className="gtable">
            <thead>
              <tr><th>Orden</th><th>Cómo funciona</th><th>Cuándo usar</th></tr>
            </thead>
            <tbody>
              {[
                ['Market Order','Entra al precio actual del mercado inmediatamente.','Cuando necesitas entrar ahora. Cuidado con el spread.'],
                ['Limit Order','Entra solo si el precio llega a tu nivel fijado (más favorable).','Para comprar en soporte o vender en resistencia.'],
                ['Stop Order','Entra cuando el precio supera un nivel (en la dirección del movimiento).','Para operar rupturas de niveles clave.'],
                ['Stop Loss','Orden de cierre automático si el trade va en tu contra.','Obligatoria en cada operación. Sin excepción.'],
                ['Take Profit','Orden de cierre automático cuando alcanzas tu objetivo.','Define el TP antes de entrar.'],
              ].map(([o,c,u]) => (
                <tr key={o}><td><strong>{o}</strong></td><td>{c}</td><td>{u}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="box green">
            <div className="box-title">Regla de oro</div>
            <p className="box-body">
              <strong>Nunca entres en una operación sin tener definidos SL y TP antes de pulsar el botón.</strong>
              En GoldTrader, el sistema te obliga a definirlos en el Risk Calculator antes de generar el draft.
            </p>
          </div>
        </div>

        {/* ── CAP 5 ── */}
        <div className="chapter" id="cap5">
          <div className="ch-kicker">Capítulo 05</div>
          <h2 className="ch-title">Stop Loss y Take Profit</h2>
          <p className="ch-body">
            El <strong>Stop Loss (SL)</strong> es el nivel donde aceptas que el trade está equivocado
            y cierras con pérdida controlada. El <strong>Take Profit (TP)</strong> es el nivel donde
            recogés beneficios automáticamente.
          </p>
          <div className="box red">
            <div className="box-title">Cómo colocar el Stop Loss</div>
            <p className="box-body">
              Coloca el SL en un nivel técnico <strong>invalida tu tesis</strong>: por debajo
              de un soporte (en compras) o por encima de una resistencia (en ventas).
              <strong> Nunca</strong> coloques el SL solo por un importe en dólares sin base técnica.
            </p>
          </div>
          <div className="box green">
            <div className="box-title">Cómo colocar el Take Profit</div>
            <p className="box-body">
              El TP debe ser al menos <strong>2× la distancia del SL</strong> (R:R ≥ 2:1).
              Colócalo antes de una resistencia evidente (no encima). Puedes usar un TP parcial
              al 1:1 para asegurar beneficios y dejar correr el resto.
            </p>
          </div>
          <div className="formula">
            Ejemplo BUY:<br />
            Entrada:  3340.00<br />
            SL:       3330.00  (10 puntos de riesgo)<br />
            TP:       3360.00  (20 puntos de objetivo)<br />
            R:R:      2:1  ✓
          </div>
        </div>

        {/* ── CAP 6 ── */}
        <div className="chapter" id="cap6">
          <div className="ch-kicker">Capítulo 06</div>
          <h2 className="ch-title">Risk/Reward Ratio</h2>
          <p className="ch-body">
            El R:R es la relación entre lo que arriesgas y lo que puedes ganar. Con un R:R de 2:1
            y un acierto del 40% ya eres <strong>rentable a largo plazo</strong>.
          </p>
          <table className="gtable">
            <thead>
              <tr><th>R:R</th><th>% acierto mínimo para ser rentable</th><th>Recomendado</th></tr>
            </thead>
            <tbody>
              {[
                ['1:1','50%','No recomendado'],
                ['1.5:1','40%','Mínimo aceptable'],
                ['2:1','34%','✓ Estándar prop firm'],
                ['3:1','25%','✓ Excelente'],
                ['5:1','17%','Solo setups muy claros'],
              ].map(([r,p,rec]) => (
                <tr key={r}>
                  <td className="mono">{r}</td>
                  <td>{p}</td>
                  <td style={{color: rec.includes('✓') ? 'var(--green)' : 'var(--muted)'}}>{rec}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="formula">
            R:R = (TP − Entrada) / (Entrada − SL)<br />
            Si TP − Entrada = 20 y Entrada − SL = 10 → R:R = 2.0
          </div>
        </div>

        {/* ── CAP 7 ── */}
        <div className="chapter" id="cap7">
          <div className="ch-kicker">Capítulo 07</div>
          <h2 className="ch-title">Position Sizing y Gestión de Riesgo</h2>
          <p className="ch-body">
            El <strong>position sizing</strong> determina cuántos lotes operar para que,
            si el SL se activa, no pierdas más del porcentaje que decidiste arriesgar por operación.
          </p>
          <div className="formula">
            Lotes = (Balance × % Riesgo) / (Distancia SL en $ × 100)<br /><br />
            Ejemplo: Balance €100.000 · Riesgo 1% · SL = 10 puntos<br />
            Lotes = (100.000 × 0.01) / (10 × 100) = 1.000 / 1.000 = 1.0 lote<br />
            Si el SL se activa → pierdes $1.000 (1% del balance) ✓
          </div>
          <div className="box">
            <div className="box-title">Reglas básicas de gestión de riesgo</div>
            <div className="checklist">
              {[
                [true,'Nunca arriesgar más del 1% del balance por operación'],
                [true,'Máximo 2–3 posiciones abiertas simultáneamente'],
                [true,'Si llegas al 3% de pérdida en el día, parar'],
                [false,'Doblar tamaño para recuperar pérdidas (martingala)'],
                [false,'Operar sin SL aunque "estés seguro"'],
                [false,'Arriesgar el mismo porcentaje en noticias de impacto alto'],
              ].map(([ok, text], i) => (
                <div key={i} className="cl-item">
                  <span className={`cl-mark ${ok ? 'ok' : 'bad'}`}>{ok ? '✓' : '✗'}</span>
                  <span>{text as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CAP 8 ── */}
        <div className="chapter" id="cap8">
          <div className="ch-kicker">Capítulo 08</div>
          <h2 className="ch-title">Análisis Técnico Básico para XAUUSD</h2>
          <p className="ch-body">
            El análisis técnico estudia el <strong>precio y el volumen</strong> para identificar
            zonas donde es probable que el mercado reaccione. En XAUUSD funciona bien porque
            el oro tiene gran cantidad de participantes institucionales que respetan los mismos niveles.
          </p>
          <table className="gtable">
            <thead>
              <tr><th>Concepto</th><th>Qué es</th><th>Cómo usar en XAUUSD</th></tr>
            </thead>
            <tbody>
              {[
                ['Soporte','Nivel donde el precio ha rebotado hacia arriba varias veces','Busca compras cuando el precio llega a un soporte + confirmación de vela'],
                ['Resistencia','Nivel donde el precio ha rebotado hacia abajo varias veces','Busca ventas cuando el precio llega a una resistencia + rechazo'],
                ['Tendencia','Dirección general del precio: alcista, bajista o lateral','Opera en la dirección de la tendencia del H4/D1'],
                ['Velas japonesas','Representación gráfica de apertura, cierre, máximo y mínimo','Doji, engulfing, pin bar — señales de posible reversión'],
                ['Mínimos y máximos','Estructura del precio: HH/HL (alcista) o LH/LL (bajista)','Identifica la estructura antes de entrar'],
                ['Niveles redondos','Precios como 3300, 3350, 3400 actúan como imán','Evita poner TP exactamente en un nivel redondo'],
              ].map(([c,q,u]) => (
                <tr key={c}><td><strong>{c}</strong></td><td>{q}</td><td>{u}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="box green">
            <div className="box-title">Setup más sencillo para empezar</div>
            <p className="box-body">
              1. Identifica la tendencia en H4 o D1.<br />
              2. Espera un pullback a un soporte/resistencia clave.<br />
              3. Busca una vela de confirmación (pin bar, engulfing).<br />
              4. Entra en la dirección de la tendencia con SL bajo el soporte y TP en la resistencia siguiente.
            </p>
          </div>
        </div>

        {/* ── CAP 9 ── */}
        <div className="chapter" id="cap9">
          <div className="ch-kicker">Capítulo 09</div>
          <h2 className="ch-title">Los 8 Timeframes de GoldTrader</h2>
          <p className="ch-body">
            GoldTrader incluye 8 temporalidades de datos reales de XAUUSD.
            Cada timeframe tiene un propósito diferente.
          </p>
          <table className="gtable">
            <thead>
              <tr><th>TF</th><th>Uso</th><th>Perfil de trader</th></tr>
            </thead>
            <tbody>
              {[
                ['M1','Scalping intradía, muy corto plazo','Avanzado — alta velocidad, spread impacta más'],
                ['M5','Scalping / day trading rápido','Intermedio — setups de 5–15 minutos'],
                ['M15','Day trading estándar','Principiante/Intermedio — el más popular en prop firms'],
                ['H1','Swing intradía','Intermedio — setups que duran horas'],
                ['H4','Swing trading','Recomendado para challenge — menos ruido'],
                ['D1','Position trading','Visión de tendencia, no para entries directos'],
                ['W1','Largo plazo','Solo para contexto macro'],
                ['MN','Muy largo plazo','Solo para niveles históricos clave'],
              ].map(([tf,uso,perfil]) => (
                <tr key={tf}>
                  <td className="mono">{tf}</td>
                  <td>{uso}</td>
                  <td style={{color:'var(--sub)'}}>{perfil}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="box">
            <div className="box-title">Multi-timeframe analysis (MTA)</div>
            <p className="box-body">
              Usa <strong>H4 o D1</strong> para identificar la tendencia y los niveles clave.
              Usa <strong>M15 o H1</strong> para el entry preciso.
              Nunca operes contra la tendencia del timeframe superior.
            </p>
          </div>
        </div>

        {/* ── CAP 10 ── */}
        <div className="chapter" id="cap10">
          <div className="ch-kicker">Capítulo 10</div>
          <h2 className="ch-title">Las 4 Reglas del Prop Firm Challenge</h2>
          <p className="ch-body">
            Los prop firms evalúan a los traders con 4 métricas clave.
            Romper cualquiera de las dos primeras <strong>cancela el challenge inmediatamente</strong>.
          </p>
          <div className="rules">
            <div className="rule-card ok">
              <span className="rule-label">✓ Max Drawdown</span>
              <span className="rule-value">&lt; 10%</span>
              <span className="rule-desc">Del balance inicial. Incluye posiciones abiertas. Límite duro.</span>
            </div>
            <div className="rule-card ok">
              <span className="rule-label">✓ Daily Drawdown</span>
              <span className="rule-value">&lt; 5%</span>
              <span className="rule-desc">Del balance del día. Se resetea a las 00:00 UTC. Límite duro.</span>
            </div>
            <div className="rule-card bad">
              <span className="rule-label">✗ Consistency Score</span>
              <span className="rule-value">≥ 70/100</span>
              <span className="rule-desc">Mide uniformidad de ganancias. No puede depender de un solo día.</span>
            </div>
            <div className="rule-card bad">
              <span className="rule-label">✗ Avg R:R</span>
              <span className="rule-value">≥ 2:1</span>
              <span className="rule-desc">Media de todas las operaciones. Revisado al final del challenge.</span>
            </div>
          </div>
          <div className="box red">
            <div className="box-title">El 85% falla por esto</div>
            <p className="box-body">
              La mayoría no falla por mala estrategia — falla porque <strong>no entiende las reglas exactas</strong>.
              Un trade sin SL puede romper el Max DD en un solo movimiento.
              Un día malo puede romper el Daily DD antes del almuerzo.
            </p>
          </div>
        </div>

        {/* ── CAP 11 ── */}
        <div className="chapter" id="cap11">
          <div className="ch-kicker">Capítulo 11</div>
          <h2 className="ch-title">Max Drawdown — la regla más eliminatoria</h2>
          <p className="ch-body">
            El Max DD mide la máxima caída desde el pico histórico del balance hasta el momento actual.
            Si en algún punto del challenge tu balance cae un 10% desde su máximo — el challenge termina.
          </p>
          <div className="formula">
            Max DD = (Pico de balance − Balance actual) / Balance inicial × 100<br /><br />
            Ejemplo: Balance inicial €100.000<br />
            Pico alcanzado: €103.000<br />
            Si balance cae a €92.700 → Max DD = (103.000−92.700)/100.000 = 10.3% ✗ ELIMINADO
          </div>
          <p className="ch-body">
            Nota: el límite se calcula siempre sobre el <strong>balance inicial</strong>, no sobre el pico.
            Pero el drawdown se mide desde el pico. Por eso un racha buena seguida de una mala
            puede eliminarte antes de lo que crees.
          </p>
          <div className="box">
            <div className="box-title">Protocolo de protección</div>
            <div className="checklist">
              {[
                [true,'Arriesga máximo 1% por trade — con 10 trades perdidos seguidos aún tienes margen'],
                [true,'Cierra todo si el DD llega al 7% — el 3% restante es tu margen de seguridad'],
                [true,'Nunca promedies pérdidas (añadir lotes a un trade perdedor)'],
                [false,'Usar apalancamiento alto para "recuperar más rápido"'],
                [false,'Operar sin SL aunque el setup "sea obvio"'],
              ].map(([ok, text], i) => (
                <div key={i} className="cl-item">
                  <span className={`cl-mark ${ok ? 'ok' : 'bad'}`}>{ok ? '✓' : '✗'}</span>
                  <span>{text as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CAP 12 ── */}
        <div className="chapter" id="cap12">
          <div className="ch-kicker">Capítulo 12</div>
          <h2 className="ch-title">Daily Drawdown — la trampa diaria</h2>
          <p className="ch-body">
            El Daily DD es el más traicionero: se calcula desde el <strong>balance a las 00:00 UTC</strong>
            de cada día, no desde el inicio del challenge. Se resetea cada día — pero si lo rompes,
            el challenge termina aunque el Max DD esté bien.
          </p>
          <div className="formula">
            Daily DD = (Balance 00:00 UTC − Balance mínimo del día) / Balance inicial × 100<br /><br />
            Día 3: Balance a las 00:00 = €102.000<br />
            Límite Daily DD = 5% de €100.000 = €5.000<br />
            Si balance cae a €96.999 → €102.000 − €96.999 = €5.001 ✗ ELIMINADO
          </div>
          <div className="box red">
            <div className="box-title">El error más común</div>
            <p className="box-body">
              Los traders que tuvieron un día bueno (balance subió a €102k) creen que
              "tienen más margen" el día siguiente. <strong>El cálculo siempre es sobre
              el balance inicial (€100k)</strong>, no sobre el balance del día anterior.
              Tu límite diario es siempre €5.000 de pérdida máxima.
            </p>
          </div>
          <div className="box">
            <div className="box-title">Rutina matutina anti-DD</div>
            <p className="box-body">
              Antes de abrir el terminal:<br />
              1. Anota el balance actual.<br />
              2. Calcula: balance actual × 5% = pérdida máxima del día.<br />
              3. Pon una alarma en GoldTrader al 3% para parar antes del límite real.
            </p>
          </div>
        </div>

        {/* ── CAP 13 ── */}
        <div className="chapter" id="cap13">
          <div className="ch-kicker">Capítulo 13</div>
          <h2 className="ch-title">Consistency Score</h2>
          <p className="ch-body">
            Los prop firms no quieren traders que ganen €10.000 en un día y pierdan los otros nueve.
            Quieren traders <strong>predecibles y controlados</strong>. El Consistency Score
            mide exactamente eso.
          </p>
          <div className="formula">
            Consistency ≈ 1 − (Mayor ganancia de un día / Ganancia total del período)<br /><br />
            Malo: Ganas €8.000 un día y €500 en los otros 9 días → 94% en un día → Score bajo<br />
            Bueno: Ganas entre €800–€1.200 cada día → distribución uniforme → Score alto ✓
          </div>
          <table className="gtable">
            <thead>
              <tr><th>Hábito</th><th>Impacto en Consistency</th></tr>
            </thead>
            <tbody>
              {[
                ['Mismo tamaño de posición todos los días','Muy positivo — resultados uniformes'],
                ['Objetivo diario pequeño y constante (0.5–1%)','Muy positivo'],
                ['Parar cuando alcanzas el objetivo','Positivo — evita días de sobreoperación'],
                ['Operar solo 1–3 setups al día de calidad','Positivo — filtro de calidad'],
                ['Doblar tamaño un día para "compensar"','Muy negativo — volatilidad de resultados'],
                ['Operar 20 trades el viernes para "llegar al profit target"','Muy negativo'],
              ].map(([h,i]) => (
                <tr key={h}><td>{h}</td>
                <td style={{color: i.includes('negativo') ? 'var(--red)' : 'var(--green)'}}>{i}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── CAP 14 ── */}
        <div className="chapter" id="cap14">
          <div className="ch-kicker">Capítulo 14</div>
          <h2 className="ch-title">Cómo usar el Simulador GoldTrader</h2>
          <p className="ch-body">
            GoldTrader simula el entorno exacto de un prop firm challenge usando
            <strong> datos reales históricos de XAUUSD</strong> de Twelve Data.
            Cada sesión es reproducible — puedes repetir el mismo día para trabajar el mismo setup.
          </p>
          <table className="gtable">
            <thead>
              <tr><th>Sección</th><th>Qué hace</th><th>Cómo usarla</th></tr>
            </thead>
            <tbody>
              {[
                ['Bullion Desk','Mesa de trading con gráfico XAUUSD en tiempo real simulado','Selecciona timeframe, observa precio, identifica setups'],
                ['Risk Calculator','Calcula posición, SL, TP y R:R automáticamente','Rellena Entry, SL y TP — verifica que R:R ≥ 2:1 antes de operar'],
                ['Order Entry','Genera drafts de compra/venta con BUY/SELL','Crea el draft, revísalo, confírmalo — simula el flujo real'],
                ['Order Blotter','Lista de todas tus órdenes: DRAFT / SUBMITTED / APPROVED','Revisa el estado de cada trade y tu historial'],
                ['Trader Score','Puntuación de 0–100 basada en tus métricas','Objetivo: mantener ≥ 70 de forma constante'],
                ['Performance Analytics','Equity curve, win rate, drawdown, consistency','Analiza después de cada sesión qué mejorar'],
                ['Daily DD Alert','Alerta cuando llegas al límite diario','Actívala siempre. Para cuando suene.'],
              ].map(([s,q,u]) => (
                <tr key={s}><td><strong>{s}</strong></td><td>{q}</td><td>{u}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="box green">
            <div className="box-title">Flujo recomendado por sesión</div>
            <p className="box-body">
              1. Revisa métricas del día anterior.<br />
              2. Calcula límite Daily DD del día.<br />
              3. Analiza el chart en H4 para contexto.<br />
              4. Busca setups en M15/H1 con R:R ≥ 2:1.<br />
              5. Usa el Risk Calculator antes de cada trade.<br />
              6. Para cuando llegues al objetivo o al límite del día.<br />
              7. Revisa el Trader Score y anota qué mejorar.
            </p>
          </div>
        </div>

        {/* ── CAP 15 ── */}
        <div className="chapter" id="cap15">
          <div className="ch-kicker">Capítulo 15</div>
          <h2 className="ch-title">Plan de 10 Días antes del Challenge</h2>
          <p className="ch-body">
            Antes de pagar un challenge real, completa este plan de preparación en GoldTrader.
            El objetivo no es ganar dinero virtual — es <strong>instalar los hábitos correctos</strong>.
          </p>
          <table className="gtable">
            <thead>
              <tr><th>Días</th><th>Foco</th><th>Criterio de éxito</th></tr>
            </thead>
            <tbody>
              {[
                ['1–2','Conceptos básicos + Risk Calculator','Cada trade tiene SL, TP y R:R ≥ 2:1 antes de entrar'],
                ['3–4','Max Drawdown','Ninguna sesión supera 6% de DD total'],
                ['5–6','Daily Drawdown','Activas la alerta al 3% y paras en todos los casos'],
                ['7–8','Consistency','Mismo tamaño todos los días, ningún día > 20% del profit total'],
                ['9–10','Challenge completo','10 días con todas las reglas — Trader Score ≥ 70 constante'],
              ].map(([d,f,c]) => (
                <tr key={d}>
                  <td className="mono">{d}</td>
                  <td><strong>{f}</strong></td>
                  <td style={{color:'var(--sub)'}}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="box green">
            <div className="box-title">Criterio de "listo para el challenge"</div>
            <p className="box-body">
              Completa <strong>3 sesiones consecutivas</strong> con todos estos checks en verde:
              DD &lt; 6% · R:R ≥ 2:1 en todos los trades · Consistency ≥ 70 · Daily DD no roto.
              Si puedes repetirlo 3 días seguidos en simulación, estás listo para dinero real.
            </p>
          </div>
          <div className="box red">
            <div className="box-title">La regla más importante de todas</div>
            <p className="box-body">
              <strong>Un challenge de €300 que fallas cuesta más que 4 años de GoldTrader Pro.</strong>
              Practica hasta que las reglas sean reflejo automático. El simulador existe
              exactamente para que el primer error lo cometas sin consecuencias reales.
            </p>
          </div>
        </div>

        <hr className="divider" />

        {/* CIERRE */}
        <div className="final-cta">
          <h2>¿Listo para empezar a <span>entrenar</span>?</h2>
          <p>
            Tus primeras 20 simulaciones son gratis. Sin tarjeta de crédito.<br />
            Acceso inmediato a todos los timeframes y el Risk Calculator.
          </p>
          <div className="cta-row">
            <Link href="/auth/register" className="btn-primary">
              Empezar gratis — 20 simulaciones →
            </Link>
            <Link href="/" className="btn-sec">
              Ver la web
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
