'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useLangStore } from '@/store/lang.store';
import { useT } from '@/hooks/useT';

const STORAGE_KEY = 'gt_onboarding_done';

const LANGS = [
  { code: 'en' as const, flag: '🇬🇧', name: 'English',    nativeSub: 'Continue in English' },
  { code: 'nl' as const, flag: '🇳🇱', name: 'Nederlands', nativeSub: 'Doorgaan in het Nederlands' },
  { code: 'es' as const, flag: '🇪🇸', name: 'Español',    nativeSub: 'Continuar en español' },
];

export function OnboardingWizard() {
  const router   = useRouter();
  const t        = useT();
  const { lang, setLang } = useLangStore();

  const [phase,   setPhase]   = useState<'lang' | 'tour'>('lang');
  const [step,    setStep]    = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  // ── Steps (built from t so they react to language changes) ──────────────────
  const STEPS = [
    {
      id: 'welcome',
      emoji: '🪙',
      title: t.tourWelcomeTitle,
      subtitle: t.tourWelcomeSub,
      cta: t.tourWelcomeCta,
      content: (
        <div className="space-y-3 text-[11px] text-[#8892a4] leading-relaxed">
          <p>{t.tourWelcomeBody}</p>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: '📚', label: t.tourWelcomeF1Label, sub: t.tourWelcomeF1Sub },
              { icon: '⚡', label: t.tourWelcomeF2Label, sub: t.tourWelcomeF2Sub },
              { icon: '🏆', label: t.tourWelcomeF3Label, sub: t.tourWelcomeF3Sub },
            ].map((item) => (
              <div key={item.label} className="border border-[#2e3340] p-2.5 text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-[10px] font-medium text-[#c8cdd8]">{item.label}</div>
                <div className="text-[9px] text-[#4a5568] mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'gold',
      emoji: '📊',
      title: t.tourGoldTitle,
      subtitle: t.tourGoldSub,
      cta: t.tourGoldCta,
      content: (
        <div className="space-y-4 text-[11px] text-[#8892a4] leading-relaxed">
          <div className="bg-[#1a1d24] border border-[#2e3340] p-3">
            <div className="font-mono text-[20px] text-[#60a5fa] font-bold mb-1">XAUUSD = 2.340,50</div>
            <div className="text-[10px]">→ 1 oz <span className="text-[#fbbf24]">$2.340,50</span></div>
          </div>
          <div className="space-y-2">
            {[t.tourGoldB1, t.tourGoldB2, t.tourGoldB3].map((b, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#f59e0b] shrink-0">▸</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
          <div className="border border-[#3b82f6]/30 bg-[#3b82f6]/5 p-2.5">
            <span className="text-[#60a5fa] text-[10px]">{t.tourGoldTip}</span>
            <span className="text-[#8892a4] text-[10px]">{t.tourGoldTipSub}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'lots',
      emoji: '⚖️',
      title: t.tourLotsTitle,
      subtitle: t.tourLotsSub,
      cta: t.tourLotsCta,
      content: (
        <div className="space-y-3 text-[11px] text-[#8892a4] leading-relaxed">
          <div className="grid grid-cols-3 gap-2">
            {[
              { lot: '0.01', name: t.tourLotsMicro,  pip: '$0.10', color: 'border-green-500/40 bg-green-500/5 text-green-400' },
              { lot: '0.10', name: t.tourLotsMini,   pip: '$1.00', color: 'border-yellow-500/40 bg-yellow-500/5 text-yellow-400' },
              { lot: '1.00', name: t.tourLotsStd,    pip: '$10.00', color: 'border-red-500/40 bg-red-500/5 text-red-400' },
            ].map((l) => (
              <div key={l.lot} className={clsx('border p-2 text-center', l.color)}>
                <div className="font-mono font-bold text-[10px]">{l.lot}</div>
                <div className="text-[9px] opacity-80">{l.name}</div>
                <div className="text-[10px] font-medium mt-1">{l.pip}/pip</div>
              </div>
            ))}
          </div>
          <div className="space-y-2 mt-2">
            <div className="flex items-start gap-2">
              <span className="text-[#ef4444] shrink-0 font-bold">🛑</span>
              <span>{t.tourLotsSL}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#22c55e] shrink-0 font-bold">✅</span>
              <span>{t.tourLotsTP}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#f59e0b] shrink-0 font-bold">⚖️</span>
              <span>{t.tourLotsRule}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'interface',
      emoji: '🖥️',
      title: t.tourIfaceTitle,
      subtitle: t.tourIfaceSub,
      cta: t.tourIfaceCta,
      content: (
        <div className="space-y-2 text-[11px] text-[#8892a4]">
          {[
            { icon: '📋', label: t.tourIfaceZ1Label, desc: t.tourIfaceZ1Desc },
            { icon: '👁️', label: t.tourIfaceZ2Label, desc: t.tourIfaceZ2Desc },
            { icon: '🗂️', label: t.tourIfaceZ3Label, desc: t.tourIfaceZ3Desc },
            { icon: '📈', label: t.tourIfaceZ4Label, desc: t.tourIfaceZ4Desc },
            { icon: '⚡', label: t.tourIfaceZ5Label, desc: t.tourIfaceZ5Desc },
            { icon: '🟢', label: t.tourIfaceZ6Label, desc: t.tourIfaceZ6Desc },
          ].map((item) => (
            <div key={item.icon} className="flex items-start gap-2 border border-[#2e3340] p-2 hover:border-[#3b82f6]/30 transition-colors">
              <span className="shrink-0 text-[11px]">{item.icon}</span>
              <div>
                <div className="text-[10px] font-medium text-[#c8cdd8]">{item.label}</div>
                <div className="text-[9px] text-[#4a5568] mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'first-trade',
      emoji: '🚀',
      title: t.tourFirstTitle,
      subtitle: t.tourFirstSub,
      cta: t.tourFirstCta,
      ctaHref: '/trade',
      content: (
        <div className="space-y-2 text-[11px] text-[#8892a4]">
          <div className="space-y-1.5">
            {[
              { n: '1', text: t.tourFirstS1, color: 'bg-[#3b82f6]' },
              { n: '2', text: t.tourFirstS2, color: 'bg-[#3b82f6]' },
              { n: '3', text: t.tourFirstS3, color: 'bg-[#8b5cf6]' },
              { n: '4', text: t.tourFirstS4, color: 'bg-[#f59e0b]' },
              { n: '5', text: t.tourFirstS5, color: 'bg-[#22c55e]' },
            ].map((s) => (
              <div key={s.n} className="flex items-center gap-3 border border-[#2e3340] p-2">
                <div className={clsx('w-5 h-5 rounded-full flex items-center justify-center text-white font-bold shrink-0', s.color)} style={{ fontSize: 10 }}>
                  {s.n}
                </div>
                <span>{s.text}</span>
              </div>
            ))}
          </div>
          <div className="border border-[#22c55e]/30 bg-[#22c55e]/5 p-2.5 mt-2">
            <span className="text-[#4ade80] text-[10px]">{t.tourFirstNote1}</span>
          </div>
          <div className="border border-[#f59e0b]/30 bg-[#f59e0b]/5 p-2.5">
            <span className="text-[#fbbf24] text-[10px]">{t.tourFirstNote2}</span>
          </div>
        </div>
      ),
    },
  ];

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;

  const next = () => {
    if (isLast) {
      localStorage.setItem(STORAGE_KEY, '1');
      setVisible(false);
      router.push('/trade');
    } else {
      setStep((s) => s + 1);
    }
  };

  const skip = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  // ── Language selection ────────────────────────────────────────────────────
  if (phase === 'lang') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm">
        <div className="bg-[#141720] border border-[#2e3340] w-full mx-4 shadow-2xl" style={{ maxWidth: 400 }}>
          <div className="px-6 pt-6 pb-4 text-center border-b border-[#2e3340]">
            <div className="text-2xl mb-2">🌍</div>
            <div className="text-[10px] font-bold text-white mb-1">{t.tourLangTitle}</div>
            <div className="text-[10px] text-[#4a5568]">{t.tourLangSub}</div>
          </div>

          <div className="p-4 space-y-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={clsx(
                  'w-full flex items-center gap-4 px-4 py-3 border transition-all text-left',
                  lang === l.code
                    ? 'border-[#3b82f6] bg-[#3b82f6]/10'
                    : 'border-[#2e3340] hover:border-[#3b82f6]/40 hover:bg-[#1a1d24]',
                )}
              >
                <span className="text-2xl shrink-0">{l.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className={clsx('text-[9px] font-semibold', lang === l.code ? 'text-white' : 'text-[#c8cdd8]')}>
                    {l.name}
                  </div>
                  <div className="text-[10px] text-[#4a5568] mt-0.5">{l.nativeSub}</div>
                </div>
                {lang === l.code && <span className="text-[#3b82f6] shrink-0 text-[11px]">✓</span>}
              </button>
            ))}
          </div>

          <div className="px-4 pb-4 flex justify-end">
            <button
              onClick={() => setPhase('tour')}
              className="px-6 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[11px] font-medium transition-colors"
            >
              {t.tourLangContinue}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Tour ──────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div
        className="bg-[#141720] border border-[#2e3340] w-full mx-4 flex flex-col shadow-2xl"
        style={{ maxWidth: 520, maxHeight: '90vh' }}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1d24] border-b border-[#2e3340] shrink-0">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 14 }}>{current.emoji}</span>
            <span className="text-[11px] font-medium text-[#c8cdd8]">{t.tourHeader}</span>
          </div>
          <button onClick={skip} className="text-[#4a5568] hover:text-[#8892a4] transition-colors text-lg leading-none">×</button>
        </div>

        {/* Progress */}
        <div className="flex gap-1 px-4 pt-3 shrink-0">
          {STEPS.map((_, i) => (
            <div key={i} className={clsx('flex-1 h-0.5 rounded-full transition-all duration-300', i <= step ? 'bg-[#3b82f6]' : 'bg-[#2e3340]')} />
          ))}
        </div>

        {/* Header */}
        <div className="px-4 pt-4 pb-3 shrink-0">
          <h2 className="text-[9px] font-bold text-white mb-0.5">{current.title}</h2>
          <p className="text-[11px] text-[#4a5568]">{current.subtitle}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          {current.content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1d24] border-t border-[#2e3340] shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#4a5568]">{t.tourStepOf(step + 1, STEPS.length)}</span>
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} className="text-[10px] text-[#4a5568] hover:text-[#8892a4] transition-colors">
                {t.tourBack}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={skip} className="px-3 py-1.5 text-[10px] text-[#4a5568] hover:text-[#8892a4] transition-colors">
              {t.tourSkip}
            </button>
            <button
              onClick={next}
              className={clsx('px-4 py-1.5 text-[11px] font-medium text-white transition-colors', isLast ? 'bg-[#22c55e] hover:bg-[#16a34a]' : 'bg-[#3b82f6] hover:bg-[#2563eb]')}
            >
              {isLast ? t.tourFinish : t.tourNext}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function resetOnboarding() {
  localStorage.removeItem(STORAGE_KEY);
}
