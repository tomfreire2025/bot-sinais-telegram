# Arquitetura do ALFA - Voice Crypto Copilot

## Visão Geral

O ALFA é construído como uma arquitetura de microsserviços moderna, com foco em escalabilidade, observabilidade e experiência do usuário em tempo real.

## Diagrama de Componentes

```
┌──────────────────────────────────────────────────────────────────┐
│                           CLIENTE                                 │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Browser (Next.js 14 + React 18)                            │ │
│  │                                                               │ │
│  │  • WebAudio API (gravação)                                  │ │
│  │  • MediaRecorder API (streaming)                            │ │
│  │  • WebSocket Client (real-time)                             │ │
│  │  • Framer Motion (animações)                                │ │
│  │  • Recharts (visualizações)                                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ HTTPS / WSS
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / CDN                            │
│                    (Vercel Edge Network)                          │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│  FRONTEND (Next.js)      │   │  BACKEND API (Fastify)   │
│                          │   │                          │
│  • SSR + CSR             │   │  • tRPC Router           │
│  • ISR (Incremental)     │   │  • Authentication        │
│  • API Routes            │   │  • Rate Limiting         │
│  • Image Optimization    │   │  • Request Validation    │
└──────────────────────────┘   └───────────┬──────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
         ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
         │  STT SERVICE     │  │  LLM SERVICE     │  │  TTS SERVICE     │
         │  (OpenAI Whisper)│  │  (GPT-4)         │  │  (ElevenLabs)    │
         │                  │  │                  │  │                  │
         │  • Audio → Text  │  │  • Intent Class. │  │  • Text → Audio  │
         │  • PT-BR Support │  │  • Context Mgmt  │  │  • PT-BR Voice   │
         │  • Streaming     │  │  • Tool Calling  │  │  • Streaming     │
         └──────────────────┘  └────────┬─────────┘  └──────────────────┘
                                        │
                                        │ Calls
                                        ▼
                             ┌──────────────────────┐
                             │  CRYPTO TOOLS        │
                             │                      │
                             │  • CoinGecko Client  │
                             │  • Binance Client    │
                             │  • Price Aggregator  │
                             │  • Sentiment Analyzer│
                             │  • Alert Manager     │
                             └──────────┬───────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
         ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
         │  PostgreSQL      │  │  Redis Cache     │  │  Bull Queue      │
         │  (Primary DB)    │  │                  │  │  (Jobs)          │
         │                  │  │  • Session Store │  │                  │
         │  • Users         │  │  • Rate Limits   │  │  • Audio Process │
         │  • Conversations │  │  • Market Cache  │  │  • Alerts        │
         │  • Alerts        │  │  • Pub/Sub       │  │  • Reports       │
         └──────────────────┘  └──────────────────┘  └──────────────────┘
                                        │
                                        ▼
                             ┌──────────────────────┐
                             │  WORKER SERVICE      │
                             │                      │
                             │  • Queue Consumer    │
                             │  • Scheduled Tasks   │
                             │  • Batch Processing  │
                             └──────────────────────┘
```

## Fluxo de Dados - Consulta por Voz

### 1. Gravação de Áudio

```
User clicks Mic
    ↓
Browser requests microphone access
    ↓
WebAudio API captures audio stream
    ↓
MediaRecorder records chunks
    ↓
Real-time visualization (AnalyserNode)
    ↓
User stops recording
    ↓
Blob created with audio data
```

### 2. Transcrição

```
Audio Blob
    ↓
POST /api/audio/transcribe
    ↓
API validates file size/format
    ↓
Forward to OpenAI Whisper API
    ↓
Receive transcription (PT-BR)
    ↓
Store in conversation history
    ↓
Return text to client
```

### 3. Processamento LLM

```
Transcribed text
    ↓
POST /api/chat
    ↓
Classify intent (crypto query, market analysis, etc)
    ↓
Build context from history
    ↓
Call GPT-4 with available tools
    ↓
GPT-4 decides which tool to use
    ↓
Execute tool (getCryptoPrice, getMarketTrends, etc)
    ↓
GPT-4 generates natural response
    ↓
Return text response
```

### 4. Síntese de Voz

```
Text response
    ↓
POST /api/audio/synthesize
    ↓
Forward to ElevenLabs API
    ↓
Receive audio stream (PT-BR)
    ↓
Store temporarily in CDN/S3
    ↓
Return audio URL to client
    ↓
Auto-play in browser
```

## Comunicação Real-Time

### WebSocket Flow

```
Client connects → ws://api/realtime
    ↓
Server authenticates via JWT
    ↓
Client joins room (userId)
    ↓
Server sends:
  • Market price updates (every 5s)
  • Alert notifications
  • Conversation status
    ↓
Client sends:
  • Typing indicators
  • Voice activity detection
```

## Camadas de Segurança

### 1. Autenticação

```
NextAuth.js
├── Email/Password
├── OAuth (Google, GitHub)
└── JWT tokens (httpOnly cookies)
```

### 2. Autorização

```
Middleware checks:
├── Valid session
├── Active subscription
├── Rate limits (by plan)
└── Feature flags
```

### 3. Validação

```
tRPC schemas validate:
├── Input types
├── File sizes
├── MIME types
└── Sanitize strings
```

## Observabilidade

### Tracing (Jaeger)

```
Every request:
├── Span: HTTP request
│   ├── Span: Database query
│   ├── Span: Cache lookup
│   ├── Span: External API call
│   │   └── Span: OpenAI request
│   └── Span: Response serialization
└── Send to Jaeger collector
```

### Metrics (Prometheus)

```
Collect:
├── Request rate (req/s)
├── Error rate (%)
├── Response time (p50, p95, p99)
├── Database connections
├── Cache hit rate
├── Queue length
└── CPU/Memory usage
```

### Logs (Structured JSON)

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "service": "api",
  "traceId": "abc123",
  "userId": "user_456",
  "message": "Audio transcription completed",
  "duration": 1250,
  "metadata": {
    "audioSize": 524288,
    "language": "pt-BR"
  }
}
```

## Escalabilidade

### Horizontal Scaling

- **Frontend**: Vercel Edge (global CDN)
- **API**: Multiple instances behind load balancer
- **Worker**: Auto-scale based on queue depth
- **Database**: Read replicas for queries

### Caching Strategy

```
Layer 1: Browser cache (ServiceWorker)
Layer 2: CDN cache (Vercel/CloudFront)
Layer 3: Redis cache (hot data)
Layer 4: Database (cold data)
```

### Rate Limiting

```
Free Plan:
├── 10 requests/day
├── 5 minutes audio/month
└── No real-time prices

Pro Plan:
├── 1000 requests/day
├── 200 minutes audio/month
├── Real-time prices
└── Custom alerts
```

## Deployment

### Ambientes

```
development → staging → production
    ↓           ↓          ↓
  localhost   Render    Vercel + Fly.io
```

### CI/CD Pipeline

```
Git push
    ↓
GitHub Actions trigger
    ↓
├── Lint & Type check
├── Unit tests
├── Build
├── E2E tests (Playwright)
└── Deploy
    ├── Frontend → Vercel
    ├── API → Fly.io
    └── Worker → Render
```

## Monitoramento

### Health Checks

```
GET /health
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": "up",
    "redis": "up",
    "openai": "up",
    "elevenlabs": "up"
  },
  "version": "1.0.0"
}
```

### Alertas

```
If error_rate > 5% → Notify Slack
If response_time > 3s → Notify Email
If database_connections > 90% → Scale up
```

## Tecnologias por Camada

### Frontend
- Next.js 14, React 18, TypeScript
- Tailwind CSS, Framer Motion
- tRPC Client, React Query
- WebAudio API, MediaRecorder

### Backend
- Node.js 20, TypeScript
- Fastify, tRPC
- Prisma ORM
- Bull (Redis-based queue)
- Socket.io

### Data
- PostgreSQL 16
- Redis 7
- AWS S3 (audio storage)

### External APIs
- OpenAI (Whisper + GPT-4)
- ElevenLabs (TTS)
- CoinGecko (crypto data)
- Binance (real-time prices)

### DevOps
- Docker, Docker Compose
- OpenTelemetry, Jaeger, Prometheus, Grafana
- GitHub Actions
- Vercel, Fly.io, Render
