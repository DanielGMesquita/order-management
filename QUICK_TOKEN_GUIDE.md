# 🔐 Resumo Rápido: JWT Token no Postman

## 1️⃣ GERAR TOKEN (Login)

**Request:**
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "daniel",
  "email": "daniel@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token gerado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h",
    "user": {
      "userId": "user-xxx",
      "username": "daniel",
      "email": "daniel@example.com",
      "role": "admin"
    }
  }
}
```

---

## 2️⃣ COPIE O TOKEN

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTE3NzMwOTU0MDIxMjciLCJ1c2VybmFtZSI6ImRhbmllbCIsImVtYWlsIjoiZGFuaWVsQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwibG9naW5UaW1lIjoiMjAyNi0wMy0wOVQyMjozMDowMi4xMjdaIiwiaWF0IjoxNzczMDk1NDAyLCJleXAiOjE3NzMxODE4MDJ9.I2LOCcYjQTJkWaX25QiLnU8JuBr-tkpVHntYjiSB7rU
```

---

## 3️⃣ USE EM ROTAS PROTEGIDAS

### Opção A: Via Headers Tab

1. Abra uma requisição POST/PUT/DELETE
2. Aba **"Headers"**
3. Adicione:
   ```
   Key:   Authorization
   Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Opção B: Via Authorization Tab (Postman 7+)

1. Aba **"Authorization"**
2. Type: **"Bearer Token"**
3. Token: Cole seu token aqui

---

## 4️⃣ TESTE AS ROTAS

### Criar Pedido (Requer Token)
```bash
POST http://localhost:3000/order
Headers: Authorization: Bearer seu_token_aqui
Body:
{
  "numeroPedido": "P002",
  "valorTotal": 2000,
  "dataCriacao": "2024-03-09T22:30:00Z",
  "items": [
    {"idItem": "2", "quantidadeItem": 1, "valorItem": 2000}
  ]
}
```

### Listar Pedidos (Sem Token - Público)
```bash
GET http://localhost:3000/order/list
```

### Obter Pedido Específico (Sem Token - Público)
```bash
GET http://localhost:3000/order/P002
```

### Atualizar Pedido (Requer Token)
```bash
PUT http://localhost:3000/order/P002
Headers: Authorization: Bearer seu_token_aqui
Body:
{
  "valorTotal": 2500
}
```

### Deletar Pedido (Requer Token)
```bash
DELETE http://localhost:3000/order/P002
Headers: Authorization: Bearer seu_token_aqui
```

---

## 🔍 Verificando Seu Token

Use o site [jwt.io](https://jwt.io) para decodificar seu token e ver o payload:

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "userId": "user-1773095393518",
  "username": "daniel",
  "email": "daniel@example.com",
  "role": "admin",
  "loginTime": "2026-03-09T22:30:02.127Z",
  "iat": 1773095402,
  "exp": 1773181802
}
```

**Signature:** Assinado com `JWT_SECRET` do .env

---

## 📋 Endpoints de Autenticação

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| POST | `/auth/login` | ❌ | Gera novo token |
| POST | `/auth/refresh` | ✅ | Refresh token |

---

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| 401 - "Token não fornecido" | Adicione header `Authorization: Bearer token` |
| 403 - "Token inválido ou expirado" | Gere novo token com `/auth/login` |
| 404 - Rota não encontrada | Verifique o endpoint URL |
| 409 - Pedido já existe | Use número de pedido diferente |

---

## 💾 Salvar Token para Reusar

### Usar Variável de Ambiente no Postman

1. Vá para **Collections** → **Variables** (ou **Tests**)
2. Adicione uma variável para armazenar o token
3. No script **"Tests"** do endpoint de login (após receber resposta):
   ```javascript
   if (pm.response.code === 200) {
     pm.environment.set("token", pm.response.json().data.token);
   }
   ```
4. Em outras requisições, use: `{{token}}`

---

## ⏰ Duração do Token

- **Padrão:** 24 horas
- **Configurável:** Altere `JWT_EXPIRATION` em `.env`
  - `1h` = 1 hora
  - `7d` = 7 dias
  - `30d` = 30 dias

---

## 🔐 Segurança

- ✅ Nunca compartilhe seu token
- ✅ Válido por 24 horas (expira e precisa fazer login novamente)
- ✅ Assinado com chave secreta (`JWT_SECRET`)
- ✅ Use HTTPS em produção
