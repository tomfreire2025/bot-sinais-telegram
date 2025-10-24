import Link from 'next/link'
import { Mic, TrendingUp, Zap, Shield, BarChart3, Bell } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      
      {/* Gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-alfa-blue rounded-full blur-3xl opacity-20 animate-pulse-slow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-alfa-purple rounded-full blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-alfa flex items-center justify-center shadow-glow-alfa">
                <span className="text-2xl font-bold">Α</span>
              </div>
              <span className="text-2xl font-bold text-gradient-alfa">ALFA</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/studio" className="btn-alfa-ghost">
                Entrar
              </Link>
              <Link href="/studio" className="btn-alfa">
                Começar Grátis
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-4 py-2 glass rounded-full">
              <span className="text-alfa-blue font-semibold">🎙️ Novo: Análise por Voz em Tempo Real</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Seu Assistente de Voz para{' '}
              <span className="text-gradient-alfa">Criptomoedas</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Converse com ALFA e receba análises detalhadas do mercado cripto em tempo real.
              Totalmente em português, 100% por voz.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Link href="/studio" className="btn-alfa text-lg">
                <Mic className="inline mr-2" size={20} />
                Iniciar Conversa
              </Link>
              <Link href="#features" className="btn-alfa-outline text-lg">
                Saber Mais
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="card-alfa">
                <div className="text-3xl font-bold text-gradient-alfa">1M+</div>
                <div className="text-sm text-gray-400">Consultas</div>
              </div>
              <div className="card-alfa">
                <div className="text-3xl font-bold text-gradient-alfa">50ms</div>
                <div className="text-sm text-gray-400">Latência</div>
              </div>
              <div className="card-alfa">
                <div className="text-3xl font-bold text-gradient-alfa">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Tudo que você precisa em{' '}
              <span className="text-gradient-alfa">um só lugar</span>
            </h2>
            <p className="text-gray-400">Tecnologia de ponta para análise de criptomoedas</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Mic size={32} />}
              title="100% por Voz"
              description="Grave sua pergunta e receba a resposta em áudio. Sem digitação, sem complicação."
            />
            <FeatureCard
              icon={<Zap size={32} />}
              title="Tempo Real"
              description="Dados atualizados instantaneamente das principais exchanges do mundo."
            />
            <FeatureCard
              icon={<TrendingUp size={32} />}
              title="Análise Inteligente"
              description="IA avançada analisa tendências e fornece insights acionáveis."
            />
            <FeatureCard
              icon={<BarChart3 size={32} />}
              title="Gráficos Interativos"
              description="Visualize preços, volumes e indicadores técnicos em tempo real."
            />
            <FeatureCard
              icon={<Bell size={32} />}
              title="Alertas Personalizados"
              description="Receba notificações quando seus ativos atingirem preços-alvo."
            />
            <FeatureCard
              icon={<Shield size={32} />}
              title="Segurança Total"
              description="Seus dados protegidos com criptografia de ponta a ponta."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-20">
          <div className="card-alfa max-w-4xl mx-auto text-center p-12 shadow-glow-alfa">
            <h2 className="text-4xl font-bold mb-4">
              Pronto para começar?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Experimente ALFA gratuitamente. Sem cartão de crédito necessário.
            </p>
            <Link href="/studio" className="btn-alfa text-lg">
              <Mic className="inline mr-2" size={20} />
              Começar Agora
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-alfa-gray">
          <div className="text-center text-gray-400">
            <p>© 2024 ALFA Voice Crypto Copilot. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card-alfa group">
      <div className="w-16 h-16 rounded-2xl bg-gradient-alfa flex items-center justify-center mb-4 shadow-glow-alfa group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
