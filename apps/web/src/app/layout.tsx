import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ALFA - Voice Crypto Copilot',
  description: 'SaaS de análise de criptomoedas por voz em português brasileiro',
  keywords: ['criptomoedas', 'bitcoin', 'análise', 'voz', 'IA', 'trading'],
  authors: [{ name: 'ALFA Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'ALFA - Voice Crypto Copilot',
    description: 'Fale sobre criptomoedas e receba análises em tempo real',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F1115',
              color: '#F8FAFC',
              border: '1px solid #00D4FF',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#00D4FF',
                secondary: '#0F1115',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#0F1115',
              },
            },
          }}
        />
      </body>
    </html>
  );
}