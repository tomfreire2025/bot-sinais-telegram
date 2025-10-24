'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Settings, 
  History, 
  TrendingUp, 
  Volume2,
  MessageSquare,
  Sparkles,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { Recorder } from '@/components/Recorder';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  cryptoData?: {
    symbol: string;
    price: number;
    change24h: number;
    volume: number;
  };
}

interface CryptoCard {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
}

export default function StudioPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  
  // Mock data para demonstração
  const [topCryptos] = useState<CryptoCard[]>([
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 43250.50,
      change24h: 2.45,
      volume: 28500000000,
      marketCap: 850000000000
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2650.75,
      change24h: -1.23,
      volume: 15200000000,
      marketCap: 320000000000
    },
    {
      symbol: 'BNB',
      name: 'BNB',
      price: 315.20,
      change24h: 0.87,
      volume: 2100000000,
      marketCap: 48000000000
    }
  ]);

  const handleAudioReady = useCallback((audioBlob: Blob) => {
    console.log('Áudio pronto para processamento:', audioBlob);
  }, []);

  const handleTranscriptionStart = useCallback(() => {
    setIsProcessing(true);
    setCurrentTranscription('Processando áudio...');
  }, []);

  const handleTranscriptionComplete = useCallback((text: string) => {
    setCurrentTranscription(text);
    
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simular resposta da IA (em produção, isso viria da API)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Analisando ${text.includes('bitcoin') || text.includes('BTC') ? 'Bitcoin' : 'criptomoedas'}... O Bitcoin está atualmente em $43.250,50 com alta de 2,45% nas últimas 24 horas. O volume de negociação está forte, indicando interesse contínuo dos investidores.`,
        timestamp: new Date(),
        cryptoData: text.includes('bitcoin') || text.includes('BTC') ? {
          symbol: 'BTC',
          price: 43250.50,
          change24h: 2.45,
          volume: 28500000000
        } : undefined
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
      setCurrentTranscription('');
    }, 2000);
  }, []);

  const handleError = useCallback((error: string) => {
    console.error('Erro no recorder:', error);
    setIsProcessing(false);
    setCurrentTranscription('');
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-card border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="glass-button p-2">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-display font-bold text-neon">
                  ALFA Studio
                </h1>
                <p className="text-sm text-gray-400">
                  Análise de cripto por comando de voz
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="glass-button p-2" title="Histórico">
                <History className="w-5 h-5" />
              </button>
              <button className="glass-button p-2" title="Configurações">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Painel Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gravador de Voz */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Recorder
                onAudioReady={handleAudioReady}
                onTranscriptionStart={handleTranscriptionStart}
                onTranscriptionComplete={handleTranscriptionComplete}
                onError={handleError}
                maxDuration={300}
                className="w-full"
              />
            </motion.div>

            {/* Status de Transcrição */}
            <AnimatePresence>
              {currentTranscription && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="loading-spinner" />
                    <div>
                      <p className="font-medium text-neon">Processando...</p>
                      <p className="text-sm text-gray-300">{currentTranscription}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Conversa */}
            <div className="space-y-4">
              <h2 className="text-xl font-display font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-neon-blue" />
                Conversa
              </h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass-card p-6 text-center"
                    >
                      <Sparkles className="w-12 h-12 mx-auto mb-4 text-neon-purple" />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Comece sua análise
                      </h3>
                      <p className="text-gray-400">
                        Grave um comando de voz para obter insights sobre criptomoedas
                      </p>
                      <div className="mt-4 text-sm text-gray-500">
                        <p>Exemplos:</p>
                        <ul className="mt-2 space-y-1">
                          <li>"Como está o Bitcoin hoje?"</li>
                          <li>"Análise técnica do Ethereum"</li>
                          <li>"Preço da BNB nas últimas 24 horas"</li>
                        </ul>
                      </div>
                    </motion.div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md glass-card p-4 ${
                          message.type === 'user' 
                            ? 'bg-neon-blue/10 border-neon-blue/20' 
                            : 'bg-neon-purple/10 border-neon-purple/20'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            {message.type === 'user' ? (
                              <Volume2 className="w-4 h-4 text-neon-blue" />
                            ) : (
                              <Sparkles className="w-4 h-4 text-neon-purple" />
                            )}
                            <span className="text-xs text-gray-400">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-white">{message.content}</p>
                          
                          {message.cryptoData && (
                            <div className="mt-3 p-3 bg-black/20 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-white">
                                  {message.cryptoData.symbol}
                                </span>
                                <span className="text-lg font-bold text-white">
                                  ${message.cryptoData.price.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-400">24h</span>
                                <span className={`text-xs font-medium ${
                                  message.cryptoData.change24h >= 0 
                                    ? 'text-green-400' 
                                    : 'text-red-400'
                                }`}>
                                  {message.cryptoData.change24h >= 0 ? '+' : ''}
                                  {message.cryptoData.change24h.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Painel Lateral */}
          <div className="space-y-6">
            {/* Top Cryptos */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-neon-green" />
                Top Criptomoedas
              </h2>
              
              <div className="space-y-3">
                {topCryptos.map((crypto, index) => (
                  <motion.div
                    key={crypto.symbol}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="glass-card p-4 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {crypto.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">
                            {crypto.symbol}
                          </p>
                          <p className="text-xs text-gray-400">{crypto.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white text-sm">
                          ${crypto.price.toLocaleString()}
                        </p>
                        <p className={`text-xs font-medium ${
                          crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {crypto.change24h >= 0 ? '+' : ''}
                          {crypto.change24h.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div>
                        <span>Volume: </span>
                        <span className="text-white">{formatNumber(crypto.volume)}</span>
                      </div>
                      <div>
                        <span>Cap: </span>
                        <span className="text-white">{formatNumber(crypto.marketCap)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-neon-purple" />
                Ações Rápidas
              </h2>
              
              <div className="space-y-3">
                {[
                  { label: 'Análise de Mercado', icon: TrendingUp },
                  { label: 'Alertas de Preço', icon: AlertCircle },
                  { label: 'Portfolio', icon: BarChart3 },
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="w-full glass-button flex items-center gap-3 p-4 text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <action.icon className="w-5 h-5 text-neon-blue" />
                    <span className="text-white">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass-card p-4"
            >
              <h3 className="font-semibold text-white mb-3">Status do Sistema</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">API Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Dados de Mercado</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400">Atualizado</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">STT/TTS</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400">Ativo</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}