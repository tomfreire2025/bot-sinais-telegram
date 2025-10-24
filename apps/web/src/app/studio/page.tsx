'use client'

import { useState, useRef, useEffect } from 'react'
import { Recorder } from '@/components/Recorder'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  Send, 
  Volume2, 
  TrendingUp, 
  Bell,
  Settings,
  LogOut,
  MessageSquare,
  Sparkles
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  audioUrl?: string
}

export default function StudioPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Lida com transcrição completada
  const handleTranscriptionComplete = async (text: string, audioBlob: Blob) => {
    // Adiciona mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    // Envia para API e recebe resposta
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      formData.append('text', text)

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Erro na resposta')

      const data = await response.json()
      
      // Adiciona mensagem do assistente
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text,
        timestamp: new Date(),
        audioUrl: data.audioUrl,
      }
      setMessages(prev => [...prev, assistantMessage])

      // Reproduz áudio da resposta
      if (data.audioUrl) {
        playAudio(data.audioUrl)
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error)
      // Adiciona mensagem de erro
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  // Reproduz áudio da resposta
  const playAudio = (audioUrl: string) => {
    if (currentAudio) {
      currentAudio.pause()
    }

    const audio = new Audio(audioUrl)
    setCurrentAudio(audio)
    setIsAssistantSpeaking(true)

    audio.addEventListener('ended', () => {
      setIsAssistantSpeaking(false)
    })

    audio.play()
  }

  // Lida com erros
  const handleError = (error: Error) => {
    console.error('Erro no recorder:', error)
    // TODO: Mostrar toast/notificação
  }

  return (
    <div className="min-h-screen flex flex-col bg-alfa-dark">
      {/* Header */}
      <header className="glass border-b border-alfa-white-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-alfa flex items-center justify-center shadow-glow-alfa">
                <span className="text-xl font-bold">Α</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient-alfa">ALFA Studio</h1>
                <p className="text-xs text-gray-400">Voice Crypto Copilot</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="p-2 glass rounded-xl hover:bg-alfa-white-20 transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-2 glass rounded-xl hover:bg-alfa-white-20 transition-colors">
                <Settings size={20} />
              </button>
              <button className="p-2 glass rounded-xl hover:bg-alfa-white-20 transition-colors text-red-400">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-6 py-8 flex gap-6">
        {/* Sidebar - Stats & Quick Actions */}
        <aside className="w-80 space-y-4">
          {/* Status Card */}
          <div className="card-alfa">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${isAssistantSpeaking ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
              <span className="text-sm text-gray-400">
                {isAssistantSpeaking ? 'ALFA está falando...' : 'Pronto para ouvir'}
              </span>
            </div>
            
            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Conversas hoje</span>
                <span className="font-semibold text-alfa-blue">{messages.filter(m => m.role === 'user').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Minutos usados</span>
                <span className="font-semibold text-alfa-purple">2.5 / 5.0</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-alfa space-y-2">
            <h3 className="font-semibold mb-3">Perguntas Rápidas</h3>
            <button className="w-full p-3 glass rounded-xl hover:bg-alfa-white-20 transition-colors text-left text-sm">
              📊 Preço do Bitcoin agora
            </button>
            <button className="w-full p-3 glass rounded-xl hover:bg-alfa-white-20 transition-colors text-left text-sm">
              🔥 Moedas em alta hoje
            </button>
            <button className="w-full p-3 glass rounded-xl hover:bg-alfa-white-20 transition-colors text-left text-sm">
              ⚡ Resumo do mercado
            </button>
            <button className="w-full p-3 glass rounded-xl hover:bg-alfa-white-20 transition-colors text-left text-sm">
              💡 Recomendações para investir
            </button>
          </div>

          {/* Upgrade Card */}
          <div className="card-alfa bg-gradient-to-br from-alfa-blue/10 to-alfa-purple/10 border-2 border-alfa-blue/20">
            <Sparkles className="text-alfa-blue mb-2" size={24} />
            <h3 className="font-semibold mb-2">Upgrade para Pro</h3>
            <p className="text-sm text-gray-400 mb-4">
              Consultas ilimitadas, alertas personalizados e muito mais.
            </p>
            <button className="w-full btn-alfa text-sm">
              Ver Planos
            </button>
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 glass rounded-3xl p-6 mb-6 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-alfa flex items-center justify-center mb-6 shadow-glow-alfa animate-float">
                  <Mic size={48} />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Olá! Eu sou a <span className="text-gradient-alfa">ALFA</span>
                </h2>
                <p className="text-gray-400 max-w-md">
                  Sua assistente de voz para análise de criptomoedas. 
                  Grave sua pergunta e receba a resposta em áudio!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-[70%] p-4 rounded-2xl
                          ${message.role === 'user' 
                            ? 'bg-gradient-alfa text-white' 
                            : 'glass'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {message.role === 'assistant' && (
                            <div className="w-6 h-6 rounded-lg bg-gradient-alfa flex items-center justify-center text-xs font-bold">
                              Α
                            </div>
                          )}
                          <span className="text-xs text-gray-400">
                            {message.timestamp.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {message.audioUrl && (
                            <button
                              onClick={() => playAudio(message.audioUrl!)}
                              className="p-1 hover:bg-alfa-white-20 rounded-lg transition-colors"
                            >
                              <Volume2 size={14} />
                            </button>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Recorder */}
          <div className="glass rounded-3xl p-8">
            <Recorder
              onTranscriptionComplete={handleTranscriptionComplete}
              onError={handleError}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
