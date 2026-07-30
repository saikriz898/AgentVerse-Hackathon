import type { Metadata } from 'next';
import './globals.css';
import { RootProviders } from '@/components/providers/RootProviders';

export const metadata: Metadata = {
  title: 'LifeOS — Autonomous AI Operating System',
  description: 'Premium Multi-Agent Operating System with Chief of Staff and 6 Specialist Agents.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-[hsl(var(--accent-light))] selection:text-[hsl(var(--accent-primary))]">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
