import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/layout/Header';
import RarityBadge from '@/components/card/RarityBadge';
import { RARITY_CONFIG, MOCK_STATS } from '@/lib/constants';
import type { Rarity } from '@/lib/types';

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Landing');

  const steps = [
    { icon: '📸', title: t('step1_title'), desc: t('step1_desc') },
    { icon: '⭐', title: t('step2_title'), desc: t('step2_desc') },
    { icon: '🔄', title: t('step3_title'), desc: t('step3_desc') },
  ];

  const rarities: Rarity[] = ['common', 'rare', 'epic', 'legendary'];

  return (
    <>
      <Header />

      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="hero-bg relative min-h-screen flex items-center pt-14 overflow-hidden">
          {/* Glow blobs */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #00c853, transparent)' }} />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-5 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-20 grid lg:grid-cols-[60%_40%] gap-10 items-center">

            {/* Text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-sg-green/30 bg-sg-green/10 px-3 py-1 text-xs font-semibold text-sg-green uppercase tracking-wider">
                  <span>⚽</span> World Cup 2026
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white">
                  {t('hero_title').split('. ').map((part, i, arr) => (
                    <span key={i}>
                      {i === 0 ? <span className="text-sg-green">{part}</span> : <span>{part}</span>}
                      {i < arr.length - 1 && '.\u00A0'}
                    </span>
                  ))}
                </h1>
                <p className="text-lg text-white/50 max-w-lg leading-relaxed">
                  {t('hero_subtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href="./album"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-sg-green text-sg-bg font-bold text-sm hover:bg-sg-green/90 transition-all hover:shadow-lg hover:shadow-sg-green/20">
                  {t('cta_collect')} →
                </a>
                <a href="./marketplace"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/70 font-semibold text-sm hover:border-white/20 hover:text-white transition-colors">
                  {t('cta_marketplace')}
                </a>
              </div>

              {/* Stats — 2 cols mobile / 4 desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                {[
                  { value: MOCK_STATS.cards.toLocaleString(), label: t('stats_cards') },
                  { value: MOCK_STATS.collectors.toLocaleString(), label: t('stats_collectors') },
                  { value: MOCK_STATS.trades.toLocaleString(), label: t('stats_traded') },
                  { value: MOCK_STATS.countries.toString(), label: t('stats_countries') },
                ].map(({ value, label }) => (
                  <div key={label} className="space-y-0.5">
                    <p className="text-2xl font-black text-white">{value}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wide">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating cards — desktop only */}
            <div className="hidden lg:flex relative h-[500px] justify-center items-center">
              <div className="absolute animate-float-back" style={{ top: '10%', left: '0%', zIndex: 1 }}>
                <MockCard rarity="epic" />
              </div>
              <div className="absolute animate-float" style={{ top: '15%', left: '20%', zIndex: 2 }}>
                <MockCard rarity="rare" />
              </div>
              <div className="absolute animate-float-mid" style={{ top: '5%', left: '42%', zIndex: 3 }}>
                <MockCard rarity="legendary" />
              </div>
            </div>

            {/* Mini cards — mobile only */}
            <div className="flex lg:hidden justify-center gap-4 -mt-4">
              {(['epic', 'rare', 'legendary'] as const).map((r) => (
                <MockCard key={r} rarity={r} small />
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────── */}
        <section className="py-16 sm:py-24 bg-sg-surface">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-4xl font-black text-center text-white mb-10 sm:mb-16">
              {t('howItWorks_title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
              {steps.map((step, i) => (
                <div key={i} className="relative flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0
                                        text-left sm:text-center space-y-0 sm:space-y-4
                                        p-5 sm:p-8 rounded-2xl bg-sg-surface-2 border border-white/5
                                        hover:border-sg-green/20 transition-colors group">
                  <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14
                                  rounded-2xl bg-sg-green/10 text-2xl sm:text-3xl
                                  group-hover:bg-sg-green/20 transition-colors">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -left-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-sg-green
                                  text-sg-bg text-xs font-black flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div className="sm:mt-4">
                    <h3 className="text-base sm:text-lg font-bold text-white">{step.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Rarity showcase ──────────────────────────────── */}
        <section className="py-16 sm:py-24 bg-sg-bg">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-16 space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-white">{t('rarities_title')}</h2>
              <p className="text-white/40 text-sm sm:text-base max-w-md mx-auto">{t('rarities_subtitle')}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
              {rarities.map((rarity) => {
                const cfg = RARITY_CONFIG[rarity];
                return (
                  <div key={rarity} className="flex flex-col items-center gap-3">
                    <MockCard rarity={rarity} />
                    <div className="text-center space-y-1">
                      <RarityBadge rarity={rarity} size="md" />
                      <p className="text-xs text-white/30">{cfg.chance}% chance</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Pack CTA ─────────────────────────────────────── */}
        <section className="py-16 sm:py-24 bg-sg-surface relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,200,83,0.04), transparent)' }} />
          <div className="mx-auto max-w-3xl px-4 text-center space-y-5 relative z-10">
            <div className="text-5xl sm:text-6xl">🎁</div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">{t('pack_title')}</h2>
            <p className="text-white/40 text-sm sm:text-base">{t('pack_subtitle')}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <span className="text-3xl font-black text-sg-green">{t('pack_price')}</span>
              <a href="./pack"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                           px-8 py-4 rounded-full bg-sg-green text-sg-bg font-bold text-base
                           hover:bg-sg-green/90 transition-all hover:shadow-xl hover:shadow-sg-green/25">
                {t('pack_cta')} ✦
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 bg-sg-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <span className="font-black">
            <span className="text-sg-green">Snap</span>Gol ⚽
          </span>
          <span>© 2026 SnapGol. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}

/* ── Mock card placeholder for landing visuals ── */
function MockCard({ rarity, small = false }: { rarity: Rarity; small?: boolean }) {
  const cfg = RARITY_CONFIG[rarity];
  const isLegendary = rarity === 'legendary';
  const w = small ? 90 : 160;
  const h = small ? 126 : 224;

  return (
    <div
      className={`relative rounded-xl overflow-hidden flex flex-col ${isLegendary ? 'animate-legendary' : ''}`}
      style={{
        width: w,
        height: h,
        background: cfg.bgGradient,
        border: `2px solid ${cfg.color}`,
        boxShadow: `0 0 ${small ? 12 : 20}px ${cfg.glow}`,
      }}
    >
      {isLegendary && (
        <div className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(135deg, transparent 30%, rgba(255,215,0,0.08) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer-sweep 3s linear infinite',
          }} />
      )}
      <div className="px-1.5 py-1 text-[8px] text-white/50 border-b border-white/10 flex justify-between">
        <span>🇧🇷 BRA</span><span>🇦🇷 ARG</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <span className={`${small ? 'text-2xl' : 'text-5xl'} opacity-30`}>⚽</span>
      </div>
      <div className="px-1.5 py-1 border-t border-white/10 flex items-center justify-between">
        <RarityBadge rarity={rarity} size="sm" />
        {!small && <span className="text-[9px] font-mono text-white/30">#042</span>}
      </div>
    </div>
  );
}
