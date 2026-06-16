'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { signInWithGoogle, signInWithMagicLink, signInWithPassword } from '@/lib/supabase/actions';

interface Props {
  onClose: () => void;
}

export default function AuthModal({ onClose }: Props) {
  const t = useTranslations('Nav');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode]         = useState<'magic' | 'password'>('magic');
  const [sent, setSent]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await signInWithMagicLink(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message ?? 'Error sending link');
    } finally {
      setLoading(false);
    }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await signInWithPassword(email, password);
    } catch (err: any) {
      setError(err.message ?? 'Invalid credentials');
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm rounded-2xl bg-sg-surface border border-white/10 p-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">
              <span className="text-sg-green">Snap</span>Gol
            </h2>
            <p className="text-sm text-white/40">{sent ? 'Check your inbox' : 'Sign in to collect cards'}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl">✕</button>
        </div>

        {sent ? (
          <div className="text-center space-y-3 py-4">
            <div className="text-4xl">📬</div>
            <p className="text-white font-semibold">Magic link sent!</p>
            <p className="text-white/40 text-sm">Check <strong className="text-white/60">{email}</strong> and click the link.</p>
          </div>
        ) : (
          <>
            {/* Google */}
            <form action={signInWithGoogle}>
              <button type="submit"
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl
                           border border-white/10 text-white font-semibold text-sm
                           hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/30">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Mode toggle */}
            <div className="flex rounded-lg bg-sg-surface-2 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setMode('magic')}
                className={`flex-1 py-1.5 rounded-md transition-colors ${mode === 'magic' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                Magic Link
              </button>
              <button
                onClick={() => setMode('password')}
                className={`flex-1 py-1.5 rounded-md transition-colors ${mode === 'password' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                Password
              </button>
            </div>

            {mode === 'magic' ? (
              <form onSubmit={handleMagicLink} className="space-y-3">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="w-full bg-sg-surface-2 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder:text-white/20 outline-none focus:border-sg-green/40 transition-colors" />
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-sg-bg text-sm disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #009624, #00c853)' }}>
                  {loading ? 'Sending…' : 'Send Magic Link ✦'}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePassword} className="space-y-3">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="w-full bg-sg-surface-2 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder:text-white/20 outline-none focus:border-sg-green/40 transition-colors" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" required
                  className="w-full bg-sg-surface-2 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder:text-white/20 outline-none focus:border-sg-green/40 transition-colors" />
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-sg-bg text-sm disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #009624, #00c853)' }}>
                  {loading ? 'Signing in…' : 'Sign In →'}
                </button>
              </form>
            )}
          </>
        )}

        <p className="text-center text-xs text-white/20">
          By signing in you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
