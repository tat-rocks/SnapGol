import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/layout/Header';
import UploadClient from './UploadClient';

type Props = { params: Promise<{ locale: string }> };

export default async function UploadPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Upload');

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14 bg-sg-bg">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
          <div className="mb-8 text-center space-y-2">
            <h1 className="text-3xl font-black text-white">{t('title')}</h1>
            <p className="text-white/40">{t('subtitle')}</p>
          </div>
          <UploadClient />
        </div>
      </main>
    </>
  );
}
