import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: 'ALFA - Voice Crypto Copilot',
  description: 'Análise de criptomoedas por comando de voz em português brasileiro',
  keywords: ['cryptocurrency', 'voice assistant', 'crypto analysis', 'bitcoin', 'blockchain'],
  authors: [{ name: 'Equipe ALFA' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0ea5e9',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'ALFA - Voice Crypto Copilot',
    description: 'Análise de criptomoedas por comando de voz em português brasileiro',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'ALFA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALFA - Voice Crypto Copilot',
    description: 'Análise de criptomoedas por comando de voz em português brasileiro',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${orbitron.variable}`}>
      <body className="min-h-screen bg-dark-950 text-white antialiased">
        <div className="relative min-h-screen">
          {/* Background Pattern */}
          <div className="fixed inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 opacity-90" />
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neon-blue/10 via-transparent to-neon-purple/10" />
          
          {/* Grid Pattern */}
          <div className="fixed inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}