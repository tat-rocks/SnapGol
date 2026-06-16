import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/layout/Header';
import PackOpening from '@/components/pack/PackOpening';
import { openPack } from '@/lib/supabase/actions';
import { createClient } from '@/lib/supabase/server';

type Props = { params: Promise<{ locale: string }> };

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
        <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">

          {/* Header */}
          <div className="text-center mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-sg-green/30 bg-sg-green/10 px-3 py-1 text-xs font-semibold text-sg-green uppercase tracking-wider mb-3">
              <span>⚽</span> World Cup 2026
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{t('title')}</h1>
            <p className="text-white/40 text-sm">{t('subtitle')}</p>
          </div>

          {!user ? (
            /* Locked state */
            <div className="text-center py-10 space-y-5">
              {/* Blurred pack preview */}
              <div className="relative inline-block">
                <div
                  className="w-48 h-72 rounded-2xl mx-auto flex flex-col items-center justify-center gap-3 blur-sm opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
                    border: '2px solid rgba(0,200,83,0.4)',
                  }}
                >
                  <span className="text-6xl">⚽</span>
                  <span className="text-sm font-bold text-sg-green tracking-widest uppercase">SnapGol</span>
                  <span className="text-xs text-white/40">5 cards</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">🔒</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-white font-bold text-lg">{t('locked_title')}</p>
                <p className="text-white/40 text-sm max-w-xs mx-auto">{t('locked_desc')}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <span className="text-2xl font-black text-sg-green">{t('price')}</span>
                <a
                  href={`/${locale}/auth`}
                  className="px-8 py-3 rounded-full bg-sg-green text-sg-bg font-bold text-sm hover:bg-sg-green/90 transition-all hover:shadow-lg hover:shadow-sg-green/20"
                >
                  {t('locked_cta')} →
                </a>
              </div>
            </div>
          ) : (
            /* Pack opening */
            <PackOpening onOpen={openPack} />
          )}
        </div>
      </main>
    </>
  );
}
