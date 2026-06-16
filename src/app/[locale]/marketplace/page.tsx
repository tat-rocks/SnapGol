import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/layout/Header';
import MarketplaceClient from './MarketplaceClient';

type Props = { params: Promise<{ locale: string }> };

export default async function MarketplacePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Marketplace');

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14 bg-sg-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white">{t('title')}</h1>
            <p className="text-white/40 text-sm mt-1">{t('subtitle')}</p>
          </div>
          <MarketplaceClient />
        </div>
      </main>
    </>
  );
}
