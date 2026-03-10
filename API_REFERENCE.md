# 📚 API Reference - Order Management

Documentação técnica completa de todos os endpoints.

## 📍 Base URL

```
http://localhost:3000
```

## 🔐 Autenticação

Todos os endpoints protegidos requerem o header:

```http
Authorization: Bearer <jwt_token>
```

---

## 🔑 Autenticação

### POST /auth/login

Gera um novo token JWT para acesso aos endpoints protegidos.

**Requisição:**
```http
POST /auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "username": "daniel",
  "email": "daniel@example.com"
}
```

**Parâmetros de Body:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-----------|-----------|
| `username` | string | ✅ Sim | Nome do usuário |
| `email` | string | ❌ Não | Email do usuário |

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Token gerado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTE3NzMwOTU0MDIxMjciLCJ1c2VybmFtZSI6ImRhbmllbCIsImVtYWlsIjoiZGFuaWVsQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwibG9naW5UaW1lIjoiMjAyNi0wMy0wOVQyMjozMDowMi4xMjdaIiwiaWF0IjoxNzczMDk1NDAyLCJleHAiOjE3NzMxODE4MDJ9.I2LOCcYjQTJkWaX25QiLnU8JuBr-tkpVHntYjiSB7rU",
    "expiresIn": "24h",
    "user": {
      "userId": "user-1773095402127",
      "username": "daniel",
      "email": "daniel@example.com",
      "role": "admin",
      "loginTime": "2026-03-09T22:30:02.127Z"
    }
  }
}
```

**Respostas de Erro:**

| Status | Descrição | Corpo |
|--------|-----------|-------|
| 400 | Username obrigatório | `{ "success": false, "message": "Username é obrigatório" }` |
| 500 | Erro interno | `{ "success": false, "message": "Erro ao gerar token" }` |

---

### POST /auth/refresh

Gera um novo token usando um token válido (refresh).

**Requisição:**
```http
POST /auth/refresh HTTP/1.1
Host: localhost:3000
Authorization: Bearer <seu_token>
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Token renovado com sucesso",
  "data": {
    "token": "novo_token_jwt",
    "expiresIn": "24h"
  }
}
```

**Respostas de Erro:**

| Status | Descrição |
|--------|-----------|
| 401 | Token não fornecido |
| 403 | Token inválido ou expirado |

---

## 📦 Pedidos (Orders)

### GET /

Health check - Verifica se a API está operacional.

**Requisição:**
```http
GET / HTTP/1.1
Host: localhost:3000
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "API está operacional",
  "endpoints": {
    "post": "/order (requer autenticação)",
    "get": [
      "/order/list (sem autenticação)",
      "/order/:orderId (sem autenticação)"
    ],
    "put": "/order/:orderId (requer autenticação)",
    "delete": "/order/:orderId (requer autenticação)"
  }
}
```

---

### POST /order

Cria um novo pedido. **Requer autenticação.**

**Requisição:**
```http
POST /order HTTP/1.1
Host: localhost:3000
Authorization: Bearer <token>
Content-Type: application/json

{
  "numeroPedido": "P001",
  "valorTotal": 1500.50,
  "dataCriacao": "2024-03-09T22:30:00Z",
  "items": [
    {
      "idItem": "ITEM001",
      "quantidadeItem": 2,
      "valorItem": 750.25
    },
    {
      "idItem": "ITEM002",
      "quantidadeItem": 1,
      "valorItem": 0
    }
  ]
}
```

**Parâmetros de Body:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-----------|-----------|
| `numeroPedido` | string | ✅ | Identificador único do pedido |
| `valorTotal` | number | ✅ | Valor total do pedido |
| `dataCriacao` | string (ISO) | ✅ | Data de criação |
| `items` | array | ✅ | Array de itens do pedido |
| `items[].idItem` | string | ✅ | ID do item |
| `items[].quantidadeItem` | integer | ✅ | Quantidade |
| `items[].valorItem` | number | ✅ | Valor unitário |

**Resposta (201 Created):**
```json
{
  "success": true,
  "message": "Pedido criado com sucesso",
  "data": {
    "numeroPedido": "P001",
    "valorTotal": 1500.50,
    "dataCriacao": "2024-03-09T22:30:00.000Z",
    "createdAt": "2024-03-09T22:30:00.123Z",
    "updatedAt": "2024-03-09T22:30:00.123Z",
    "items": [
      {
        "id": 1,
        "orderId": "P001",
        "idItem": "ITEM001",
        "quantidadeItem": 2,
        "valorItem": 750.25,
        "createdAt": "2024-03-09T22:30:00.123Z",
        "updatedAt": "2024-03-09T22:30:00.123Z"
      }
    ]
  }
}
```

**Respostas de Erro:**

| Status | Descrição | Exemplo |
|--------|-----------|---------|
| 400 | Validação falhou | `{ "success": false, "errors": [...] }` |
| 401 | Token não fornecido | `{ "success": false, "message": "Token não fornecido" }` |
| 403 | Token inválido | `{ "success": false, "message": "Token inválido ou expirado" }` |
| 409 | Pedido já existe | `{ "success": false, "message": "Pedido com número P001 já existe" }` |
| 500 | Erro interno | `{ "success": false, "message": "Erro ao criar pedido" }` |

---

### GET /order/list

Lista todos os pedidos. **Público (Sem autenticação).**

**Requisição:**
```http
GET /order/list HTTP/1.1
Host: localhost:3000
```

**Query Parameters:**
Nenhum parâmetro de query suportado no momento.

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Pedidos listados com sucesso",
  "data": [
    {
      "numeroPedido": "P001",
      "valorTotal": 1500.50,
      "dataCriacao": "2024-03-09T22:30:00.000Z",
      "items": [
        {
          "id": 1,
          "idItem": "ITEM001",
          "quantidadeItem": 2,
          "valorItem": 750.25
        }
      ]
    }
  ],
  "count": 1
}
```

**Respostas de Erro:**

| Status | Descrição |
|--------|-----------|
| 500 | Erro ao listar pedidos |

---

### GET /order/:orderId

Obtém um pedido específico pelo ID. **Público (Sem autenticação).**

**Requisição:**
```http
GET /order/P001 HTTP/1.1
Host: localhost:3000
```

**Parâmetros de URL:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `orderId` | string | ID do pedido (numeroPedido) |

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Pedido encontrado",
  "data": {
    "numeroPedido": "P001",
    "valorTotal": 1500.50,
    "dataCriacao": "2024-03-09T22:30:00.000Z",
    "items": [
      {
        "id": 1,
        "idItem": "ITEM001",
        "quantidadeItem": 2,
        "valorItem": 750.25
      }
    ]
  }
}
```

**Respostas de Erro:**

| Status | Descrição | Exemplo |
|--------|-----------|---------|
| 404 | Pedido não encontrado | `{ "success": false, "message": "Pedido P999 não encontrado" }` |
| 500 | Erro ao obter pedido | `{ "success": false, "message": "Erro ao obter pedido" }` |

---

### PUT /order/:orderId

Atualiza um pedido existente. **Requer autenticação.**

**Requisição:**
```http
PUT /order/P001 HTTP/1.1
Host: localhost:3000
Authorization: Bearer <token>
Content-Type: application/json

{
  "valorTotal": 2000.00,
  "dataCriacao": "2024-03-09T23:00:00Z",
  "items": [
    {
      "idItem": "ITEM001",
      "quantidadeItem": 3,
      "valorItem": 666.67
    }
  ]
}
```

**Parâmetros de URL:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `orderId` | string | ID do pedido a atualizar |

**Parâmetros de Body:**
Todos os campos são opcionais. Envie apenas os campos que deseja atualizar.

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `valorTotal` | number | Novo valor total |
| `dataCriacao` | string | Nova data |
| `items` | array | Novo array de itens (substitui todos) |

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Pedido atualizado com sucesso",
  "data": {
    "numeroPedido": "P001",
    "valorTotal": 2000.00,
    "dataCriacao": "2024-03-09T23:00:00.000Z",
    "items": [...]
  }
}
```

**Respostas de Erro:**

| Status | Descrição |
|--------|-----------|
| 400 | Validação falhou |
| 401 | Token não fornecido |
| 403 | Token inválido |
| 404 | Pedido não encontrado |
| 500 | Erro ao atualizar |

---

### DELETE /order/:orderId

Deleta um pedido. **Requer autenticação.**

**Requisição:**
```http
DELETE /order/P001 HTTP/1.1
Host: localhost:3000
Authorization: Bearer <token>
```

**Parâmetros de URL:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `orderId` | string | ID do pedido a deletar |

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Pedido deletado com sucesso"
}
```

**Respostas de Erro:**

| Status | Descrição |
|--------|-----------|
| 401 | Token não fornecido |
| 403 | Token inválido |
| 404 | Pedido não encontrado |
| 500 | Erro ao deletar |

---

## 🔄 Status HTTP

| Código | Significado |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token não fornecido |
| 403 | Forbidden - Token inválido/expirado ou sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Recurso já existe |
| 500 | Internal Server Error - Erro do servidor |

---

## 📋 Estrutura de Response

### Sucesso
```json
{
  "success": true,
  "message": "Descrição da ação",
  "data": { /* dados opcionais */ },
  "count": 10 /* opcional para listas */
}
```

### Erro
```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Detalhes técnicos (somente em development)",
  "errors": [ /* array de erros de validação */ ]
}
```

---

## 🔑 Modelo de Dados

### Order Object

```json
{
  "numeroPedido": "string",
  "valorTotal": "number",
  "dataCriacao": "string (ISO 8601)",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)",
  "items": [
    {
      "id": "integer",
      "orderId": "string",
      "idItem": "string",
      "quantidadeItem": "integer",
      "valorItem": "number"
    }
  ]
}
```

### User Object (JWT Payload)

```json
{
  "userId": "string",
  "username": "string",
  "email": "string",
  "role": "string",
  "loginTime": "string (ISO 8601)",
  "iat": "number (timestamp)",
  "exp": "number (timestamp)"
}
```

---

## 🧪 Exemplos com cURL

### Gerar Token
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "daniel"}'
```

### Criar Pedido
```bash
curl -X POST http://localhost:3000/order \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "P001",
    "valorTotal": 1500,
    "dataCriacao": "2024-03-09T22:30:00Z",
    "items": [{"idItem": "1", "quantidadeItem": 1, "valorItem": 1500}]
  }'
```

### Listar Pedidos
```bash
curl http://localhost:3000/order/list
```

### Obter Pedido
```bash
curl http://localhost:3000/order/P001
```

### Atualizar Pedido
```bash
curl -X PUT http://localhost:3000/order/P001 \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{"valorTotal": 2000}'
```

### Deletar Pedido
```bash
curl -X DELETE http://localhost:3000/order/P001 \
  -H "Authorization: Bearer seu_token"
```

---

## 📝 Rate Limiting

Atualmente não implementado. Planeado para futuras versões.

---

## 🔒 Segurança

### CORS

CORS não está configurado neste momento. Para produção, configure em `app.js`:

```javascript
import cors from 'cors';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));
```

### Headers de Segurança

Use Helmet para adicionar headers de segurança:

```javascript
import helmet from 'helmet';
app.use(helmet());
```

---

## 🔗 Links Úteis

- [JWT.io](https://jwt.io) - Decodificar tokens
- [Postman](https://www.postman.com/) - Testar API
- [Swagger UI](http://localhost:3000/api-docs) - Documentação interativa

---

**Versão:** 1.0.0  
**Última atualização:** 09/03/2026
