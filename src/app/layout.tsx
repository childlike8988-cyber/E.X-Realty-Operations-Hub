import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { ThemeProvider } from '@/components/theme/theme-provider';

export const metadata: Metadata = {
  metadataBase: new URL('https://realty.excreatorstudio.com/'),
  title: 'E.X Realty Operations Hub',
  description: 'AI-Powered Real Estate Operations Center',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'E.X Realty Operations Hub',
    description: 'AI-Powered Real Estate Operations Center',
    url: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-Hant"><body><ThemeProvider><AppShell>{children}</AppShell></ThemeProvider></body></html>;
}
