'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mic, TrendingUp, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-display font-bold text-xl text-neon">ALFA</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/studio" className="text-gray-300 hover:text-white transition-colors">
                Studio
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Planos
              </Link>
              <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">
                Docs
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Entrar
              </Link>
              <Link href="/studio" className="glass-button">
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-6">
              <span className="text-neon">ALFA</span>
              <br />
              <span className="text-white">Voice Crypto</span>
              <br />
              <span className="text-gradient">Copilot</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Análise de criptomoedas por comando de voz em português brasileiro. 
              Fale e receba insights instantâneos sobre o mercado crypto.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/studio">
                <motion.button
                  className="glass-button flex items-center gap-2 px-8 py-4 text-lg bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border-neon-blue/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mic className="w-6 h-6" />
                  Experimentar Grátis
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <Link href="/demo">
                <motion.button
                  className="glass-button px-8 py-4 text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver Demo
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-neon">
              Recursos Principais
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Tecnologia de ponta para análise de criptomoedas através de comandos de voz
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: 'Comando de Voz',
                description: 'Fale naturalmente em português e receba análises instantâneas sobre qualquer criptomoeda.',
                color: 'from-neon-blue to-blue-600'
              },
              {
                icon: TrendingUp,
                title: 'Análise em Tempo Real',
                description: 'Dados atualizados de múltiplas exchanges com análise técnica e fundamental completa.',
                color: 'from-neon-purple to-purple-600'
              },
              {
                icon: Zap,
                title: 'Respostas Instantâneas',
                description: 'IA avançada processa suas perguntas e retorna insights em áudio em segundos.',
                color: 'from-green-400 to-emerald-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                className="glass-card p-8 text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-card p-12 text-center bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border-neon-blue/20"
          >
            <Shield className="w-16 h-16 mx-auto mb-6 text-neon-blue" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
              Pronto para revolucionar suas análises crypto?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de traders que já usam o ALFA para tomar decisões mais inteligentes no mercado de criptomoedas.
            </p>
            <Link href="/studio">
              <motion.button
                className="glass-button flex items-center gap-2 px-8 py-4 text-lg bg-gradient-to-r from-neon-blue/30 to-neon-purple/30 border-neon-blue/50 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mic className="w-6 h-6" />
                Começar Gratuitamente
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-display font-bold text-xl text-neon">ALFA</span>
              </div>
              <p className="text-gray-400 text-sm">
                O futuro da análise de criptomoedas por voz.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/studio" className="hover:text-white transition-colors">Studio</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Planos</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentação</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Suporte</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">Sobre</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Termos</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 ALFA Voice Crypto Copilot. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}