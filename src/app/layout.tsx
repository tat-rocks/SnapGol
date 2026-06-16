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
  title: 'SnapGol — Capture the World Cup',
  description:
    'The world\'s first fan-powered World Cup digital sticker collection. Upload your best photos, earn rare cards, complete your album.',
  openGraph: {
    title: 'SnapGol',
    description: 'Snap. Collect. Trade.',
    siteName: 'SnapGol',
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
