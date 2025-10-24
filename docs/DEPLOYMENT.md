# Guia de Deployment - ALFA Voice Crypto Copilot

## Pré-requisitos

Antes de fazer o deploy, certifique-se de ter:

- ✅ Contas criadas em:
  - Vercel (frontend)
  - Fly.io ou Render (backend)
  - Supabase ou outro PostgreSQL gerenciado
  - Redis Cloud ou Upstash
- ✅ API Keys configuradas
- ✅ Código testado localmente

## 1. Deploy do Banco de Dados

### Opção A: Supabase (Recomendado)

```bash
# 1. Criar projeto em https://supabase.com
# 2. Obter connection string
# 3. Executar migrations

npx prisma migrate deploy
```

### Opção B: Railway

```bash
# 1. Instalar CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Criar projeto
railway init

# 4. Adicionar PostgreSQL
railway add postgresql

# 5. Deploy
railway up
```

## 2. Deploy do Redis

### Upstash Redis

```bash
# 1. Criar banco em https://upstash.com
# 2. Copiar REDIS_URL
# 3. Adicionar em variáveis de ambiente
```

## 3. Deploy do Backend (API)

### Fly.io

```bash
# 1. Instalar CLI
curl -L https://fly.io/install.sh | sh

# 2. Login
fly auth login

# 3. Navegar para API
cd apps/api

# 4. Criar fly.toml
cat > fly.toml << 'EOF'
app = "alfa-api"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[[services]]
  http_checks = []
  internal_port = 8080
  processes = ["app"]
  protocol = "tcp"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

[services.concurrency]
  hard_limit = 25
  soft_limit = 20
  type = "connections"

[[services.tcp_checks]]
  grace_period = "10s"
  interval = "15s"
  restart_limit = 0
  timeout = "2s"
EOF

# 5. Criar Dockerfile
cat > Dockerfile << 'EOF'
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm install

COPY apps/api ./apps/api
COPY packages ./packages

RUN npm run build --workspace=apps/api

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./

EXPOSE 8080

CMD ["node", "dist/server.js"]
EOF

# 6. Deploy
fly launch
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set REDIS_URL="redis://..."
fly secrets set OPENAI_API_KEY="sk-..."
fly secrets set ELEVENLABS_API_KEY="..."

fly deploy
```

### Render

```bash
# 1. Conectar repositório em https://render.com
# 2. Criar novo Web Service
# 3. Configurar:
#    - Build Command: npm install && npm run build --workspace=apps/api
#    - Start Command: npm run start --workspace=apps/api
#    - Environment: Node
# 4. Adicionar variáveis de ambiente
# 5. Deploy!
```

## 4. Deploy do Worker

### Render Background Worker

```bash
# 1. Criar novo Background Worker
# 2. Configurar:
#    - Build Command: npm install && npm run build --workspace=apps/worker
#    - Start Command: npm run start --workspace=apps/worker
# 3. Usar as mesmas variáveis de ambiente do API
# 4. Deploy!
```

## 5. Deploy do Frontend

### Vercel (Recomendado)

```bash
# 1. Instalar CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Navegar para web app
cd apps/web

# 4. Deploy
vercel

# Ou para produção
vercel --prod

# 5. Configurar variáveis de ambiente no dashboard
# - NEXT_PUBLIC_API_URL
# - NEXT_PUBLIC_WS_URL
# - NEXTAUTH_URL
# - NEXTAUTH_SECRET
```

### Netlify

```bash
# 1. Instalar CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Criar site
netlify init

# 4. Configurar build:
#    - Build command: npm run build --workspace=apps/web
#    - Publish directory: apps/web/.next
# 5. Deploy
netlify deploy --prod
```

## 6. Configuração de Domínios

### Frontend (Vercel)

```bash
# 1. No dashboard Vercel, ir em Settings > Domains
# 2. Adicionar domínio: alfa-crypto.com
# 3. Configurar DNS:
#    - Type: A
#    - Name: @
#    - Value: 76.76.21.21
#    
#    - Type: CNAME
#    - Name: www
#    - Value: cname.vercel-dns.com
```

### Backend (Fly.io)

```bash
# Adicionar certificado SSL
fly certs create api.alfa-crypto.com

# Configurar DNS:
# - Type: CNAME
# - Name: api
# - Value: alfa-api.fly.dev
```

## 7. Configuração do Stripe

```bash
# 1. Criar produtos e preços em https://dashboard.stripe.com
# 2. Copiar IDs dos preços
# 3. Adicionar em variáveis de ambiente

# 4. Configurar webhook
# URL: https://api.alfa-crypto.com/api/webhooks/stripe
# Eventos: customer.subscription.created, customer.subscription.deleted, invoice.payment_succeeded

# 5. Copiar webhook secret
fly secrets set STRIPE_WEBHOOK_SECRET="whsec_..."
```

## 8. Monitoramento

### Sentry

```bash
# 1. Criar projeto em https://sentry.io
# 2. Instalar SDK
npm install @sentry/nextjs @sentry/node

# 3. Configurar
# Frontend (next.config.js)
const { withSentryConfig } = require('@sentry/nextjs')
module.exports = withSentryConfig(nextConfig, {
  org: "your-org",
  project: "alfa-web",
})

# 4. Adicionar DSN em variáveis
SENTRY_DSN="https://..."
```

### Uptime Monitoring

```bash
# Usar serviços como:
# - UptimeRobot (https://uptimerobot.com)
# - Pingdom (https://pingdom.com)
# - Better Uptime (https://betteruptime.com)

# Endpoints para monitorar:
# - https://alfa-crypto.com
# - https://api.alfa-crypto.com/health
```

## 9. CI/CD com GitHub Actions

Criar `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npm run lint
      - run: npm run test

  deploy-api:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 10. Backup e Disaster Recovery

### Banco de Dados

```bash
# Setup backup automático (Supabase já faz isso)
# Ou configurar no Railway:

# 1. Instalar pg_dump
# 2. Criar script de backup
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
aws s3 cp backup_$(date +%Y%m%d).sql s3://alfa-backups/

# 3. Agendar com cron
0 2 * * * /path/to/backup.sh
```

### Recuperação

```bash
# Restaurar do backup
psql $DATABASE_URL < backup_20240115.sql

# Rodar migrations
npx prisma migrate deploy
```

## 11. Otimizações de Produção

### CDN para Assets

```bash
# Usar Cloudflare ou AWS CloudFront
# Configurar em next.config.js:

module.exports = {
  images: {
    domains: ['cdn.alfa-crypto.com'],
  },
  assetPrefix: 'https://cdn.alfa-crypto.com',
}
```

### Compressão

```bash
# Habilitar gzip/brotli no Vercel (automático)
# No Fly.io, adicionar em fly.toml:

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]
```

## 12. Checklist Final

Antes de ir ao ar:

- [ ] Todas as variáveis de ambiente configuradas
- [ ] SSL/HTTPS ativo
- [ ] Domínios configurados
- [ ] Webhooks do Stripe funcionando
- [ ] Monitoramento ativo (Sentry, Uptime)
- [ ] Backups automáticos configurados
- [ ] Rate limiting testado
- [ ] Testes E2E passando
- [ ] Documentação atualizada
- [ ] Analytics configurado (Google Analytics, Plausible, etc)
- [ ] CORS configurado corretamente
- [ ] Logs estruturados funcionando
- [ ] Health checks respondendo

## Suporte

Em caso de problemas:

1. Verificar logs:
   ```bash
   # Vercel
   vercel logs
   
   # Fly.io
   fly logs
   ```

2. Verificar status dos serviços externos

3. Revisar configurações de variáveis de ambiente

4. Consultar documentação específica de cada plataforma
