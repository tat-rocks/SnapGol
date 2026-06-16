'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { MatchFull, Prediction, PredictionType } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { submitPrediction } from '@/lib/supabase/actions';

const REACTIONS = [
  { id: 'goal',    label: '⚽', text: 'GOL!' },
  { id: 'fire',    label: '🔥', text: 'Qué jugada' },
  { id: 'miss',    label: '😬', text: 'Erró' },
  { id: 'save',    label: '🧤', text: 'Atajada' },
  { id: 'card',    label: '🟨', text: 'Amarilla' },
  { id: 'wow',     label: '🤯', text: 'Increíble' },
];

interface ReactionEvent {
  id: string;
  reaction: string;
  label: string;
  user: string;
  ts: number;
}

interface Props {
  match: MatchFull;
  userId: string | null;
  userEmail: string | null;
  initialPredictions: Prediction[];
  initialPhotoSlots: number;
  locale: string;
}

export default function MatchRoom({ match, userId, userEmail, initialPredictions, initialPhotoSlots, locale }: Props) {
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const [feed, setFeed] = useState<ReactionEvent[]>([]);
  const [onlineCount, setOnlineCount] = useState(1);
  const [predictions, setPredictions] = useState<Prediction[]>(initialPredictions);
  const [photoSlots, setPhotoSlots] = useState(initialPhotoSlots);
  const [submitting, setSubmitting] = useState<PredictionType | null>(null);
  const [winner, setWinner] = useState('');
  const [ftScore, setFtScore] = useState('');
  const [firstGoal, setFirstGoal] = useState('');
  const feedRef = useRef<HTMLDivElement>(null);

  const isUpcoming = match.status === 'upcoming';
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const hasScore = match.score_a !== null && match.score_b !== null;

  const hasPred = (type: PredictionType) => predictions.some(p => p.type === type);
  const getPred = (type: PredictionType) => predictions.find(p => p.type === type);

  // Supabase Realtime for reactions
  useEffect(() => {
    const channel = supabase.channel(`match-room:${match.id}`, {
      config: { presence: { key: userId ?? 'anon' } },
    });

    channel
      .on('broadcast', { event: 'reaction' }, ({ payload }) => {
        const ev: ReactionEvent = {
          id: crypto.randomUUID(),
          reaction: payload.reaction,
          label: payload.label,
          user: payload.user,
          ts: Date.now(),
        };
        setFeed(f => [...f.slice(-49), ev]);
      })
      .on('presence', { event: 'sync' }, () => {
        setOnlineCount(Object.keys(channel.presenceState()).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: userId ?? 'anon', online_at: new Date().toISOString() });
        }
      });

    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [match.id, userId]);

  // Auto-scroll feed
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [feed]);

  function sendReaction(r: typeof REACTIONS[0]) {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'reaction',
      payload: { reaction: r.id, label: r.label, user: userEmail?.split('@')[0] ?? 'Fan' },
    });
  }

  async function handlePredict(type: PredictionType, value: string) {
    if (!userId || !value || hasPred(type)) return;
    setSubmitting(type);
    try {
      const pred = await submitPrediction(match.id, type, value);
      setPredictions(p => [...p, pred]);
    } finally {
      setSubmitting(null);
    }
  }

  const POINTS: Record<PredictionType, number> = {
    winner: 50, ft_score: 150, first_goal: 100,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* Match header */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: '#0d1117', border: isLive ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)' }}>
        {/* Status bar */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-white/5 text-xs">
          <span className="text-white/35 capitalize">
            {match.group_name ? `Grupo ${match.group_name} · ` : ''}{match.stage}
          </span>
          <div className="flex items-center gap-3">
            {isLive && (
              <span className="flex items-center gap-1.5 text-red-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> EN VIVO
              </span>
            )}
            <span className="flex items-center gap-1 text-white/30">
              <span className="w-1.5 h-1.5 rounded-full bg-sg-green" />
              {onlineCount} viendo
            </span>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center justify-between px-6 py-6 gap-4">
          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-4xl sm:text-5xl">{match.flag_a}</span>
            <span className="font-black text-white text-base sm:text-lg text-center">{match.team_a}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            {hasScore ? (
              <span className="text-4xl sm:text-5xl font-black text-white">
                {match.score_a} – {match.score_b}
              </span>
            ) : (
              <>
                <span className="text-3xl font-black text-white/20">vs</span>
                <span className="text-xs text-white/35">
                  {new Date(match.match_date + 'T12:00:00').toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                  {' · '}{match.match_time?.slice(0,5)}
                </span>
              </>
            )}
            <span className="text-[10px] text-white/25">{match.venue}</span>
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-4xl sm:text-5xl">{match.flag_b}</span>
            <span className="font-black text-white text-base sm:text-lg text-center">{match.team_b}</span>
          </div>
        </div>
      </div>

      {/* Photo slot earned banner */}
      {photoSlots > 0 && (
        <div className="rounded-2xl p-4 flex items-center justify-between gap-4 animate-legendary"
          style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.06))', border: '1px solid rgba(255,215,0,0.4)' }}>
          <div>
            <p className="font-black text-white">🏆 ¡Ganaste {photoSlots} slot{photoSlots > 1 ? 's' : ''} de foto!</p>
            <p className="text-white/60 text-sm mt-0.5">Subí tu foto de este partido y se convierte en una carta especial</p>
          </div>
          <Link href={`/${locale}/upload?match=${match.id}&slot=earned`}
            className="shrink-0 px-4 py-2 rounded-full font-bold text-sm text-sg-bg hover:opacity-90 transition-opacity"
            style={{ background: '#ffd700' }}>
            Subir foto →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Predictions panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-white">Predicciones</h2>
            {!userId && (
              <span className="text-xs text-white/40">Iniciá sesión para predecir</span>
            )}
          </div>

          {isFinished && (
            <div className="rounded-xl p-3 text-sm text-white/50 bg-white/5 border border-white/10">
              Partido finalizado. Las predicciones se están resolviendo.
            </div>
          )}

          {/* Winner */}
          <PredictionWidget
            type="winner"
            title="¿Quién gana?"
            points={POINTS.winner}
            existing={getPred('winner')}
            disabled={!userId || isFinished || hasPred('winner')}
            loading={submitting === 'winner'}
          >
            <div className="grid grid-cols-3 gap-2 text-sm">
              {[
                { v: 'home', label: match.flag_a + ' ' + match.team_a },
                { v: 'draw', label: 'Empate' },
                { v: 'away', label: match.flag_b + ' ' + match.team_b },
              ].map(({ v, label }) => {
                const selected = winner === v;
                return (
                  <button key={v}
                    onClick={() => !hasPred('winner') && setWinner(v)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all border truncate ${
                      selected ? 'border-sg-green bg-sg-green/15 text-sg-green' : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
                    }`}>
                    {label}
                  </button>
                );
              })}
            </div>
            {winner && !hasPred('winner') && (
              <button onClick={() => handlePredict('winner', winner)}
                disabled={submitting === 'winner'}
                className="w-full mt-2 py-2 rounded-xl bg-sg-green text-sg-bg font-bold text-sm hover:bg-sg-green/90 transition-colors disabled:opacity-50">
                {submitting === 'winner' ? 'Guardando…' : 'Confirmar predicción'}
              </button>
            )}
          </PredictionWidget>

          {/* First goal team */}
          <PredictionWidget
            type="first_goal"
            title="Primer gol"
            points={POINTS.first_goal}
            existing={getPred('first_goal')}
            disabled={!userId || isFinished || hasPred('first_goal')}
            loading={submitting === 'first_goal'}
          >
            <div className="grid grid-cols-3 gap-2 text-sm">
              {[
                { v: 'home', label: match.flag_a },
                { v: 'none', label: '0-0' },
                { v: 'away', label: match.flag_b },
              ].map(({ v, label }) => {
                const selected = firstGoal === v;
                return (
                  <button key={v}
                    onClick={() => !hasPred('first_goal') && setFirstGoal(v)}
                    className={`py-2 rounded-xl text-base font-semibold transition-all border ${
                      selected ? 'border-sg-green bg-sg-green/15 text-sg-green' : 'border-white/10 text-white/50 hover:border-white/20'
                    }`}>
                    {label}
                  </button>
                );
              })}
            </div>
            {firstGoal && !hasPred('first_goal') && (
              <button onClick={() => handlePredict('first_goal', firstGoal)}
                disabled={submitting === 'first_goal'}
                className="w-full mt-2 py-2 rounded-xl bg-sg-green text-sg-bg font-bold text-sm hover:bg-sg-green/90 disabled:opacity-50">
                {submitting === 'first_goal' ? 'Guardando…' : 'Confirmar'}
              </button>
            )}
          </PredictionWidget>

          {/* FT Score */}
          <PredictionWidget
            type="ft_score"
            title="Resultado exacto"
            points={POINTS.ft_score}
            existing={getPred('ft_score')}
            disabled={!userId || isFinished || hasPred('ft_score')}
            loading={submitting === 'ft_score'}
          >
            <div className="flex items-center gap-2">
              <input type="number" min="0" max="20" value={ftScore.split('-')[0] ?? ''}
                onChange={e => { const a = e.target.value; const b = ftScore.split('-')[1] ?? '0'; setFtScore(`${a}-${b}`); }}
                className="w-16 text-center bg-sg-surface border border-white/10 text-white rounded-xl py-2 text-lg font-black outline-none focus:border-sg-green/50"
                placeholder="0" />
              <span className="text-white/40 font-bold text-lg">–</span>
              <input type="number" min="0" max="20" value={ftScore.split('-')[1] ?? ''}
                onChange={e => { const a = ftScore.split('-')[0] ?? '0'; const b = e.target.value; setFtScore(`${a}-${b}`); }}
                className="w-16 text-center bg-sg-surface border border-white/10 text-white rounded-xl py-2 text-lg font-black outline-none focus:border-sg-green/50"
                placeholder="0" />
              {ftScore.includes('-') && ftScore !== '-' && !hasPred('ft_score') && (
                <button onClick={() => handlePredict('ft_score', ftScore)}
                  disabled={submitting === 'ft_score'}
                  className="flex-1 py-2 rounded-xl bg-sg-green text-sg-bg font-bold text-sm hover:bg-sg-green/90 disabled:opacity-50">
                  {submitting === 'ft_score' ? '…' : 'OK'}
                </button>
              )}
            </div>
          </PredictionWidget>

          {/* Points explanation */}
          <div className="rounded-xl p-3 space-y-1.5"
            style={{ background: 'rgba(0,200,83,0.05)', border: '1px solid rgba(0,200,83,0.12)' }}>
            <p className="text-xs font-bold text-sg-green uppercase tracking-wider">Puntos por predicción</p>
            <div className="space-y-1 text-xs text-white/55">
              <div className="flex justify-between"><span>Ganador</span><span className="text-white/80 font-semibold">50 pts · 1 slot</span></div>
              <div className="flex justify-between"><span>Primer gol</span><span className="text-white/80 font-semibold">100 pts · 1 slot</span></div>
              <div className="flex justify-between"><span>Resultado exacto</span><span className="text-white/80 font-semibold">150 pts · 1 slot</span></div>
            </div>
          </div>
        </div>

        {/* Reactions panel */}
        <div className="space-y-4">
          <h2 className="font-black text-white">Reacciones en vivo</h2>

          {/* Reaction buttons */}
          <div className="grid grid-cols-3 gap-2">
            {REACTIONS.map(r => (
              <button key={r.id}
                onClick={() => userId ? sendReaction(r) : null}
                disabled={!userId}
                className="flex flex-col items-center gap-1 py-3 rounded-xl border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95">
                <span className="text-2xl">{r.label}</span>
                <span className="text-[10px] text-white/40">{r.text}</span>
              </button>
            ))}
          </div>

          {/* Live feed */}
          <div ref={feedRef}
            className="h-56 overflow-y-auto rounded-xl p-3 space-y-1.5 scrollbar-hide"
            style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.06)' }}>
            {feed.length === 0 ? (
              <p className="text-white/25 text-sm text-center py-8">
                {userId ? 'Sé el primero en reaccionar' : 'Iniciá sesión para reaccionar'}
              </p>
            ) : (
              [...feed].reverse().map(ev => (
                <div key={ev.id} className="flex items-center gap-2 animate-goal-card text-sm">
                  <span className="text-lg">{REACTIONS.find(r => r.id === ev.reaction)?.label ?? '⚽'}</span>
                  <span className="text-white/50 truncate">{ev.user}</span>
                </div>
              ))
            )}
          </div>

          {!userId && (
            <p className="text-center text-xs text-white/40">
              <Link href={`/${locale}/auth`} className="text-sg-green hover:underline">Iniciá sesión</Link> para predecir y reaccionar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Prediction widget wrapper ── */
function PredictionWidget({ type, title, points, existing, disabled, loading, children }: {
  type: PredictionType;
  title: string;
  points: number;
  existing?: { value: string; correct: boolean | null; points_earned: number } | undefined;
  disabled: boolean;
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-3 space-y-2.5"
      style={{ background: '#0d1117', border: existing ? '1px solid rgba(0,200,83,0.3)' : '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-white">{title}</span>
        <span className="text-[10px] font-semibold text-sg-green bg-sg-green/10 px-2 py-0.5 rounded-full">
          +{points} pts
        </span>
      </div>

      {existing ? (
        <div className={`rounded-lg px-3 py-2 text-sm flex items-center justify-between ${
          existing.correct === true ? 'bg-green-500/15 text-green-400' :
          existing.correct === false ? 'bg-red-500/15 text-red-400' :
          'bg-white/5 text-white/60'
        }`}>
          <span>Tu predicción: <strong>{existing.value}</strong></span>
          {existing.correct === true && <span className="font-bold">✓ +{existing.points_earned} pts</span>}
          {existing.correct === false && <span>✗</span>}
          {existing.correct === null && <span className="text-white/30">Pendiente</span>}
        </div>
      ) : (
        <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
          {children}
        </div>
      )}
    </div>
  );
}
