'use client';

import Link from 'next/link';
import type { MatchFull } from '@/lib/types';

interface Props {
  match: MatchFull;
  locale: string;
  isLoggedIn: boolean;
}

export default function MatchCard({ match, locale, isLoggedIn }: Props) {
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const hasScore = match.score_a !== null && match.score_b !== null;

  return (
    <Link href={`/${locale}/match/${match.id}`}
      className="group relative flex items-center gap-4 rounded-2xl p-4 border transition-all hover:border-white/20 hover:bg-white/[0.03]"
      style={{ background: '#0d1117', border: isLive ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)' }}>

      {isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Live</span>
        </div>
      )}

      {/* Group badge */}
      {match.group_name && (
        <div className="absolute top-3 left-3 text-[10px] font-bold text-white/25 uppercase tracking-wider">
          Grupo {match.group_name}
        </div>
      )}

      {/* Teams */}
      <div className="flex-1 flex items-center justify-between gap-2 mt-3">
        {/* Team A */}
        <div className="flex flex-col items-center gap-1 w-20">
          <span className="text-2xl">{match.flag_a}</span>
          <span className="text-xs font-semibold text-white/80 text-center leading-tight">{match.team_a}</span>
        </div>

        {/* Score / Time */}
        <div className="flex flex-col items-center gap-1">
          {hasScore ? (
            <span className="text-2xl font-black text-white">
              {match.score_a} – {match.score_b}
            </span>
          ) : (
            <>
              <span className="text-lg font-black text-white/30">vs</span>
              <span className="text-[10px] text-white/35">
                {match.match_time?.slice(0, 5)}
              </span>
            </>
          )}
          <span className="text-[9px] text-white/25 text-center">{match.city}</span>
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center gap-1 w-20">
          <span className="text-2xl">{match.flag_b}</span>
          <span className="text-xs font-semibold text-white/80 text-center leading-tight">{match.team_b}</span>
        </div>
      </div>

      {/* CTA */}
      {!isFinished && (
        <div className="mt-1 ml-auto shrink-0">
          <span className="text-[10px] font-semibold text-sg-green opacity-0 group-hover:opacity-100 transition-opacity">
            Predecir →
          </span>
        </div>
      )}
    </Link>
  );
}
