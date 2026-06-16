import { setRequestLocale } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AuthPageClient from './AuthPageClient';

type Props = { params: Promise<{ locale: string }> };

export default async function AuthPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Already logged in → go to album
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect(`/${locale}/album`);

  return <AuthPageClient />;
}
