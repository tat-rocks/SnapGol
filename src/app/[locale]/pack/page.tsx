import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/layout/Header';
import PackOpening from '@/components/pack/PackOpening';
import { openPack } from '@/lib/supabase/actions';
import { createClient } from '@/lib/supabase/server';

type Props = { params: Promise<{ locale: string }> };

const PACK_TIERS = [
  {
    id: 'mini',
    name: 'Mini Sobre',
    cards: 3,
    price: '$0.99',
    priceNum: 0.99,
    desc: 'Para empezar a coleccionar',
    tag: null,
    gradient: 'linear-gradient(135deg, #1e293b, #334155)',
    border: 'rgba(148,163,184,0.4)',
    glow: 'rgba(148,163,184,0.15)',
    odds: { common: 75, rare: 20, epic: 5, legendary: 0 },
  },
  {
    id: 'standard',
    name: 'Sobre Estándar',
    cards: 5,
    price: '$1.99',
    priceNum: 1.99,
    desc: 'El favorito de la comunidad',
    tag: 'MÁS POPULAR',
    gradient: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    border: 'rgba(0,200,83,0.5)',
    glow: 'rgba(0,200,83,0.2)',
    odds: { common: 60, rare: 25, epic: 12, legendary: 3 },
  },
  {
    id: 'premium',
    name: 'Sobre Premium',
    cards: 10,
    price: '$4.99',
    priceNum: 4.99,
    desc: '1 carta Epic garantizada',
    tag: 'MEJOR VALOR',
    gradient: 'linear-gradient(135deg, #3b0764, #7e22ce)',
    border: 'rgba(168,85,247,0.5)',
    glow: 'rgba(168,85,247,0.2)',
    odds: { common: 45, rare: 30, epic: 20, legendary: 5 },
  },
];

const RARITY_COLORS: Record<string, string> = {
  common: '#94a3b8',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#ffd700',
};

export default async function PackPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Pack');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14 bg-sg-bg">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:py-20">

          {/* Header */}
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-sg-green/30 bg-sg-green/10 px-3 py-1 text-xs font-semibold text-sg-green uppercase tracking-wider">
              World Cup 2026
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Abre un sobre
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto">
              5 cartas aleatorias con fotos reales del Mundial. Cuanto más rara, más vale.
            </p>
          </div>

          {!user ? (
            /* ── Locked: show tier cards as preview ── */
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {PACK_TIERS.map((tier) => (
                  <div key={tier.id} className="relative flex flex-col rounded-2xl overflow-hidden"
                    style={{ border: `2px solid ${tier.border}`, boxShadow: `0 0 32px ${tier.glow}` }}>
                    {tier.tag && (
                      <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
                        style={{ background: tier.id === 'premium' ? '#a855f7' : '#00c853', color: '#06080f' }}>
                        {tier.tag}
                      </div>
                    )}
                    <div className="flex flex-col items-center justify-center gap-3 py-10 px-4"
                      style={{ background: tier.gradient }}>
                      <div className="text-5xl opacity-80">⚽</div>
                      <span className="text-xs font-bold tracking-widest uppercase"
                        style={{ color: tier.id === 'standard' ? '#00c853' : tier.id === 'premium' ? '#a855f7' : '#94a3b8' }}>
                        SnapGol
                      </span>
                      <span className="text-white/50 text-xs">{tier.cards} cartas</span>
                    </div>
                    <div className="p-4 space-y-3 bg-sg-surface">
                      <div>
                        <p className="font-black text-white text-base">{tier.name}</p>
                        <p className="text-white/55 text-xs mt-0.5">{tier.desc}</p>
                      </div>
                      {/* Odds */}
                      <div className="space-y-1.5">
                        {Object.entries(tier.odds).map(([rarity, pct]) => (
                          <div key={rarity} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: RARITY_COLORS[rarity] }} />
                            <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: RARITY_COLORS[rarity] }} />
                            </div>
                            <span className="text-[10px] text-white/40 w-6 text-right">{pct}%</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-xl font-black text-white">{tier.price}</span>
                        <a href={`/${locale}/auth`}
                          className="px-4 py-2 rounded-full text-sm font-bold transition-all hover:opacity-90"
                          style={{ background: tier.id === 'standard' ? '#00c853' : tier.id === 'premium' ? '#a855f7' : '#334155', color: '#fff' }}>
                          Iniciar sesión
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center space-y-4">
                <p className="text-white/50 text-sm">Creá tu cuenta gratis y abre tu primer sobre</p>
                <a href={`/${locale}/auth`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-sg-green text-sg-bg font-bold text-base hover:bg-sg-green/90 transition-all hover:shadow-xl hover:shadow-sg-green/25">
                  Empezar a coleccionar →
                </a>
              </div>
            </div>
          ) : (
            /* ── Logged in: select tier then open ── */
            <PackWithTiers locale={locale} />
          )}
        </div>
      </main>
    </>
  );
}

/* ── Server-side tier selector that passes correct open function ── */
function PackWithTiers({ locale }: { locale: string }) {
  return (
    <PackOpening
      tiers={PACK_TIERS.map((t) => ({ id: t.id, name: t.name, price: t.price, cards: t.cards, desc: t.desc, tag: t.tag, gradient: t.gradient, border: t.border, glow: t.glow, odds: t.odds }))}
      onOpen={openPack}
      locale={locale}
    />
  );
}
