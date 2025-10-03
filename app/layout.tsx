import type { Metadata } from 'next';
import { Anton, Montserrat } from 'next/font/google';
import './globals.css';
import ClientProviders from '@/components/ClientProviders';

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Suncoast Dive Center - Your Premier Dive Shop',
  description: 'Explore the underwater world with Suncoast Dive Center. Professional dive equipment, training, and guided tours.',
  keywords: 'scuba diving, dive equipment, dive training, suncoast, dive center',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${anton.variable} ${montserrat.variable}`}>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}