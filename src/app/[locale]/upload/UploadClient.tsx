'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { uploadCard } from '@/lib/supabase/actions';

interface Match {
  id: string;
  team_a: string;
  team_b: string;
  flag_a: string;
  flag_b: string;
  stage: string;
}

interface Props {
  matches: Match[];
  isLoggedIn: boolean;
}

export default function UploadClient({ matches, isLoggedIn }: Props) {
  const t = useTranslations('Upload');
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview]   = useState<string | null>(null);
  const [file, setFile]         = useState<File | null>(null);
  const [match, setMatch]       = useState('');
  const [caption, setCaption]   = useState('');
  const [phase, setPhase]       = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [error, setError]       = useState('');
  const [dragOver, setDragOver] = useState(false);

  function handleFile(f: File) {
    if (!f.type.startsWith('image/')) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !match) return;
    setPhase('uploading');
    setError('');
    try {
      const fd = new FormData();
      fd.append('photo', file);
      fd.append('match_id', match);
      fd.append('caption', caption);
      await uploadCard(fd);
      setPhase('done');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPhase('error');
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-4xl">🔒</p>
        <p className="text-white font-semibold">Sign in to upload photos</p>
        <p className="text-white/40 text-sm">You need an account to create cards.</p>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="text-center space-y-6 py-16">
        <div className="w-20 h-20 rounded-full bg-sg-green/20 border-2 border-sg-green flex items-center justify-center mx-auto text-3xl">
          ✓
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{t('success_title')}</h2>
          <p className="text-white/40 mt-1 text-sm">Your photo is now a collectible card!</p>
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="../album" className="px-6 py-2.5 rounded-full bg-sg-green text-sg-bg font-bold text-sm hover:bg-sg-green/90 transition-colors">
            {t('success_cta')}
          </a>
          <button onClick={() => { setPhase('idle'); setPreview(null); setFile(null); setMatch(''); setCaption(''); }}
            className="px-6 py-2.5 rounded-full border border-white/10 text-white/60 font-semibold text-sm hover:text-white transition-colors">
            Upload another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Drop zone */}
      <div
        className={`relative rounded-2xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden ${
          dragOver ? 'border-sg-green bg-sg-green/5' : 'border-white/10 hover:border-white/20'
        }`}
        style={{ minHeight: 260 }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        {preview ? (
          <div className="relative h-64 w-full">
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <button type="button"
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white/70 text-sm hover:bg-black/80 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}>
              ✕
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-16 px-8 text-center">
            <span className="text-4xl opacity-40">📸</span>
            <p className="font-semibold text-white/50">{t('drop_here')}</p>
            <p className="text-white/30 text-sm">{t('or_browse')}</p>
            <p className="text-white/20 text-xs mt-2">{t('max_size')}</p>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
          className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>

      <p className="text-xs text-white/30 text-center">💡 {t('photo_tips')}</p>

      {/* Match selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/60">{t('select_match')}</label>
        <select value={match} onChange={(e) => setMatch(e.target.value)} required
          className="w-full bg-sg-surface border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-sg-green/40 transition-colors">
          <option value="" disabled>{t('select_match')}</option>
          {matches.map((m) => (
            <option key={m.id} value={m.id}>
              {m.flag_a} {m.team_a} vs {m.team_b} {m.flag_b}
            </option>
          ))}
        </select>
      </div>

      {/* Caption */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/60">{t('caption_label')}</label>
        <textarea value={caption} onChange={(e) => setCaption(e.target.value)}
          placeholder={t('caption_placeholder')} rows={3}
          className="w-full bg-sg-surface border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-sg-green/40 transition-colors resize-none placeholder:text-white/20" />
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <button type="submit" disabled={!preview || !match || phase === 'uploading'}
        className="w-full py-3.5 rounded-xl font-bold text-sg-bg text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg, #009624, #00c853)' }}>
        {phase === 'uploading' ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-sg-bg border-t-transparent animate-spin" />
            {t('uploading')}
          </span>
        ) : t('submit')}
      </button>
    </form>
  );
}
