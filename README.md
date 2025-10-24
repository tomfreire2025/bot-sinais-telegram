# 🎙️ ALFA — Voice Crypto Copilot

<div align="center">

![ALFA Logo](https://via.placeholder.com/200x200/0f1115/00d4ff?text=ALFA)

**Assistente de Voz Inteligente para Análise de Criptomoedas em Tempo Real**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[🚀 Demo](https://alfa-voice-crypto.vercel.app) • [📖 Documentação](./docs/README.md) • [🐛 Issues](https://github.com/seu-usuario/alfa/issues)

</div>

---

## 📋 Índice

- [Sobre o ALFA](#sobre-o-alfa)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação Local](#instalação-local)
- [Uso](#uso)
- [Deploy](#deploy)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## 🎯 Sobre o ALFA

**ALFA** é um SaaS inovador que permite aos usuários enviar áudios em português (PT-BR) e receber respostas atualizadas sobre o mercado de criptomoedas em tempo real através de áudio sintetizado.

### 🌟 Diferenciais

- **🎤 Interface 100% por Voz**: Grave sua pergunta e receba a resposta em áudio
- **⚡ Tempo Real**: Dados atualizados instantaneamente do mercado cripto
- **🤖 IA Avançada**: Processamento de linguagem natural com GPT-4
- **📊 Análises Completas**: Cotações, tendências, alertas e recomendações
- **🇧🇷 100% em Português**: Interface e respostas totalmente em PT-BR
- **✨ Design Futurista**: Tema ALFA com efeitos 3D, neon e glassmorphism

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUÁRIO (Browser)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ WebAudio API │  │ MediaStream  │  │  WebSockets  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPS/WEB (Next.js 14)                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  • Recorder.tsx (Gravação de áudio)                      │   │
│  │  • /studio (Interface de conversação)                    │   │
│  │  • /dashboard (Analytics & Alertas)                      │   │
│  │  • Tailwind + Framer Motion (Animações)                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │ tRPC / REST
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                  APPS/API (Fastify + tRPC)                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ENDPOINTS:                                              │   │
│  │  • POST /api/audio/upload                               │   │
│  │  • POST /api/audio/transcribe                           │   │
│  │  • WS   /api/realtime                                   │   │
│  │  • GET  /api/market/:symbol                             │   │
│  │  • POST /api/alerts                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  STT Service │  │  LLM Orchestr│  │  TTS Service │          │
│  │  (Whisper)   │  │  (GPT-4)     │  │  (ElevenLabs)│          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └─────────────┬────┴──────────────────┘                  │
│                       ▼                                           │
│            ┌───────────────────────┐                             │
│            │   CRYPTO TOOLS        │                             │
│            │  • CoinGecko API     │                             │
│            │  • Binance API       │                             │
│            │  • Price Tracker     │                             │
│            │  • Sentiment Analysis│                             │
│            └───────────────────────┘                             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATA LAYER                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  PostgreSQL  │  │    Redis     │  │  Bull Queue  │          │
│  │  (Prisma)    │  │   (Cache)    │  │   (Jobs)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPS/WORKER                                   │
│  • Processamento assíncrono de áudio                            │
│  • Geração de relatórios                                        │
│  • Envio de alertas                                             │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   OBSERVABILITY                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Jaeger      │  │  Prometheus  │  │   Grafana    │          │
│  │  (Traces)    │  │  (Metrics)   │  │  (Dashboards)│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Funcionalidades

### 🎤 Core Features
- [x] Gravação de áudio via navegador (WebAudio API)
- [x] Transcrição automática (OpenAI Whisper)
- [x] Processamento de linguagem natural (GPT-4)
- [x] Síntese de voz em PT-BR (ElevenLabs)
- [x] Streaming de respostas em tempo real (WebSockets)

### 📊 Ferramentas de Cripto
- [x] Cotação em tempo real de criptomoedas
- [x] Análise de tendências e gráficos
- [x] Alertas de preço customizáveis
- [x] Análise de sentimento do mercado
- [x] Histórico de conversações

### 👤 Gestão de Usuários
- [x] Autenticação segura (NextAuth.js)
- [x] Planos Free e Pro
- [x] Pagamentos via Stripe
- [x] Dashboard de uso e analytics

### 🔧 Infraestrutura
- [x] API RESTful + tRPC
- [x] WebSockets para real-time
- [x] Cache com Redis
- [x] Observabilidade completa (OpenTelemetry)
- [x] Testes E2E com Playwright

---

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** (App Router + Server Components)
- **React 18** + **TypeScript**
- **Tailwind CSS** + **Framer Motion**
- **tRPC** (Type-safe API client)
- **Zustand** (State management)
- **React Query** (Data fetching)

### Backend
- **Node.js 20+** + **TypeScript**
- **Fastify** (HTTP framework)
- **tRPC** (Type-safe APIs)
- **Prisma** (ORM)
- **Bull** (Queue system)
- **Socket.io** (WebSockets)

### Database & Cache
- **PostgreSQL 16**
- **Redis 7**

### AI & Audio
- **OpenAI Whisper** (Speech-to-Text)
- **OpenAI GPT-4** (Language Model)
- **ElevenLabs** (Text-to-Speech)

### Crypto Data
- **CoinGecko API**
- **Binance API**

### DevOps & Observability
- **Docker** + **Docker Compose**
- **OpenTelemetry** (Tracing)
- **Jaeger** (Distributed tracing)
- **Prometheus** (Metrics)
- **Grafana** (Dashboards)

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **npm** 10+ (incluído com Node.js)
- **Docker** e **Docker Compose** ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))

### API Keys Necessárias

Você precisará criar contas e obter API keys para:

1. **OpenAI** - [https://platform.openai.com/](https://platform.openai.com/)
2. **ElevenLabs** - [https://elevenlabs.io/](https://elevenlabs.io/)
3. **CoinGecko** - [https://www.coingecko.com/en/api](https://www.coingecko.com/en/api)
4. **Binance** (opcional) - [https://www.binance.com/en/support/faq/360002502072](https://www.binance.com/en/support/faq/360002502072)
5. **Stripe** (para pagamentos) - [https://stripe.com/](https://stripe.com/)

---

## 🚀 Instalação Local

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/seu-usuario/alfa-voice-crypto-copilot.git
cd alfa-voice-crypto-copilot
```

### 2️⃣ Configure as Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env e adicione suas API keys
nano .env
```

### 3️⃣ Inicie os Serviços de Infraestrutura

```bash
# Inicia PostgreSQL, Redis, Prometheus, Grafana, Jaeger
npm run docker:up

# Verifique se todos os containers estão rodando
docker-compose ps
```

### 4️⃣ Instale as Dependências

```bash
# Instala todas as dependências do monorepo
npm install
```

### 5️⃣ Configure o Banco de Dados

```bash
# Gera o Prisma Client
npm run db:generate

# Aplica as migrations
npm run db:push

# (Opcional) Popula o banco com dados de exemplo
npm run db:seed
```

### 6️⃣ Inicie a Aplicação

```bash
# Inicia todos os serviços em modo desenvolvimento
npm run dev

# OU inicie serviços individuais
npm run dev:web     # Frontend (http://localhost:3000)
npm run dev:api     # Backend API (http://localhost:3001)
npm run dev:worker  # Worker (processamento assíncrono)
```

### 7️⃣ Acesse a Aplicação

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:3001](http://localhost:3001)
- **Grafana**: [http://localhost:3002](http://localhost:3002) (admin/alfa_admin)
- **Jaeger UI**: [http://localhost:16686](http://localhost:16686)
- **Prisma Studio**: `npm run db:studio`

---

## 📱 Uso

### Gravação de Áudio

1. Acesse `/studio` no navegador
2. Clique no botão de microfone para iniciar gravação
3. Faça sua pergunta em português (ex: "Qual o preço do Bitcoin agora?")
4. Aguarde a transcrição e resposta em áudio

### Dashboard

1. Acesse `/dashboard` para ver:
   - Histórico de conversas
   - Gráficos de preços
   - Alertas configurados
   - Uso de créditos

### Configurar Alertas

```typescript
// Exemplo via API
POST /api/alerts
{
  "symbol": "BTC",
  "condition": "above",
  "price": 50000,
  "notifyVia": "email"
}
```

---

## 🚢 Deploy

### Vercel (Frontend)

```bash
# Instale a CLI do Vercel
npm i -g vercel

# Deploy
cd apps/web
vercel
```

### Fly.io (Backend API)

```bash
# Instale a CLI do Fly.io
curl -L https://fly.io/install.sh | sh

# Deploy
cd apps/api
fly launch
fly deploy
```

### Render (Worker)

1. Conecte seu repositório no [Render Dashboard](https://render.com/)
2. Selecione `apps/worker` como root directory
3. Configure as variáveis de ambiente
4. Deploy!

---

## 📁 Estrutura do Projeto

```
alfa-voice-crypto-copilot/
├── apps/
│   ├── web/                    # Frontend Next.js
│   │   ├── src/
│   │   │   ├── app/           # App Router
│   │   │   │   ├── studio/   # Página de gravação
│   │   │   │   ├── dashboard/ # Dashboard Pro
│   │   │   │   └── api/       # API Routes
│   │   │   ├── components/    # Componentes React
│   │   │   │   ├── Recorder.tsx
│   │   │   │   ├── AudioPlayer.tsx
│   │   │   │   └── ...
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── lib/           # Utils e configs
│   │   │   └── styles/        # CSS global
│   │   ├── public/            # Assets estáticos
│   │   └── package.json
│   │
│   ├── api/                    # Backend API
│   │   ├── src/
│   │   │   ├── server.ts      # Fastify server
│   │   │   ├── routers/       # tRPC routers
│   │   │   ├── services/      # Business logic
│   │   │   │   ├── stt.service.ts
│   │   │   │   ├── tts.service.ts
│   │   │   │   ├── llm.service.ts
│   │   │   │   └── crypto.service.ts
│   │   │   ├── middleware/    # Auth, CORS, etc
│   │   │   └── prisma/        # Prisma schema
│   │   │       ├── schema.prisma
│   │   │       └── seed.ts
│   │   └── package.json
│   │
│   └── worker/                 # Background jobs
│       ├── src/
│       │   ├── index.ts
│       │   └── jobs/          # Job handlers
│       └── package.json
│
├── packages/
│   ├── shared/                 # Código compartilhado
│   │   ├── src/
│   │   │   ├── types/         # TypeScript types
│   │   │   ├── constants/     # Constantes
│   │   │   └── utils/         # Utilidades
│   │   └── package.json
│   │
│   ├── crypto-tools/           # Ferramentas de cripto
│   │   ├── src/
│   │   │   ├── coingecko.ts
│   │   │   ├── binance.ts
│   │   │   └── analyzer.ts
│   │   └── package.json
│   │
│   └── ui/                     # Componentes UI compartilhados
│       └── package.json
│
├── infra/
│   ├── docker/                 # Dockerfiles
│   ├── k8s/                    # Kubernetes manifests
│   ├── otel-collector-config.yaml
│   ├── prometheus.yml
│   └── grafana-datasources.yml
│
├── docs/
│   ├── api.md                  # Documentação da API
│   ├── architecture.md         # Arquitetura detalhada
│   └── deployment.md           # Guia de deploy
│
├── .env.example                # Variáveis de ambiente
├── docker-compose.yml          # Orquestração local
├── package.json                # Root package.json
├── turbo.json                  # Turbo config
└── README.md                   # Este arquivo
```

---

## 🧪 Testes

### Testes Unitários

```bash
# Roda todos os testes
npm run test

# Testes com coverage
npm run test:coverage
```

### Testes E2E

```bash
# Inicia os serviços e roda os testes E2E
npm run test:e2e
```

---

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, siga estas etapas:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Suporte

- 📧 Email: suporte@alfa-crypto.com
- 💬 Discord: [ALFA Community](https://discord.gg/alfa)
- 🐦 Twitter: [@AlfaCrypto](https://twitter.com/alfacrypto)

---

<div align="center">

**Feito com ❤️ pela equipe ALFA**

⭐ Dê uma estrela se este projeto foi útil!

</div>
