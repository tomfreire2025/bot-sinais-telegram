import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ALFA - Voice Crypto Copilot',
  description: 'Assistente de voz inteligente para análise de criptomoedas em tempo real',
  keywords: ['crypto', 'bitcoin', 'voice', 'ai', 'assistant'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-alfa-dark text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
