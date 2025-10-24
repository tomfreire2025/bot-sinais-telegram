'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic, BarChart3, History, Settings, User, LogOut } from 'lucide-react';
import Recorder from '@/components/Recorder';
import { toast } from 'react-hot-toast';

interface Conversation {
  id: string;
  timestamp: Date;
  audioUrl?: string;
  transcription: string;
  response: string;
  responseAudioUrl?: string;
}

export default function StudioPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTab, setCurrentTab] = useState<'recorder' | 'history' | 'dashboard'>('recorder');

  // Simular processamento de áudio
  const handleAudioData = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true);
    toast.loading('Processando áudio...', { id: 'processing' });

    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular resposta da IA
      const mockResponse = "Baseado na sua pergunta sobre Bitcoin, posso ver que o preço atual está em $43,250, com uma variação de +2.3% nas últimas 24 horas. O volume de negociação está acima da média, indicando forte interesse dos investidores. Recomendo monitorar o nível de resistência em $44,000.";

      const newConversation: Conversation = {
        id: Date.now().toString(),
        timestamp: new Date(),
        audioUrl: URL.createObjectURL(audioBlob),
        transcription: "Qual é a situação atual do Bitcoin?",
        response: mockResponse,
        responseAudioUrl: undefined, // Seria gerado pelo TTS
      };

      setConversations(prev => [newConversation, ...prev]);
      toast.success('Análise concluída!', { id: 'processing' });

    } catch (error) {
      console.error('Erro no processamento:', error);
      toast.error('Erro ao processar áudio', { id: 'processing' });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleTranscription = useCallback((text: string) => {
    console.log('Transcrição:', text);
  }, []);

  const tabs = [
    { id: 'recorder', label: 'Gravação', icon: Mic },
    { id: 'history', label: 'Histórico', icon: History },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-alfa-primary/20 bg-alfa-darker/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-alfa rounded-xl flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient-alfa">ALFA Studio</h1>
                <p className="text-sm text-alfa-muted">Voice Crypto Copilot</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-alfa-muted">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Conectado</span>
              </div>
              <button className="p-2 rounded-xl bg-alfa-darker hover:bg-alfa-primary/20 transition-colors">
                <Settings className="w-5 h-5 text-alfa-light" />
              </button>
              <button className="p-2 rounded-xl bg-alfa-darker hover:bg-alfa-primary/20 transition-colors">
                <User className="w-5 h-5 text-alfa-light" />
              </button>
              <button className="p-2 rounded-xl bg-alfa-darker hover:bg-red-500/20 transition-colors">
                <LogOut className="w-5 h-5 text-alfa-light" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-alfa p-6">
              <h2 className="text-lg font-semibold text-alfa-light mb-4">
                Navegação
              </h2>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
                      ${currentTab === tab.id 
                        ? 'bg-gradient-alfa text-white shadow-alfa' 
                        : 'text-alfa-muted hover:text-alfa-light hover:bg-alfa-darker'
                      }
                    `}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Estatísticas rápidas */}
              <div className="mt-8 p-4 bg-alfa-darker rounded-xl">
                <h3 className="text-sm font-semibold text-alfa-light mb-3">
                  Estatísticas
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-alfa-muted">Consultas hoje:</span>
                    <span className="text-alfa-primary font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-alfa-muted">Plano:</span>
                    <span className="text-green-400 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-alfa-muted">Restante:</span>
                    <span className="text-alfa-light font-semibold">8/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {currentTab === 'recorder' && (
                <motion.div
                  key="recorder"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Recorder
                    onAudioData={handleAudioData}
                    onTranscription={handleTranscription}
                    isRecording={isProcessing}
                    className="mb-8"
                  />

                  {/* Instruções */}
                  <div className="card-alfa p-6">
                    <h3 className="text-lg font-semibold text-alfa-light mb-4">
                      Como usar o ALFA Studio
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-alfa-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-white">1</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-alfa-light">Grave sua pergunta</h4>
                            <p className="text-sm text-alfa-muted">
                              Clique no botão de gravação e fale naturalmente sobre criptomoedas.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-alfa-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-white">2</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-alfa-light">Processamento IA</h4>
                            <p className="text-sm text-alfa-muted">
                              Nossa IA analisa sua pergunta e busca dados atualizados do mercado.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-alfa-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-white">3</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-alfa-light">Receba a resposta</h4>
                            <p className="text-sm text-alfa-muted">
                              Obtenha análises detalhadas, cotações e recomendações em tempo real.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-alfa-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-white">4</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-alfa-light">Acompanhe o histórico</h4>
                            <p className="text-sm text-alfa-muted">
                              Revise todas as suas consultas e análises na aba Histórico.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card-alfa p-6 mb-6">
                    <h2 className="text-2xl font-bold text-alfa-light mb-6">
                      Histórico de Conversas
                    </h2>
                    
                    {conversations.length === 0 ? (
                      <div className="text-center py-12">
                        <History className="w-16 h-16 text-alfa-muted mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-alfa-light mb-2">
                          Nenhuma conversa ainda
                        </h3>
                        <p className="text-alfa-muted">
                          Comece fazendo sua primeira pergunta sobre criptomoedas!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {conversations.map((conversation) => (
                          <div
                            key={conversation.id}
                            className="card-alfa-dark p-6 hover-lift"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-alfa rounded-xl flex items-center justify-center">
                                  <Mic className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-alfa-light">
                                    {conversation.transcription}
                                  </h3>
                                  <p className="text-sm text-alfa-muted">
                                    {conversation.timestamp.toLocaleString('pt-BR')}
                                  </p>
                                </div>
                              </div>
                              {conversation.audioUrl && (
                                <audio controls className="w-32">
                                  <source src={conversation.audioUrl} type="audio/webm" />
                                </audio>
                              )}
                            </div>
                            <div className="p-4 bg-alfa-darker rounded-xl">
                              <h4 className="text-sm font-semibold text-alfa-primary mb-2">
                                Resposta da IA:
                              </h4>
                              <p className="text-alfa-light text-sm leading-relaxed">
                                {conversation.response}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card-alfa p-6">
                    <h2 className="text-2xl font-bold text-alfa-light mb-6">
                      Dashboard Pro
                    </h2>
                    <div className="text-center py-12">
                      <BarChart3 className="w-16 h-16 text-alfa-muted mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-alfa-light mb-2">
                        Dashboard em desenvolvimento
                      </h3>
                      <p className="text-alfa-muted mb-6">
                        Esta funcionalidade estará disponível no plano Pro.
                      </p>
                      <button className="btn-alfa">
                        Upgrade para Pro
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}