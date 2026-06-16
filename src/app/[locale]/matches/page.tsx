import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import { createClient } from '@/lib/supabase/server';
import type { MatchFull } from '@/lib/types';
import MatchCard from '@/components/matches/MatchCard';

type Props = { params: Promise<{ locale: string }> };

export default async function MatchesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: matches } = await supabase
    .from('matches')
    .select('id,team_a,team_b,flag_a,flag_b,match_date,match_time,status,score_a,score_b,venue,city,group_name,stage')
    .not('match_date', 'is', null)
    .order('match_date', { ascending: true })
    .order('match_time', { ascending: true });

  const rows = (matches ?? []) as MatchFull[];

  // Group by date
  const byDate: Record<string, MatchFull[]> = {};
  for (const m of rows) {
    if (!byDate[m.match_date]) byDate[m.match_date] = [];
    byDate[m.match_date].push(m);
  }

  // Group by group_name for tab
  const groups = [...new Set(rows.map(m => m.group_name).filter(Boolean))].sort();

  function formatDate(d: string) {
    return new Date(d + 'T12:00:00').toLocaleDateString('es', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  const liveMatches = rows.filter(m => m.status === 'live');

  return (
    <>
      <Header user={user} />
      <main className="min-h-screen pt-14 bg-sg-bg">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {liveMatches.length > 0 && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  {liveMatches.length} EN VIVO
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black text-white">Partidos · Mundial 2026</h1>
            <p className="text-white/55 mt-1 text-sm">
              Predecí el resultado antes del partido · Acertá · Ganás un slot para subir tu foto
            </p>
          </div>

          {/* How it works banner */}
          <div className="mb-8 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            style={{ background: 'linear-gradient(135deg, rgba(0,150,36,0.1), rgba(0,200,83,0.05))', border: '1px solid rgba(0,200,83,0.2)' }}>
            <div className="flex gap-3 text-sm text-white/70 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-sg-green/20 text-sg-green text-xs flex items-center justify-center font-bold">1</span>
                Predecí el partido
              </span>
              <span className="text-white/20">→</span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-sg-green/20 text-sg-green text-xs flex items-center justify-center font-bold">2</span>
                Si acertás ganás un slot
              </span>
              <span className="text-white/20">→</span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-sg-green/20 text-sg-green text-xs flex items-center justify-center font-bold">3</span>
                Subís tu foto → carta especial
              </span>
            </div>
          </div>

          {/* Matches by date */}
          <div className="space-y-8">
            {Object.entries(byDate).map(([date, dayMatches]) => (
              <section key={date}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 pb-2 border-b border-white/5 capitalize">
                  {formatDate(date)}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dayMatches.map(match => (
                    <MatchCard key={match.id} match={match} locale={locale} isLoggedIn={!!user} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
