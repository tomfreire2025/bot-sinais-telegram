# 🎤 ALFA - Voice Crypto Copilot

![ALFA Logo](https://img.shields.io/badge/ALFA-Voice%20Crypto%20Copilot-blue?style=for-the-badge&logo=bitcoin&logoColor=white)

## 🚀 Visão Geral

ALFA é um SaaS inovador que permite aos usuários enviar comandos de voz em português brasileiro e receber análises atualizadas sobre o mercado de criptomoedas em tempo real através de respostas em áudio.

### ✨ Funcionalidades Principais

- 🎙️ **Gravação de Áudio**: Interface intuitiva para captura de comandos de voz
- 🗣️ **STT/TTS**: Transcrição de fala para texto e síntese de voz em PT-BR
- 📊 **Análise de Cripto**: Cotações, análises técnicas e alertas em tempo real
- 🤖 **LLM Integration**: Processamento inteligente de comandos via IA
- 📱 **Interface Moderna**: Design glassmorphism com tema neon azul/roxo
- 🔄 **Tempo Real**: WebSockets para atualizações instantâneas
- 💳 **Planos Premium**: Sistema de assinatura com Stripe

## 🏗️ Arquitetura

```
ALFA/
├── apps/
│   ├── web/          # Frontend Next.js + React + TypeScript
│   ├── api/          # Backend Node.js + Fastify + tRPC
│   └── worker/       # Background jobs e processamento
├── packages/
│   ├── shared/       # Tipos e utilitários compartilhados
│   ├── ui/           # Componentes de UI reutilizáveis
│   └── config/       # Configurações compartilhadas
├── infra/
│   ├── docker/       # Dockerfiles e compose
│   └── k8s/          # Manifests Kubernetes
└── docs/             # Documentação
```

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Framer Motion** - Animações suaves
- **WebAudio API** - Gravação de áudio

### Backend
- **Node.js** - Runtime JavaScript
- **Fastify** - Framework web performático
- **tRPC** - Type-safe API
- **Prisma** - ORM para PostgreSQL
- **Redis** - Cache e sessões

### Infraestrutura
- **PostgreSQL** - Banco de dados principal
- **Redis** - Cache e filas
- **Docker** - Containerização
- **WebSockets** - Comunicação em tempo real

### Integrações
- **OpenAI/Whisper** - Speech-to-Text
- **ElevenLabs/Azure** - Text-to-Speech
- **CoinGecko/Binance** - Dados de criptomoedas
- **Stripe** - Pagamentos
- **OpenTelemetry** - Observabilidade

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- PostgreSQL 15+
- Redis 7+

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/alfa-voice-crypto.git
cd alfa-voice-crypto
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

4. **Inicie os serviços com Docker**
```bash
docker-compose up -d
```

5. **Execute as migrações do banco**
```bash
npm run db:migrate
npm run db:seed
```

6. **Inicie o ambiente de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em:
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Docs: http://localhost:3002

## 📱 Uso da Aplicação

### 1. Página Studio (/studio)
- Interface principal para gravação de áudio
- Visualizador de ondas sonoras em tempo real
- Botões de controle com design glassmorphism

### 2. Dashboard (/dashboard)
- Histórico de conversas
- Métricas de uso
- Configurações de alertas

### 3. Planos (/pricing)
- Plano Free: 10 consultas/mês
- Plano Pro: Consultas ilimitadas + alertas personalizados

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia todos os serviços em dev
npm run dev:web          # Apenas frontend
npm run dev:api          # Apenas backend

# Build
npm run build            # Build de produção
npm run build:web        # Build do frontend
npm run build:api        # Build do backend

# Banco de dados
npm run db:migrate       # Executa migrações
npm run db:seed          # Popula dados iniciais
npm run db:studio        # Abre Prisma Studio

# Testes
npm run test             # Testes unitários
npm run test:e2e         # Testes end-to-end
npm run test:watch       # Testes em modo watch

# Linting e formatação
npm run lint             # ESLint
npm run format           # Prettier
npm run type-check       # TypeScript check
```

## 🚀 Deploy

### Vercel (Frontend)
```bash
npm run deploy:web
```

### Fly.io (Backend)
```bash
npm run deploy:api
```

### Railway (Full Stack)
```bash
npm run deploy:railway
```

## 🔒 Variáveis de Ambiente

Consulte o arquivo `.env.example` para todas as variáveis necessárias:

- **Database**: `DATABASE_URL`, `REDIS_URL`
- **APIs**: `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, `COINGECKO_API_KEY`
- **Auth**: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- **Payments**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

## 📊 Monitoramento

- **Logs**: Estruturados em JSON via Winston
- **Métricas**: Prometheus + Grafana
- **Tracing**: OpenTelemetry + Jaeger
- **Uptime**: Health checks em `/api/health`

## 🧪 Testes

### Unitários
- Jest para lógica de negócio
- React Testing Library para componentes
- Cobertura mínima: 80%

### End-to-End
- Playwright para fluxos completos
- Testes de gravação de áudio
- Testes de integração com APIs externas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- 📧 Email: suporte@alfa-crypto.com
- 💬 Discord: [Comunidade ALFA](https://discord.gg/alfa)
- 📖 Docs: [docs.alfa-crypto.com](https://docs.alfa-crypto.com)

---

**Desenvolvido com ❤️ pela equipe ALFA**