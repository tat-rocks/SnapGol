import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'SnapGol — Capture the World Cup',
    template: '%s | SnapGol',
  },
  description:
    "The world's first fan-powered World Cup 2026 digital sticker collection. Upload your best photos, earn rare cards, complete your album and trade with fans worldwide.",
  keywords: ['World Cup 2026', 'digital stickers', 'collectible cards', 'NFT', 'football', 'soccer', 'album', 'SnapGol'],
  authors: [{ name: 'SnapGol' }],
  creator: 'SnapGol',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://snap-1x4vchlwa-tat-rocks.vercel.app'),
  openGraph: {
    type: 'website',
    siteName: 'SnapGol',
    title: 'SnapGol — Snap. Collect. Trade.',
    description:
      "The world's first fan-powered World Cup 2026 digital sticker collection. Upload photos, earn rare cards, complete your album.",
    url: '/',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnapGol — Snap. Collect. Trade.',
    description:
      "The world's first fan-powered World Cup 2026 digital sticker collection. Upload photos, earn rare cards, complete your album.",
    creator: '@snapgol',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-sg-bg text-sg-text antialiased">
        {children}
      </body>
    </html>
  );
}
