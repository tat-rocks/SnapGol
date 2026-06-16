import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/layout/Header';
import AlbumGrid from '@/components/album/AlbumGrid';
import { ALBUM_TOTAL_SLOTS } from '@/lib/constants';
import type { SnapCard } from '@/lib/types';

type Props = { params: Promise<{ locale: string }> };

// Placeholder empty album for now — real data from Supabase via server action
const PLACEHOLDER_CARDS: SnapCard[] = [];

export default async function AlbumPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Album');

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14 bg-sg-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-white">{t('title')}</h1>
              <p className="text-white/40 text-sm mt-1">{t('progress', { collected: 0, total: ALBUM_TOTAL_SLOTS })}</p>
            </div>
            <a
              href="../pack"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sg-green text-sg-bg font-bold text-sm hover:bg-sg-green/90 transition-colors"
            >
              {t('open_pack')} ✦
            </a>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-white/5 pb-0.5">
            {[t('all'), t('by_country'), t('by_match'), t('duplicates', { count: 0 })].map((label, i) => (
              <button
                key={i}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  i === 0
                    ? 'bg-sg-surface text-white border-b-2 border-sg-green'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <AlbumGrid cards={PLACEHOLDER_CARDS} totalSlots={ALBUM_TOTAL_SLOTS} />
        </div>
      </main>
    </>
  );
}
