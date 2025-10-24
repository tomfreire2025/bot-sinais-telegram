import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mic, BarChart3, Zap, Shield, Star, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-alfa rounded-xl flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient-alfa">ALFA</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            <Link
              href="/studio"
              className="btn-alfa-ghost"
            >
              Entrar no Studio
            </Link>
            <Link
              href="/login"
              className="btn-alfa"
            >
              Começar Agora
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold">
              <span className="text-gradient-alfa">ALFA</span>
              <br />
              <span className="text-alfa-light">Voice Crypto</span>
              <br />
              <span className="text-gradient-neon">Copilot</span>
            </h1>

            <p className="text-xl md:text-2xl text-alfa-muted max-w-3xl mx-auto leading-relaxed">
              Fale sobre criptomoedas e receba análises em tempo real, 
              cotações atualizadas e alertas personalizados através de voz.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/studio"
                className="btn-alfa text-lg px-8 py-4 group"
              >
                <Mic className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Começar a Falar
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#features"
                className="btn-alfa-secondary text-lg px-8 py-4"
              >
                Ver Funcionalidades
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Partículas flutuantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-alfa mb-6">
              Funcionalidades
            </h2>
            <p className="text-xl text-alfa-muted max-w-2xl mx-auto">
              Tecnologia avançada para análise de criptomoedas por voz
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card-alfa hover-lift group"
              >
                <div className="w-16 h-16 bg-gradient-alfa rounded-2xl flex items-center justify-center mb-6 group-hover:animate-pulse">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-alfa-light mb-4">
                  {feature.title}
                </h3>
                <p className="text-alfa-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="card-alfa-dark p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-alfa mb-6">
              Pronto para Começar?
            </h2>
            <p className="text-xl text-alfa-muted mb-8 max-w-2xl mx-auto">
              Junte-se à revolução da análise de criptomoedas por voz. 
              Comece gratuitamente e explore o futuro do trading.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/studio"
                className="btn-alfa text-lg px-8 py-4"
              >
                <Mic className="w-5 h-5 mr-2" />
                Acessar Studio
              </Link>
              <Link
                href="/pricing"
                className="btn-alfa-secondary text-lg px-8 py-4"
              >
                Ver Planos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-alfa-primary/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-alfa rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient-alfa">ALFA</span>
          </div>
          <p className="text-alfa-muted">
            © 2024 ALFA Voice Crypto Copilot. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Mic,
    title: 'Gravação por Voz',
    description: 'Fale naturalmente sobre criptomoedas e receba respostas instantâneas através de nossa IA avançada.',
  },
  {
    icon: BarChart3,
    title: 'Análises em Tempo Real',
    description: 'Acesse dados atualizados do mercado crypto, gráficos interativos e insights personalizados.',
  },
  {
    icon: Zap,
    title: 'Respostas Instantâneas',
    description: 'Receba análises e recomendações em segundos, otimizadas para traders e investidores.',
  },
  {
    icon: Shield,
    title: 'Segurança Avançada',
    description: 'Seus dados e conversas são protegidos com criptografia de ponta a ponta.',
  },
  {
    icon: Star,
    title: 'IA Especializada',
    description: 'Modelo treinado especificamente para análise de criptomoedas e mercado financeiro.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Pro',
    description: 'Interface completa com gráficos, alertas personalizados e histórico de conversas.',
  },
];