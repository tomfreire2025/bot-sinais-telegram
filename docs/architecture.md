# 🏗️ Arquitetura do ALFA - Voice Crypto Copilot

## Visão Geral

O ALFA é um SaaS moderno construído com arquitetura de microsserviços, oferecendo análise de criptomoedas por voz em português brasileiro.

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                ALFA ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │   BACKEND       │    │   WORKER        │    │   EXTERNAL      │
│   (Next.js)     │    │   (Fastify)     │    │   (Queue)       │    │   SERVICES      │
│                 │    │                 │    │                 │    │                 │
│ • React 18      │◄──►│ • Fastify       │◄──►│ • Bull Queue    │    │ • OpenAI API    │
│ • TypeScript    │    │ • tRPC          │    │ • STT/TTS       │    │ • ElevenLabs    │
│ • Tailwind CSS  │    │ • WebSockets    │    │ • Crypto Data   │    │ • CoinMarketCap │
│ • Framer Motion │    │ • JWT Auth      │    │ • Notifications │    │ • Stripe        │
│ • Web Audio API │    │ • Rate Limiting │    │ • Email         │    │ • Sentry        │
│ • PWA Support   │    │ • Validation    │    │ • Analytics     │    │ • Prometheus    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │                       │
         │                       │                       │                       │
         └───────────────────────┼───────────────────────┼───────────────────────┘
                                 │                       │
                    ┌─────────────────┐    ┌─────────────────┐
                    │   DATABASE      │    │   CACHE         │
                    │   (PostgreSQL)  │    │   (Redis)       │
                    │                 │    │                 │
                    │ • Users         │    │ • Sessions      │
                    │ • Conversations │    │ • Rate Limits   │
                    │ • Messages      │    │ • Queue Jobs    │
                    │ • Tool Calls    │    │ • Cache Data    │
                    │ • Alerts        │    │ • Temp Storage  │
                    │ • Subscriptions │    │                 │
                    │ • Usage Stats   │    │                 │
                    └─────────────────┘    └─────────────────┘
                                 │                       │
                    ┌─────────────────┐    ┌─────────────────┐
                    │   STORAGE       │    │   MONITORING    │
                    │   (AWS S3)      │    │   (Observability)│
                    │                 │    │                 │
                    │ • Audio Files   │    │ • OpenTelemetry │
                    │ • TTS Audio     │    │ • Prometheus    │
                    │ • User Data     │    │ • Grafana       │
                    │ • Backups       │    │ • Sentry        │
                    │ • Static Assets │    │ • Logs          │
                    └─────────────────┘    └─────────────────┘
```

## Fluxo de Dados

### 1. Gravação de Áudio
```
User → Web Audio API → MediaRecorder → Blob → FormData → API
```

### 2. Processamento de Áudio
```
API → Queue → Worker → STT Service → OpenAI → Transcription
```

### 3. Análise de Cripto
```
Transcription → LLM → Intent Classification → Crypto Tools → Market Data
```

### 4. Geração de Resposta
```
Market Data → LLM → Response Text → TTS Service → Audio Response
```

### 5. Streaming de Resposta
```
Audio Response → WebSocket → Frontend → Audio Player
```

## Componentes Principais

### Frontend (Next.js)
- **Páginas**: Home, Studio, Dashboard, Auth, Pricing
- **Componentes**: Recorder, AudioPlayer, ConversationList, Charts
- **Hooks**: useAudio, useWebSocket, useAuth, useConversations
- **Estado**: Zustand para gerenciamento global
- **Estilo**: Tailwind CSS com tema ALFA personalizado

### Backend (Fastify + tRPC)
- **Rotas**: `/api/audio/*`, `/api/market/*`, `/api/auth/*`
- **WebSockets**: `/api/realtime` para streaming
- **Middleware**: Auth, Rate Limiting, Validation, CORS
- **Serviços**: AudioService, CryptoService, LLMService, TTSService

### Worker (Background Jobs)
- **Queues**: audio-processing, crypto-analysis, notifications
- **Jobs**: STT, TTS, Market Data Fetching, Email Sending
- **Cron**: Daily reports, cleanup tasks, health checks

### Database (PostgreSQL + Prisma)
- **Modelos**: User, Conversation, Message, ToolCall, Alert, Subscription
- **Relacionamentos**: One-to-Many, Many-to-Many
- **Índices**: Otimizados para consultas frequentes
- **Migrations**: Versionamento automático

### Cache (Redis)
- **Sessões**: JWT tokens, user sessions
- **Rate Limiting**: Controle de requisições
- **Queue Jobs**: Bull queue para background tasks
- **Cache**: Dados de mercado, respostas frequentes

## Segurança

### Autenticação
- JWT tokens com refresh mechanism
- Rate limiting por usuário e IP
- Validação de entrada rigorosa
- CORS configurado adequadamente

### Dados
- Criptografia de dados sensíveis
- HTTPS obrigatório
- Sanitização de inputs
- Logs de auditoria

### Infraestrutura
- Containerização com Docker
- Secrets management
- Network isolation
- Backup automático

## Monitoramento

### Métricas
- **Performance**: Response time, throughput
- **Business**: Active users, conversations, revenue
- **Technical**: Error rate, CPU, memory, disk
- **Custom**: Audio processing time, LLM latency

### Logs
- **Estruturados**: JSON format com contexto
- **Níveis**: Debug, Info, Warn, Error
- **Correlação**: Request IDs para tracing
- **Retenção**: 30 dias para logs, 1 ano para métricas

### Alertas
- **Críticos**: Service down, high error rate
- **Warning**: High latency, low disk space
- **Info**: New user signup, payment success

## Escalabilidade

### Horizontal
- Load balancers para frontend e backend
- Auto-scaling baseado em CPU/memory
- Database read replicas
- CDN para assets estáticos

### Vertical
- Otimização de queries
- Caching estratégico
- Compressão de dados
- Lazy loading

## Deploy

### Ambientes
- **Development**: Docker Compose local
- **Staging**: Vercel + Fly.io + Render
- **Production**: Vercel + Fly.io + AWS

### CI/CD
- **GitHub Actions**: Build, test, deploy
- **Quality Gates**: Lint, type-check, tests
- **Blue-Green**: Deploy sem downtime
- **Rollback**: Reversão automática em caso de erro

## Tecnologias

### Frontend
- Next.js 14 (App Router)
- React 18 (Concurrent Features)
- TypeScript 5.3
- Tailwind CSS 3.4
- Framer Motion 10.16
- Zustand 4.4
- React Query 5.17

### Backend
- Node.js 18+
- Fastify 4.24
- tRPC 10.45
- Prisma 5.7
- PostgreSQL 15
- Redis 7
- Bull Queue 4.12

### Infraestrutura
- Docker & Docker Compose
- Vercel (Frontend)
- Fly.io (Backend)
- Render (Worker)
- AWS S3 (Storage)
- Sentry (Monitoring)

### APIs Externas
- OpenAI (GPT-4, Whisper)
- ElevenLabs (TTS)
- CoinMarketCap (Crypto Data)
- Stripe (Payments)
- SendGrid (Email)

## Próximos Passos

1. **Implementação**: Desenvolver todos os componentes
2. **Testes**: Unitários, integração e E2E
3. **Deploy**: Configurar ambientes de produção
4. **Monitoramento**: Implementar observabilidade completa
5. **Otimização**: Performance e custos
6. **Features**: Novas funcionalidades baseadas em feedback