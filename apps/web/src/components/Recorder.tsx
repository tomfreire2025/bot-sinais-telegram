'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Volume2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface RecorderProps {
  onTranscriptionComplete?: (text: string, audioBlob: Blob) => void
  onError?: (error: Error) => void
}

type RecordingState = 'idle' | 'recording' | 'processing' | 'playing'

export function Recorder({ onTranscriptionComplete, onError }: RecorderProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [audioLevel, setAudioLevel] = useState(0)
  const [duration, setDuration] = useState(0)
  const [transcription, setTranscription] = useState('')
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const animationFrameRef = useRef<number>()
  const durationIntervalRef = useRef<NodeJS.Timeout>()

  // Inicializa o AudioContext para visualização de áudio
  const initAudioContext = async (stream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      source.connect(analyserRef.current)
      
      visualizeAudio()
    } catch (err) {
      console.error('Erro ao inicializar AudioContext:', err)
    }
  }

  // Visualização do nível de áudio em tempo real
  const visualizeAudio = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    
    const updateLevel = () => {
      if (recordingState !== 'recording') return
      
      analyserRef.current!.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      setAudioLevel(average / 255) // Normaliza entre 0 e 1
      
      animationFrameRef.current = requestAnimationFrame(updateLevel)
    }
    
    updateLevel()
  }

  // Inicia a gravação
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      })
      
      // Inicializa visualização
      await initAudioContext(stream)
      
      // Configura MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType })
        await processAudio(audioBlob)
        
        // Limpa o stream
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current.start()
      setRecordingState('recording')
      setDuration(0)
      
      // Contador de duração
      durationIntervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
      
    } catch (err) {
      const error = err as Error
      console.error('Erro ao iniciar gravação:', error)
      onError?.(error)
    }
  }

  // Para a gravação
  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop()
      setRecordingState('processing')
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
      
      setAudioLevel(0)
    }
  }

  // Processa o áudio gravado (envia para API)
  const processAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      
      // Envia para API de transcrição
      const response = await fetch('/api/audio/transcribe', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Erro na transcrição')
      }
      
      const data = await response.json()
      setTranscription(data.text)
      onTranscriptionComplete?.(data.text, audioBlob)
      setRecordingState('idle')
      
    } catch (err) {
      const error = err as Error
      console.error('Erro ao processar áudio:', error)
      onError?.(error)
      setRecordingState('idle')
    }
  }

  // Formata duração em MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Limpeza ao desmontar
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return (
    <div className="relative">
      {/* Visualizador de áudio */}
      <AnimatePresence>
        {recordingState === 'recording' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-32 left-1/2 -translate-x-1/2 flex items-center gap-2"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-2 bg-gradient-alfa rounded-full"
                animate={{
                  height: [4, 40 * audioLevel * (Math.random() + 0.5), 4],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão principal de gravação */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={recordingState === 'recording' ? stopRecording : startRecording}
          disabled={recordingState === 'processing'}
          className={`
            relative w-24 h-24 rounded-full transition-all duration-300
            ${recordingState === 'recording' 
              ? 'bg-red-500 shadow-glow-purple animate-pulse' 
              : 'bg-gradient-alfa shadow-glow-alfa hover:scale-110'
            }
            ${recordingState === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {recordingState === 'processing' ? (
            <Loader2 className="absolute inset-0 m-auto animate-spin" size={40} />
          ) : recordingState === 'recording' ? (
            <Square className="absolute inset-0 m-auto" size={40} fill="white" />
          ) : (
            <Mic className="absolute inset-0 m-auto" size={40} />
          )}
          
          {/* Círculo de pulso durante gravação */}
          {recordingState === 'recording' && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
              />
            </>
          )}
        </button>

        {/* Status e duração */}
        <div className="text-center">
          {recordingState === 'recording' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-red-400"
            >
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono font-semibold">{formatDuration(duration)}</span>
            </motion.div>
          )}
          
          {recordingState === 'processing' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-alfa-blue"
            >
              Processando áudio...
            </motion.p>
          )}
          
          {recordingState === 'idle' && (
            <p className="text-gray-400">
              {transcription ? 'Grave novamente' : 'Clique para gravar'}
            </p>
          )}
        </div>
      </div>

      {/* Transcrição */}
      <AnimatePresence>
        {transcription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 glass rounded-2xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <Volume2 size={16} className="text-alfa-blue" />
              <span className="text-sm text-gray-400">Você disse:</span>
            </div>
            <p className="text-white">{transcription}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
