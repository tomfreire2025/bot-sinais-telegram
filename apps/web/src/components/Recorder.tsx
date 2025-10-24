'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecorderProps {
  onAudioData?: (audioBlob: Blob) => void;
  onTranscription?: (text: string) => void;
  isRecording?: boolean;
  onRecordingChange?: (recording: boolean) => void;
  className?: string;
}

interface AudioState {
  isRecording: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  duration: number;
  currentTime: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  transcription: string;
  isTranscribing: boolean;
}

const Recorder: React.FC<RecorderProps> = ({
  onAudioData,
  onTranscription,
  isRecording: externalIsRecording = false,
  onRecordingChange,
  className = '',
}) => {
  const [audioState, setAudioState] = useState<AudioState>({
    isRecording: false,
    isPlaying: false,
    isPaused: false,
    duration: 0,
    currentTime: 0,
    audioBlob: null,
    audioUrl: null,
    transcription: '',
    isTranscribing: false,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animationRef = useRef<number | null>(null);

  // Inicializar áudio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('loadedmetadata', updateDuration);
      audioRef.current.addEventListener('ended', handleAudioEnd);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateTime);
        audioRef.current.removeEventListener('loadedmetadata', updateDuration);
        audioRef.current.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, []);

  const updateTime = () => {
    if (audioRef.current) {
      setAudioState(prev => ({
        ...prev,
        currentTime: audioRef.current?.currentTime || 0,
      }));
    }
  };

  const updateDuration = () => {
    if (audioRef.current) {
      setAudioState(prev => ({
        ...prev,
        duration: audioRef.current?.duration || 0,
      }));
    }
  };

  const handleAudioEnd = () => {
    setAudioState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
    }));
  };

  // Iniciar gravação
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      streamRef.current = stream;
      chunksRef.current = [];

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
        
        setAudioState(prev => ({
          ...prev,
          audioBlob,
          audioUrl,
          isRecording: false,
        }));

        onAudioData?.(audioBlob);
      };

      mediaRecorder.start(100); // Coletar dados a cada 100ms

      setAudioState(prev => ({
        ...prev,
        isRecording: true,
        audioBlob: null,
        audioUrl: null,
        transcription: '',
      }));

      onRecordingChange?.(true);

    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      alert('Erro ao acessar o microfone. Verifique as permissões.');
    }
  }, [onAudioData, onRecordingChange]);

  // Parar gravação
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && audioState.isRecording) {
      mediaRecorderRef.current.stop();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }

    onRecordingChange?.(false);
  }, [audioState.isRecording, onRecordingChange]);

  // Toggle gravação
  const toggleRecording = useCallback(() => {
    if (audioState.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [audioState.isRecording, startRecording, stopRecording]);

  // Reproduzir áudio
  const playAudio = useCallback(() => {
    if (audioRef.current && audioState.audioUrl) {
      if (audioState.isPaused) {
        audioRef.current.play();
        setAudioState(prev => ({
          ...prev,
          isPlaying: true,
          isPaused: false,
        }));
      } else {
        audioRef.current.play();
        setAudioState(prev => ({
          ...prev,
          isPlaying: true,
          isPaused: false,
        }));
      }
    }
  }, [audioState.audioUrl, audioState.isPaused]);

  // Pausar áudio
  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: true,
      }));
    }
  }, []);

  // Parar áudio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentTime: 0,
      }));
    }
  }, []);

  // Transcrever áudio
  const transcribeAudio = useCallback(async () => {
    if (!audioState.audioBlob) return;

    setAudioState(prev => ({ ...prev, isTranscribing: true }));

    try {
      const formData = new FormData();
      formData.append('audio', audioState.audioBlob, 'recording.webm');

      const response = await fetch('/api/audio/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro na transcrição');
      }

      const { transcription } = await response.json();
      
      setAudioState(prev => ({
        ...prev,
        transcription,
        isTranscribing: false,
      }));

      onTranscription?.(transcription);

    } catch (error) {
      console.error('Erro na transcrição:', error);
      setAudioState(prev => ({ ...prev, isTranscribing: false }));
      alert('Erro ao transcrever o áudio. Tente novamente.');
    }
  }, [audioState.audioBlob, onTranscription]);

  // Formatar tempo
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`recorder-container ${className}`}>
      {/* Áudio oculto */}
      {audioState.audioUrl && (
        <audio
          ref={audioRef}
          src={audioState.audioUrl}
          preload="metadata"
        />
      )}

      {/* Interface principal */}
      <div className="card-alfa p-8 max-w-md mx-auto">
        {/* Título */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gradient-alfa mb-2">
            Gravação de Áudio
          </h2>
          <p className="text-alfa-muted">
            Fale sobre criptomoedas e receba análises em tempo real
          </p>
        </div>

        {/* Botão de gravação principal */}
        <div className="flex justify-center mb-8">
          <motion.button
            onClick={toggleRecording}
            className={`
              relative w-24 h-24 rounded-full flex items-center justify-center
              transition-all duration-300 transform hover:scale-110 active:scale-95
              ${audioState.isRecording 
                ? 'bg-red-500 shadow-lg recording-pulse' 
                : 'btn-alfa'
              }
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {audioState.isRecording ? (
                <motion.div
                  key="stop"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Square className="w-8 h-8 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="mic"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Mic className="w-8 h-8" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Status da gravação */}
        <div className="text-center mb-6">
          <AnimatePresence>
            {audioState.isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center space-x-2 text-red-400"
              >
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Gravando...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controles de áudio */}
        {audioState.audioUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Barra de progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-alfa-muted">
                <span>{formatTime(audioState.currentTime)}</span>
                <span>{formatTime(audioState.duration)}</span>
              </div>
              <div className="w-full bg-alfa-darker rounded-full h-2">
                <div 
                  className="bg-gradient-alfa h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${audioState.duration > 0 ? (audioState.currentTime / audioState.duration) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>

            {/* Botões de controle */}
            <div className="flex justify-center space-x-4">
              <motion.button
                onClick={audioState.isPlaying ? pauseAudio : playAudio}
                className="btn-alfa-secondary w-12 h-12 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {audioState.isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </motion.button>

              <motion.button
                onClick={stopAudio}
                className="btn-alfa-secondary w-12 h-12 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Square className="w-5 h-5" />
              </motion.button>

              <motion.button
                onClick={transcribeAudio}
                disabled={audioState.isTranscribing}
                className="btn-alfa w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {audioState.isTranscribing ? (
                  <div className="spinner-alfa w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Transcrição */}
        {audioState.transcription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-alfa-darker rounded-2xl border border-alfa-primary/20"
          >
            <h3 className="text-sm font-semibold text-alfa-primary mb-2">
              Transcrição:
            </h3>
            <p className="text-alfa-light text-sm leading-relaxed">
              {audioState.transcription}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Recorder;