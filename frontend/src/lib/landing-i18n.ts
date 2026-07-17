export type LandingLang = 'en' | 'es';

export const landingT = {
  en: {
    // Nav
    navFeatures: 'Features',
    navPricing: 'Pricing',
    navFaq: 'FAQ',
    navLogin: 'Log in',
    navStart: 'Start free →',

    // Hero pill
    heroPill: 'Beta access open',
    heroPillTraders: (n: number) => `· ${n} active traders`,

    // Hero headline
    heroH1a: 'Would you pass the challenge',
    heroH1b: 'before risking real money?',

    // Hero subtext
    heroSub: 'Prop firm challenges (FTMO, Funded Next) cost between <strong>€150–€1,500</strong> and <strong>85% fail in the first week</strong>. GoldTrader lets you practice exactly the metrics they evaluate, on real XAUUSD data, without risking anything.',

    // Hero metrics
    metricMaxDD: 'Max DD',
    metricDailyDD: 'Daily DD',
    metricConsistency: 'Consistency',
    metricAvgRR: 'Avg R:R',

    // Social proof
    socialProof: (n: number) => `${n.toLocaleString()} simulations completed by traders like you`,

    // CTAs
    ctaStart: 'Start free — 20 simulations →',
    ctaDemo: 'See demo ↓',

    // Trust text
    trustNoCard: 'No credit card required',
    trustData: 'Real Twelve Data feed',
    trustFree: '20 free simulations',
    trustRefund: '30-day guarantee',

    // Scroll hint (aria)
    scrollHint: 'Scroll down',

    // Stats bar
    statsXAUUSD: 'XAUUSD',
    statsXAUUSDLabel: 'Gold Spot · one instrument, mastered in depth',
    statsTF: '8 timeframes',
    statsTFLabel: 'M1 · M5 · M15 · H1 · H4 · D1 · W1 · MN',
    statsHistory: '2 years',
    statsHistoryLabel: 'Real historical price data',
    statsPrice: '€79/yr',
    statsPriceLabel: 'Full Pro access · cancel anytime',

    // Product preview section
    previewLabel: 'Live product preview',
    previewH2: 'A real trading desk. Zero risk.',
    previewSub: 'Gold ticker, order blotter, full audit workflow — exactly how institutional desks operate.',
    previewCta: 'Try the simulator →',

    // Features section
    featuresH2: 'The 4 reasons 85% fail — and how we address them',
    featuresSub: 'Each feature solves a concrete cause of prop firm challenge failure.',

    // How it works
    howH2: 'How it works',
    step1Title: 'Create your free account',
    step1Body: 'Sign up in 30 seconds. No card. Instant access to your first 20 free simulations.',
    step2Title: 'Load a XAUUSD session',
    step2Body: 'Choose a historical scenario or replay real London, NY or Asian session data with 8 timeframes.',
    step3Title: 'Trade and analyse',
    step3Body: 'Open positions, set SL/TP, review your Trader Score and challenge metrics after each session.',

    // Who uses it
    whoH2: 'Who is GoldTrader for?',
    whoSub: 'Individual traders and businesses who train on XAUUSD.',
    whoTabB2C: 'Individual traders',
    whoTabB2B: 'Businesses & Academies',

    // B2B banner
    b2bLabel: '◈ For Prop Firm Operators',
    b2bH2: 'Prepare your candidates before they hit the challenge.',
    b2bBody: "Run your prop firm's screening process with a simulator that enforces FTMO-style rules — daily drawdown <5%, max drawdown <10%, consistency score — on real XAUUSD data. Give every candidate an equal baseline before they trade real capital.",
    b2bTags: ['FTMO-style rules enforced', 'Real XAUUSD data', 'CSV blotter export', 'Consistency scoring', 'Daily DD alerts'] as string[],
    b2bChallengeStatus: 'Challenge status',
    b2bPassing: 'PASSING ✓',

    // Pricing
    pricingH2: 'Simple, honest pricing',
    pricingSub: "Start free. Upgrade when you're ready.",
    pricingHook: 'A €300 failed challenge = 4 years of GoldTrader Pro',
    billingMonthly: 'Monthly',
    billingAnnual: 'Annual',
    billingBadge: 'Save 33%',
    freePlanLabel: 'Free',
    freePlanPrice: '€0',
    freePlanSub: 'forever · no card required',
    freeCta: 'Start free',
    proBadgeAnnual: '◆ Best value',
    proBadge: '◆ Pro',
    proLabel: 'Pro',
    proSubMonthly: 'per month · cancel anytime',
    proSubAnnual: 'per year · cancel anytime',
    proSavings: '≈ €6.58/mo · save €40 vs monthly',
    proCtaAnnual: 'Get annual access →',
    proCtaMonthly: 'Get monthly access →',
    propBadge: '◈ B2B · Prop Firm',
    propLabel: 'Prop Firm',
    propSub: 'per year · per firm',
    propSavings: '≈ €12.40/mo · billed annually',
    propCta: 'Contact us →',
    propVolumeNote: 'Custom volume pricing for >5 seats',
    paymentNote: 'iDEAL · Credit & debit card · Stripe · 30-day refund guarantee · GDPR compliant',

    // FAQ
    faqH2: 'Frequently asked questions',

    // Final CTA
    finalPill: 'START TODAY · FREE',
    finalH2a: 'Ready to train before',
    finalH2b: 'the challenge?',
    finalSub: 'A €300 failed challenge costs more than <strong>4 years of GoldTrader Pro</strong>.<br/>Your first 20 simulations are free. No card.',
    finalCtaPrimary: 'Start free — 20 simulations →',
    finalCtaSecondary: 'See plans',
    finalTrustNoCard: 'No credit card',
    finalTrustInstant: 'Instant access',
    finalTrustRefund: '30-day guarantee',
    finalTrustGDPR: 'GDPR compliant',

    // Guide section
    guideLabel: 'CHALLENGE PREP GUIDE · FREE',
    guideH3a: '15 chapters to master gold trading',
    guideH3b: 'from zero to the challenge',
    guideSub: 'Gold trading, risk management, how to use the simulator and the 4 exact rules prop firms evaluate. Free, no sign-up.',
    guideTags: ['15 chapters', 'XAUUSD · Gold', 'Risk management', 'Prop firm rules', 'Download as PDF'] as string[],
    guideCta: 'Read the full guide →',

    // Email capture
    emailH4: 'Prefer to receive it by email?',
    emailSub: "We'll send the guide + simulator updates. No spam, max one email per month.",
    emailPlaceholder: 'your@email.com',
    emailBtn: 'Notify me',
    emailDone: "✓ You're on the list — we'll be in touch.",

    // Footer
    footerTagline: 'GoldTrader · XAUUSD Simulator · Not financial advice',

    // Auth — Login
    loginH1: 'Log in',
    loginNoAccount: "Don't have an account?",
    loginCreateFree: 'Create one free',
    loginGoogle: 'Continue with Google',
    loginOrEmail: 'or with email',
    loginPassword: 'Password',
    loginForgot: 'Forgot your password?',
    loginRemember: 'Remember me',
    loginBtn: 'Log in →',
    loginBtnLoading: 'Logging in…',
    loginBackHome: '← Back to home',
    loginError: 'Invalid credentials. Check your email and password.',
    loginFooter: 'No credit card · No real risk · 100% simulator',
    loginLeftTitle: 'Train like a professional.\nWithout risking anything.',
    loginLeftSub: 'Practice prop firm challenges — FTMO, Funded Next — on real XAUUSD data. Virtual capital, real metrics.',
    loginLeftBullets: ['Real XAUUSD data · 8 timeframes', 'Max DD · Daily DD · Consistency score', '20 free simulations, no card'] as string[],
    loginLeftBadge: '▦ XAUUSD SIMULATOR',

    // Auth — Register
    registerH1: 'Create free account',
    registerHaveAccount: 'Already have an account?',
    registerLoginLink: 'Log in',
    registerGoogle: 'Continue with Google',
    registerOrEmail: 'or with email',
    registerName: 'Name',
    registerNamePlaceholder: 'Your name',
    registerEmailPlaceholder: 'your@email.com',
    registerPassword: 'Password',
    registerPasswordHint: '(min. 8 characters)',
    registerBtn: 'Create free account →',
    registerBtnLoading: 'Creating account…',
    registerError: 'Error creating account. Please try again.',
    registerBackHome: '← Back to home',
    registerRefCode: (code: string) => `Code ${code} applied — 20 free simulations`,
    registerTerms: 'By registering you accept the',
    registerTermsLink: 'Terms of use',
    registerAnd: 'and the',
    registerPrivacyLink: 'Privacy policy',
    registerLeftBadge: '◈ FREE ACCOUNT',
    registerLeftTitle: '20 free simulations.\nNo card. No risk.',
    registerLeftSub: 'Start practicing XAUUSD today. $10,000 virtual capital. Exactly the same conditions as a real challenge.',
    registerDemoLabel: 'YOUR DEMO ACCOUNT',
    registerDemoCapital: 'Starting capital',
    registerDemoInstrument: 'Instrument',
    registerDemoSims: 'Free simulations',
  },
  es: {
    navFeatures: 'Funciones',
    navPricing: 'Precios',
    navFaq: 'FAQ',
    navLogin: 'Iniciar sesión',
    navStart: 'Empezar gratis →',

    heroPill: 'Acceso beta abierto',
    heroPillTraders: (n: number) => `· ${n} traders activos`,

    heroH1a: '¿Pasarías el challenge',
    heroH1b: 'antes de poner dinero real?',

    heroSub: 'Los challenges (FTMO, Funded Next) cuestan entre <strong>€150–€1.500</strong> y el <strong>85% los fallan en la primera semana</strong>. GoldTrader te permite practicar exactamente las métricas que te evalúan, sobre datos reales de XAUUSD, sin arriesgar nada.',

    metricMaxDD: 'Max DD',
    metricDailyDD: 'Daily DD',
    metricConsistency: 'Consistency',
    metricAvgRR: 'Avg R:R',

    socialProof: (n: number) => `${n.toLocaleString()} simulaciones completadas por traders como tú`,

    ctaStart: 'Empezar gratis — 20 simulaciones →',
    ctaDemo: 'Ver demo ↓',

    trustNoCard: 'Sin tarjeta de crédito',
    trustData: 'Datos reales Twelve Data',
    trustFree: '20 simulaciones gratis',
    trustRefund: 'Garantía 30 días',

    scrollHint: 'Desplázate hacia abajo',

    statsXAUUSD: 'XAUUSD',
    statsXAUUSDLabel: 'Gold Spot · un instrumento, dominado en profundidad',
    statsTF: '8 timeframes',
    statsTFLabel: 'M1 · M5 · M15 · H1 · H4 · D1 · W1 · MN',
    statsHistory: '2 años',
    statsHistoryLabel: 'Datos históricos reales de precio',
    statsPrice: '€79/año',
    statsPriceLabel: 'Plan Pro anual · cancela cuando quieras',

    previewLabel: 'Vista del producto en directo',
    previewH2: 'Una mesa de trading real. Cero riesgo.',
    previewSub: 'Ticker de oro, blotter de órdenes, flujo de auditoría completo — exactamente como operan los escritorios institucionales.',
    previewCta: 'Probar en el simulador →',

    featuresH2: 'Las 4 razones por las que el 85% falla — y cómo las trabajamos',
    featuresSub: 'Cada feature resuelve una causa concreta de fallo en los challenges de prop firm.',

    howH2: 'Cómo funciona',
    step1Title: 'Crea tu cuenta gratis',
    step1Body: 'Registro en 30 segundos. Sin tarjeta. Acceso inmediato a tus primeras 20 simulaciones gratuitas.',
    step2Title: 'Carga una sesión XAUUSD',
    step2Body: 'Elige un escenario histórico o reproduce datos reales de sesiones London, NY o Asian con 8 timeframes.',
    step3Title: 'Opera y analiza',
    step3Body: 'Abre posiciones, fija SL/TP, revisa tu Trader Score y las métricas de challenge tras cada sesión.',

    whoH2: '¿Para quién es GoldTrader?',
    whoSub: 'Traders individuales y negocios que entrenan en XAUUSD.',
    whoTabB2C: 'Traders individuales',
    whoTabB2B: 'Empresas & Academias',

    b2bLabel: '◈ Para Operadores de Prop Firm',
    b2bH2: 'Prepara a tus candidatos antes del challenge.',
    b2bBody: 'Ejecuta el proceso de selección de tu prop firm con un simulador que aplica reglas estilo FTMO — daily drawdown <5%, max drawdown <10%, consistency score — sobre datos reales de XAUUSD. Da a cada candidato una base igual antes de operar con capital real.',
    b2bTags: ['Reglas estilo FTMO', 'Datos reales XAUUSD', 'Exportación CSV', 'Consistency scoring', 'Alertas Daily DD'] as string[],
    b2bChallengeStatus: 'Estado del challenge',
    b2bPassing: 'APROBANDO ✓',

    pricingH2: 'Precios simples y honestos',
    pricingSub: 'Empieza gratis. Actualiza cuando estés listo.',
    pricingHook: 'Un challenge de €300 que fallas = 4 años de GoldTrader Pro',
    billingMonthly: 'Mensual',
    billingAnnual: 'Anual',
    billingBadge: 'Ahorra 33%',
    freePlanLabel: 'Gratis',
    freePlanPrice: '€0',
    freePlanSub: 'para siempre · sin tarjeta',
    freeCta: 'Empezar gratis',
    proBadgeAnnual: '◆ Mejor valor',
    proBadge: '◆ Pro',
    proLabel: 'Pro',
    proSubMonthly: 'por mes · cancela cuando quieras',
    proSubAnnual: 'por año · cancela cuando quieras',
    proSavings: '≈ €6,58/mes · ahorras €40 vs mensual',
    proCtaAnnual: 'Obtener acceso anual →',
    proCtaMonthly: 'Obtener acceso mensual →',
    propBadge: '◈ B2B · Prop Firm',
    propLabel: 'Prop Firm',
    propSub: 'por año · por firma',
    propSavings: '≈ €12,40/mes · facturado anualmente',
    propCta: 'Contáctanos →',
    propVolumeNote: 'Precios por volumen para >5 plazas',
    paymentNote: 'iDEAL · Tarjeta de crédito y débito · Stripe · Garantía 30 días · Cumplimiento GDPR',

    faqH2: 'Preguntas frecuentes',

    finalPill: 'EMPIEZA HOY · GRATIS',
    finalH2a: '¿Listo para entrenar antes',
    finalH2b: 'del challenge?',
    finalSub: 'Un challenge de €300 que fallas cuesta más que <strong>4 años de GoldTrader Pro</strong>.<br/>Tus primeras 20 simulaciones son gratis. Sin tarjeta.',
    finalCtaPrimary: 'Empezar gratis — 20 simulaciones →',
    finalCtaSecondary: 'Ver planes',
    finalTrustNoCard: 'Sin tarjeta',
    finalTrustInstant: 'Acceso inmediato',
    finalTrustRefund: 'Garantía 30 días',
    finalTrustGDPR: 'Cumplimiento GDPR',

    guideLabel: 'GUÍA CHALLENGE PREP · GRATIS',
    guideH3a: '15 capítulos para dominar el oro',
    guideH3b: 'desde cero hasta el challenge',
    guideSub: 'Trading de oro, gestión de riesgo, cómo usar el simulador y las 4 reglas exactas que evalúan los prop firms. Gratuita, sin registro.',
    guideTags: ['15 capítulos', 'XAUUSD · Oro', 'Gestión de riesgo', 'Prop firm rules', 'Descarga en PDF'] as string[],
    guideCta: 'Leer la guía completa →',

    emailH4: '¿Prefieres recibirla por email?',
    emailSub: 'Te enviamos la guía + novedades del simulador. Sin spam, máximo un email al mes.',
    emailPlaceholder: 'tu@email.com',
    emailBtn: 'Notifícame',
    emailDone: '✓ Estás en la lista — te escribiremos pronto.',

    footerTagline: 'GoldTrader · Simulador XAUUSD · No es asesoramiento financiero',

    // Auth — Login
    loginH1: 'Iniciar sesión',
    loginNoAccount: '¿No tienes cuenta?',
    loginCreateFree: 'Créala gratis',
    loginGoogle: 'Continuar con Google',
    loginOrEmail: 'o con email',
    loginPassword: 'Contraseña',
    loginForgot: '¿Olvidaste tu contraseña?',
    loginRemember: 'Recordar sesión',
    loginBtn: 'Iniciar sesión →',
    loginBtnLoading: 'Iniciando sesión…',
    loginBackHome: '← Volver al inicio',
    loginError: 'Credenciales incorrectas. Verifica tu email y contraseña.',
    loginFooter: 'Sin tarjeta de crédito · Sin riesgo real · 100% simulador',
    loginLeftTitle: 'Entrena como un profesional.\nSin arriesgar nada.',
    loginLeftSub: 'Practica los challenges de prop firms — FTMO, Funded Next — sobre datos reales de XAUUSD. Tu capital virtual, tus métricas reales.',
    loginLeftBullets: ['Datos reales XAUUSD · 8 timeframes', 'Max DD · Daily DD · Consistency score', '20 simulaciones gratis, sin tarjeta'] as string[],
    loginLeftBadge: '▦ SIMULADOR XAUUSD',

    // Auth — Register
    registerH1: 'Crear cuenta gratis',
    registerHaveAccount: '¿Ya tienes cuenta?',
    registerLoginLink: 'Iniciar sesión',
    registerGoogle: 'Continuar con Google',
    registerOrEmail: 'o con email',
    registerName: 'Nombre',
    registerNamePlaceholder: 'Tu nombre',
    registerEmailPlaceholder: 'tu@email.com',
    registerPassword: 'Contraseña',
    registerPasswordHint: '(mín. 8 caracteres)',
    registerBtn: 'Crear cuenta gratis →',
    registerBtnLoading: 'Creando cuenta…',
    registerError: 'Error al crear la cuenta. Inténtalo de nuevo.',
    registerBackHome: '← Volver al inicio',
    registerRefCode: (code: string) => `Código ${code} aplicado — 20 simulaciones gratis`,
    registerTerms: 'Al registrarte aceptas los',
    registerTermsLink: 'Términos de uso',
    registerAnd: 'y la',
    registerPrivacyLink: 'Política de privacidad',
    registerLeftBadge: '◈ CUENTA GRATUITA',
    registerLeftTitle: '20 simulaciones gratis.\nSin tarjeta. Sin riesgo.',
    registerLeftSub: 'Empieza a practicar XAUUSD hoy mismo. Capital virtual de $10,000. Exactamente las mismas condiciones que un challenge real.',
    registerDemoLabel: 'TU CUENTA DEMO',
    registerDemoCapital: 'Capital inicial',
    registerDemoInstrument: 'Instrumento',
    registerDemoSims: 'Simulaciones gratis',
  },
} as const;

export type LandingT = typeof landingT.en;
