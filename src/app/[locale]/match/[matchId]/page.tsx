import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import MatchRoom from '@/components/matches/MatchRoom';
import { createClient } from '@/lib/supabase/server';
import type { MatchFull, Prediction } from '@/lib/types';

type Props = { params: Promise<{ locale: string; matchId: string }> };

export default async function MatchPage({ params }: Props) {
  const { locale, matchId } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: match } = await supabase
    .from('matches')
    .select('id,team_a,team_b,flag_a,flag_b,match_date,match_time,status,score_a,score_b,venue,city,group_name,stage')
    .eq('id', matchId)
    .single();

  if (!match) notFound();

  // Get user's existing predictions for this match
  let myPredictions: Prediction[] = [];
  let myPhotoSlots: number = 0;

  if (user) {
    const { data: preds } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', user.id)
      .eq('match_id', matchId);
    myPredictions = (preds ?? []) as Prediction[];

    const { count } = await supabase
      .from('photo_slots')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('match_id', matchId)
      .eq('used', false);
    myPhotoSlots = count ?? 0;
  }

  return (
    <>
      <Header user={user} />
      <main className="min-h-screen pt-14 bg-sg-bg">
        <MatchRoom
          match={match as MatchFull}
          userId={user?.id ?? null}
          userEmail={user?.email ?? null}
          initialPredictions={myPredictions}
          initialPhotoSlots={myPhotoSlots}
          locale={locale}
        />
      </main>
    </>
  );
}
