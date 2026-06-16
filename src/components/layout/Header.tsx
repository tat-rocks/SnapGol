'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/lib/navigation';
import { LOCALE_LABELS } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/auth/AuthModal';
import { signOut } from '@/lib/supabase/actions';

const locales = Object.entries(LOCALE_LABELS);

export default function Header({ user }: { user?: { email?: string } | null }) {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [showAuth, setShowAuth]       = useState(false);

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next });
  }

  return (
    <>
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-sg-bg/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-lg font-black tracking-tight">
              <span className="text-sg-green">Snap</span>
              <span className="text-white">Gol</span>
            </span>
            <span className="hidden sm:inline-block text-lg">⚽</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors rounded-md hover:bg-white/5">
              {t('home')}
            </Link>
            <Link href="/album" className="px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors rounded-md hover:bg-white/5">
              {t('album')}
            </Link>
            <Link href="/marketplace" className="px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors rounded-md hover:bg-white/5">
              {t('marketplace')}
            </Link>
            <Link href="/upload" className="px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors rounded-md hover:bg-white/5">
              {t('upload')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Locale switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-8 items-center gap-1 rounded-md px-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-xs">
                <span>🌐</span>
                <span className="hidden sm:inline uppercase">{locale}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-sg-surface border-white/10">
                {locales.map(([code, label]) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => switchLocale(code)}
                    className={`text-sm cursor-pointer ${code === locale ? 'text-sg-green' : 'text-white/70'}`}
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Open Pack CTA */}
            <Link href="/pack">
              <Button size="sm" className="hidden sm:flex h-8 bg-sg-green text-sg-bg font-bold hover:bg-sg-green/90 text-xs">
                {t('openPack')} ✦
              </Button>
            </Link>

            {/* Auth */}
            {user ? (
              <form action={signOut}>
                <Button type="submit" variant="outline" size="sm" className="h-8 text-xs border-white/10 text-white/70 hover:text-white hover:border-white/20">
                  Sign out
                </Button>
              </form>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowAuth(true)}
                className="h-8 text-xs border-white/10 text-white/70 hover:text-white hover:border-white/20">
                {t('signIn')}
              </Button>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 text-white/60 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-white/5 flex flex-col gap-1">
            {[
              { href: '/', label: t('home') },
              { href: '/album', label: t('album') },
              { href: '/marketplace', label: t('marketplace') },
              { href: '/upload', label: t('upload') },
              { href: '/pack', label: t('openPack') },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>

    {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
  </>
  );
}
