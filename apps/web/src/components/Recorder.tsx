'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  Send,
  Volume2,
  Download,
  Loader2
} from 'lucide-react';

interface AudioVisualizerProps {
  isRecording: boolean;
  audioData?: number[];
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isRecording, audioData = [] }) => {
  const bars = Array.from({ length: 32 }, (_, i) => i);
  
  return (
    <div className="flex items-center justify-center gap-1 h-16 px-4">
      {bars.map((bar) => {
        const height = isRecording 
          ? Math.random() * 40 + 10 
          : audioData[bar] || 5;
        
        return (
          <motion.div
            key={bar}
            className="bg-gradient-to-t from-neon-blue to-neon-purple rounded-full"
            style={{ width: '3px' }}
            animate={{
              height: `${height}px`,
              opacity: isRecording ? 1 : 0.6,
            }}
            transition={{
              duration: 0.1,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
};

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  isPlaying: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
}

interface RecorderProps {
  onAudioReady?: (audioBlob: Blob) => void;
  onTranscriptionStart?: () => void;
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: string) => void;
  maxDuration?: number; // em segundos
  className?: string;
}

export const Recorder: React.FC<RecorderProps> = ({
  onAudioReady,
  onTranscriptionStart,
  onTranscriptionComplete,
  onError,
  maxDuration = 300, // 5 minutos
  className = '',
}) => {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    isPlaying: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null,
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  // Solicitar permissão de microfone
  const requestMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        } 
      });
      
      setPermissionGranted(true);
      streamRef.current = stream;
      
      // Configurar contexto de áudio para visualização
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      
      return stream;
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      setPermissionGranted(false);
      onError?.('Não foi possível acessar o microfone. Verifique as permissões.');
      throw error;
    }
  }, [onError]);

  // Iniciar gravação
  const startRecording = useCallback(async () => {
    try {
      let stream = streamRef.current;
      
      if (!stream) {
        stream = await requestMicrophonePermission();
      }
      
      if (!stream) return;

      // Resetar chunks
      chunksRef.current = [];
      
      // Configurar MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setState(prev => ({
          ...prev,
          audioBlob,
          audioUrl,
          isRecording: false,
        }));
        
        onAudioReady?.(audioBlob);
      };
      
      // Iniciar gravação
      mediaRecorder.start(100); // Capturar dados a cada 100ms
      
      setState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        duration: 0,
      }));
      
      // Timer para duração
      intervalRef.current = setInterval(() => {
        setState(prev => {
          const newDuration = prev.duration + 1;
          
          // Parar automaticamente se atingir duração máxima
          if (newDuration >= maxDuration) {
            stopRecording();
            return prev;
          }
          
          return { ...prev, duration: newDuration };
        });
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      onError?.('Erro ao iniciar gravação. Tente novamente.');
    }
  }, [requestMicrophonePermission, onAudioReady, onError, maxDuration]);

  // Parar gravação
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setState(prev => ({ ...prev, isRecording: false }));
  }, [state.isRecording]);

  // Pausar/retomar gravação
  const togglePause = useCallback(() => {
    if (!mediaRecorderRef.current) return;
    
    if (state.isPaused) {
      mediaRecorderRef.current.resume();
      intervalRef.current = setInterval(() => {
        setState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, [state.isPaused]);

  // Reproduzir áudio gravado
  const togglePlayback = useCallback(() => {
    if (!state.audioUrl) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(state.audioUrl);
      audioRef.current.onended = () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      };
    }
    
    if (state.isPlaying) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    } else {
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  }, [state.audioUrl, state.isPlaying]);

  // Limpar gravação
  const clearRecording = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl);
    }
    
    setState({
      isRecording: false,
      isPaused: false,
      isPlaying: false,
      duration: 0,
      audioBlob: null,
      audioUrl: null,
    });
  }, [state.audioUrl]);

  // Fazer download do áudio
  const downloadAudio = useCallback(() => {
    if (!state.audioBlob) return;
    
    const url = URL.createObjectURL(state.audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gravacao-${new Date().toISOString().slice(0, 19)}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state.audioBlob]);

  // Enviar para transcrição
  const sendForTranscription = useCallback(async () => {
    if (!state.audioBlob) return;
    
    setIsProcessing(true);
    onTranscriptionStart?.();
    
    try {
      const formData = new FormData();
      formData.append('audio', state.audioBlob, 'recording.webm');
      
      const response = await fetch('/api/audio/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Erro na transcrição');
      }
      
      const result = await response.json();
      onTranscriptionComplete?.(result.text);
      
    } catch (error) {
      console.error('Erro na transcrição:', error);
      onError?.('Erro ao processar áudio. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  }, [state.audioBlob, onTranscriptionStart, onTranscriptionComplete, onError]);

  // Formatar tempo
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (state.audioUrl) {
        URL.revokeObjectURL(state.audioUrl);
      }
    };
  }, [state.audioUrl]);

  // Verificar permissão inicial
  useEffect(() => {
    navigator.permissions?.query({ name: 'microphone' as PermissionName })
      .then(result => {
        setPermissionGranted(result.state === 'granted');
      })
      .catch(() => {
        setPermissionGranted(null);
      });
  }, []);

  return (
    <div className={`glass-card p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display font-semibold text-neon">
          Gravador de Voz
        </h3>
        <div className="text-sm text-gray-400">
          {formatTime(state.duration)} / {formatTime(maxDuration)}
        </div>
      </div>

      {/* Visualizador de Áudio */}
      <div className="mb-6 glass rounded-2xl overflow-hidden">
        <AudioVisualizer isRecording={state.isRecording} />
      </div>

      {/* Controles Principais */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {!state.isRecording && !state.audioBlob && (
          <motion.button
            onClick={startRecording}
            disabled={permissionGranted === false}
            className="glass-button flex items-center gap-2 px-8 py-4 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-6 h-6" />
            Iniciar Gravação
          </motion.button>
        )}

        {state.isRecording && (
          <>
            <motion.button
              onClick={togglePause}
              className="glass-button p-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {state.isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
            </motion.button>

            <motion.button
              onClick={stopRecording}
              className="glass-button p-4 bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Square className="w-6 h-6" />
            </motion.button>
          </>
        )}
      </div>

      {/* Estado de Gravação */}
      <AnimatePresence>
        {state.isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 text-red-400">
              <div className="recording-indicator" />
              <span className="font-medium">
                {state.isPaused ? 'Gravação Pausada' : 'Gravando...'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controles de Áudio Gravado */}
      <AnimatePresence>
        {state.audioBlob && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Controles de Reprodução */}
            <div className="flex items-center justify-center gap-3">
              <motion.button
                onClick={togglePlayback}
                className="glass-button p-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {state.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </motion.button>

              <motion.button
                onClick={downloadAudio}
                className="glass-button p-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Baixar áudio"
              >
                <Download className="w-5 h-5" />
              </motion.button>

              <motion.button
                onClick={clearRecording}
                className="glass-button p-3 bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Excluir gravação"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Botão de Envio */}
            <div className="flex justify-center">
              <motion.button
                onClick={sendForTranscription}
                disabled={isProcessing}
                className="glass-button flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border-neon-blue/30 hover:from-neon-blue/30 hover:to-neon-purple/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar para Análise
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensagem de Permissão */}
      {permissionGranted === false && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
        >
          <MicOff className="w-8 h-8 mx-auto mb-2 text-red-400" />
          <p className="text-red-400 font-medium">Permissão de microfone negada</p>
          <p className="text-sm text-gray-400 mt-1">
            Permita o acesso ao microfone para usar o gravador
          </p>
        </motion.div>
      )}
    </div>
  );
};