# API Documentation - ALFA Voice Crypto Copilot

## Base URL

```
Development: http://localhost:3001
Production: https://api.alfa-crypto.com
```

## Autenticação

Todas as rotas protegidas requerem um token JWT no header:

```http
Authorization: Bearer <token>
```

## Endpoints

### Audio

#### `POST /api/audio/upload`

Faz upload de um arquivo de áudio.

**Request:**
```http
POST /api/audio/upload
Content-Type: multipart/form-data

audio: <file>
```

**Response:**
```json
{
  "success": true,
  "audioId": "audio_123",
  "url": "https://cdn.alfa.com/audio/audio_123.webm",
  "duration": 15.5,
  "size": 524288
}
```

#### `POST /api/audio/transcribe`

Transcreve um áudio para texto.

**Request:**
```http
POST /api/audio/transcribe
Content-Type: multipart/form-data

audio: <file>
language: "pt-BR"
```

**Response:**
```json
{
  "success": true,
  "text": "Qual é o preço do Bitcoin agora?",
  "language": "pt-BR",
  "confidence": 0.98,
  "duration": 2.5
}
```

#### `POST /api/audio/synthesize`

Sintetiza texto para áudio.

**Request:**
```json
{
  "text": "O preço atual do Bitcoin é de 45.320 dólares.",
  "voice": "pt-BR-neural",
  "speed": 1.0
}
```

**Response:**
```json
{
  "success": true,
  "audioUrl": "https://cdn.alfa.com/tts/tts_456.mp3",
  "duration": 3.2,
  "size": 102400
}
```

### Chat

#### `POST /api/chat`

Processa uma mensagem de chat.

**Request:**
```json
{
  "message": "Qual é o preço do Bitcoin?",
  "conversationId": "conv_123",
  "audio": true
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "msg_789",
  "response": {
    "text": "O preço atual do Bitcoin é de 45.320 dólares, uma alta de 2,5% nas últimas 24 horas.",
    "audioUrl": "https://cdn.alfa.com/tts/tts_456.mp3"
  },
  "metadata": {
    "intent": "crypto_price",
    "entities": {
      "symbol": "BTC"
    },
    "toolsUsed": ["getCryptoPrice"]
  }
}
```

### Market

#### `GET /api/market/:symbol`

Obtém dados de mercado para uma criptomoeda.

**Request:**
```http
GET /api/market/BTC
```

**Response:**
```json
{
  "success": true,
  "symbol": "BTC",
  "name": "Bitcoin",
  "price": {
    "usd": 45320.50,
    "brl": 226602.50,
    "change_24h": 2.5,
    "change_7d": -1.2
  },
  "market_cap": 887654321000,
  "volume_24h": 28765432100,
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### `GET /api/market/trending`

Lista as criptomoedas em alta.

**Response:**
```json
{
  "success": true,
  "trending": [
    {
      "symbol": "SOL",
      "name": "Solana",
      "price": 102.45,
      "change_24h": 15.8
    },
    {
      "symbol": "AVAX",
      "name": "Avalanche",
      "price": 38.90,
      "change_24h": 12.3
    }
  ],
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Alerts

#### `POST /api/alerts`

Cria um novo alerta de preço.

**Request:**
```json
{
  "symbol": "BTC",
  "condition": "above",
  "price": 50000,
  "notifyVia": ["email", "push"]
}
```

**Response:**
```json
{
  "success": true,
  "alertId": "alert_123",
  "message": "Alerta criado com sucesso"
}
```

#### `GET /api/alerts`

Lista todos os alertas do usuário.

**Response:**
```json
{
  "success": true,
  "alerts": [
    {
      "id": "alert_123",
      "symbol": "BTC",
      "condition": "above",
      "price": 50000,
      "active": true,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### `DELETE /api/alerts/:id`

Remove um alerta.

**Response:**
```json
{
  "success": true,
  "message": "Alerta removido com sucesso"
}
```

### User

#### `GET /api/user/profile`

Obtém o perfil do usuário autenticado.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "João Silva",
    "plan": "pro",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### `GET /api/user/usage`

Obtém estatísticas de uso.

**Response:**
```json
{
  "success": true,
  "usage": {
    "requests_today": 45,
    "requests_limit": 1000,
    "audio_minutes_month": 25.5,
    "audio_minutes_limit": 200
  },
  "period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-31T23:59:59Z"
  }
}
```

### Subscription

#### `POST /api/subscription/checkout`

Inicia processo de checkout para upgrade.

**Request:**
```json
{
  "plan": "pro",
  "interval": "monthly"
}
```

**Response:**
```json
{
  "success": true,
  "checkoutUrl": "https://checkout.stripe.com/...",
  "sessionId": "cs_123"
}
```

## WebSocket

### Conexão

```javascript
const ws = new WebSocket('ws://localhost:3001/api/realtime?token=<jwt>')

ws.onopen = () => {
  console.log('Connected')
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('Received:', data)
}
```

### Eventos do Servidor

#### `price_update`

```json
{
  "type": "price_update",
  "data": {
    "symbol": "BTC",
    "price": 45320.50,
    "change": 2.5,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### `alert_triggered`

```json
{
  "type": "alert_triggered",
  "data": {
    "alertId": "alert_123",
    "symbol": "BTC",
    "price": 50100,
    "condition": "above",
    "threshold": 50000
  }
}
```

#### `conversation_status`

```json
{
  "type": "conversation_status",
  "data": {
    "status": "processing",
    "stage": "transcribing"
  }
}
```

## Error Responses

Todos os erros seguem o formato:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Você atingiu o limite de requisições para hoje.",
    "details": {
      "limit": 10,
      "reset_at": "2024-01-16T00:00:00Z"
    }
  }
}
```

### Códigos de Erro

- `UNAUTHORIZED` - Token inválido ou ausente
- `RATE_LIMIT_EXCEEDED` - Limite de taxa excedido
- `INVALID_INPUT` - Dados de entrada inválidos
- `AUDIO_TOO_LARGE` - Arquivo de áudio muito grande
- `TRANSCRIPTION_FAILED` - Falha na transcrição
- `EXTERNAL_API_ERROR` - Erro em API externa
- `INTERNAL_ERROR` - Erro interno do servidor

## Rate Limits

### Plano Free

- 10 requisições/dia
- 5 minutos de áudio/mês
- 1 requisição a cada 10 segundos

### Plano Pro

- 1000 requisições/dia
- 200 minutos de áudio/mês
- 10 requisições por segundo

Headers de resposta incluem:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 945
X-RateLimit-Reset: 1642291200
```
