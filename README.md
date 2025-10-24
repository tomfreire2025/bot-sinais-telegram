# 🚀 ALFA - Voice Crypto Copilot

> **SaaS de análise de criptomoedas por voz em português brasileiro**

ALFA é uma plataforma SaaS que permite aos usuários enviar áudios em português brasileiro e receber respostas atualizadas sobre o mercado de criptomoedas em tempo real, incluindo cotações, análises e alertas personalizados.

## 🎯 Funcionalidades Principais

- 🎤 **Gravação de áudio** com interface intuitiva
- 🧠 **Transcrição automática** via STT (Speech-to-Text)
- 🤖 **IA conversacional** especializada em criptomoedas
- 📊 **Dados em tempo real** do mercado crypto
- 🔊 **Respostas em áudio** via TTS (Text-to-Speech)
- 📈 **Dashboard Pro** com gráficos e alertas
- 💳 **Planos Free/Pro** com pagamentos via Stripe
- 🔐 **Autenticação segura** e controle de acesso

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Worker        │
│   (Next.js)     │◄──►│   (Fastify)     │◄──►│   (Queue)       │
│                 │    │                 │    │                 │
│ • Recorder      │    │ • tRPC API      │    │ • STT/TTS       │
│ • Dashboard     │    │ • WebSockets    │    │ • Crypto Data   │
│ • Auth          │    │ • Auth          │    │ • Notifications │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Database      │
                    │   (PostgreSQL)  │
                    │                 │
                    │ • Users         │
                    │ • Conversations │
                    │ • Alerts        │
                    │ • Usage         │
                    └─────────────────┘
```

## 🚀 Tecnologias

### Frontend
- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **Web Audio API** para gravação
- **WebSockets** para tempo real

### Backend
- **Node.js** com TypeScript
- **Fastify** para performance
- **tRPC** para APIs type-safe
- **Prisma** como ORM
- **PostgreSQL** como banco principal
- **Redis** para cache e sessões

### Infraestrutura
- **Docker** para containerização
- **Docker Compose** para desenvolvimento
- **Vercel** para deploy do frontend
- **Fly.io/Render** para backend
- **OpenTelemetry** para observabilidade

## 📁 Estrutura do Projeto

```
alfa/
├── apps/
│   ├── web/                 # Frontend Next.js
│   ├── api/                 # Backend Fastify
│   └── worker/              # Background jobs
├── packages/
│   ├── shared/              # Código compartilhado
│   ├── ui/                  # Componentes UI
│   └── database/            # Prisma schema
├── infra/                   # Infraestrutura
├── docs/                    # Documentação
└── docker-compose.yml       # Desenvolvimento local
```

## 🛠️ Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- PostgreSQL 15+
- Redis 7+

### 1. Clone o repositório
```bash
git clone <repository-url>
cd alfa
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 4. Inicie os serviços
```bash
docker-compose up -d
```

### 5. Execute as migrações
```bash
npm run db:migrate
```

### 6. Inicie o desenvolvimento
```bash
npm run dev
```

## 🌐 URLs de Desenvolvimento

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **Worker**: http://localhost:3002
- **Database**: localhost:5432
- **Redis**: localhost:6379

## 📊 Planos e Preços

### 🆓 Plano Free
- 10 consultas por mês
- Respostas básicas de cotações
- Suporte por email

### 💎 Plano Pro (R$ 29,90/mês)
- Consultas ilimitadas
- Análises avançadas
- Alertas personalizados
- Dashboard completo
- Suporte prioritário

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia todos os serviços
npm run dev:web          # Apenas frontend
npm run dev:api          # Apenas backend
npm run dev:worker       # Apenas worker

# Build
npm run build            # Build completo
npm run build:web        # Build frontend
npm run build:api        # Build backend

# Testes
npm run test             # Todos os testes
npm run test:unit        # Testes unitários
npm run test:e2e         # Testes e2e

# Database
npm run db:migrate       # Executa migrações
npm run db:seed          # Popula banco com dados
npm run db:reset         # Reseta banco

# Deploy
npm run deploy:web       # Deploy frontend
npm run deploy:api       # Deploy backend
```

## 🧪 Testes

### Testes Unitários
```bash
npm run test:unit
```

### Testes E2E
```bash
npm run test:e2e
```

### Coverage
```bash
npm run test:coverage
```

## 🚀 Deploy

### Frontend (Vercel)
```bash
npm run deploy:web
```

### Backend (Fly.io)
```bash
npm run deploy:api
```

### Worker (Render)
```bash
npm run deploy:worker
```

## 📈 Monitoramento

- **Logs**: Estruturados com Winston
- **Métricas**: Prometheus + Grafana
- **Tracing**: OpenTelemetry
- **Alertas**: PagerDuty

## 🔒 Segurança

- Autenticação JWT
- Rate limiting
- Validação de entrada
- Criptografia de dados sensíveis
- HTTPS obrigatório

## 📝 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Suporte

- **Email**: suporte@alfa-crypto.com
- **Discord**: [Comunidade ALFA](https://discord.gg/alfa-crypto)
- **Documentação**: [docs.alfa-crypto.com](https://docs.alfa-crypto.com)

---

**Desenvolvido com ❤️ para a comunidade crypto brasileira**