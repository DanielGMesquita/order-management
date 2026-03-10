# 🔐 Guia: Gerar Token JWT e Usar no Postman

## ⚡ Opção Rápida: Importar Collection (Recomendado!)

Se você quer começar **AGORA** sem configurar nada manualmente:

### Passo 1: Importe a Collection
1. Abra o **Postman**
2. Clique em **"Import"** (canto superior esquerdo)
3. Escolha a aba **"File"**
4. Selecione o arquivo: `postman_collection.json`
5. Clique em **"Import"**

✅ Pronto! Você tem todos os endpoints configurados!

### Passo 2: Configure o Token
1. Vá para `/auth/login` na collection
2. Clique em **"Send"**
3. Copie o `token` da resposta
4. Vá para **Collections Settings** (3 pontinhos ao lado do nome)
5. Clique em **"Edit"**
6. Aba **"Variables"**
7. Adicione:
   - **Variable:** `token`
   - **Initial value:** (cole o token aqui)
   - **Current value:** (cole o token aqui)
8. Clique em **"Update"**

✅ Agora todos os endpoints protegidos usarão o token automaticamente!

### Passo 3: Teste os Endpoints
- Clique em qualquer endpoint (ex: "Criar Pedido")
- Clique em **"Send"**
- A variável `{{token}}` será substituída automaticamente

---

## 📋 O que possui a Collection

A collection `postman_collection.json` já inclui:

✅ **Endpoint de Login**
- POST `/auth/login`
- Body pré-preenchido

✅ **CRUD de Pedidos**
- POST `/order` - Criar
- GET `/order/list` - Listar
- GET `/order/:id` - Obter específico
- PUT `/order/:id` - Atualizar
- DELETE `/order/:id` - Deletar

✅ **Autenticação Pré-configurada**
- Bearer Token no header
- Variável `{{token}}` para todos

---

## 🎥 Passo a Passo com Screenshots

### 1. Import Collection

```
Postman → Click "Import" (top left)
         → Select "File" tab
         → Choose postman_collection.json
         → Click "Import"
```

### 2. Login e Copie o Token

```
1. Click: Collections → auth → login
2. Click: "Send" button
3. Response appears (bottom)
4. Copy the value from: data.token
```

### 3. Salve o Token como Variável

```
1. Right-click Collection name
2. Select "Edit"
3. Go to "Variables" tab
4. Add variable:
   Name: token
   Initial: (paste token)
   Current: (paste token)
5. Click "Update"
```

### 4. Use em Rotas Protegidas

```
1. Select: Collections → Criar Pedido
2. Authorization tab: Already set to Bearer {{token}}
3. Click "Send"
4. Success! ✅
```

---

---

## 🔄 Opção 1: Usar Endpoint de Login (Manual)

### Passo 1: Faça Login
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Token gerado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTE2NzQ3NzY4MDA5NzMiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwibG9naW5UaW1lIjoiMjAyNC0wMy0wOVQxMjozMDowMC4wMDBaIiwiaWF0IjoxNjc0Nzc2ODAwLCJleHAiOjE2NzQ4NjMyMDB9.xxxx",
    "expiresIn": "24h",
    "user": {
      "userId": "user-1674776800973",
      "username": "testuser",
      "email": "test@example.com",
      "role": "admin",
      "loginTime": "2024-03-09T12:30:00.000Z"
    }
  }
}
```

### Passo 2: Copie o Token
Copie o valor do campo `data.token` (a string longa)

### Passo 3: Use em Rotas Protegidas

**Exemplo: Criar um Pedido**
```
POST http://localhost:3000/order
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTE2NzQ3NzY4MDA5NzMiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwibG9naW5UaW1lIjoiMjAyNC0wMy0wOVQxMjozMDowMC4wMDBaIiwiaWF0IjogMTY3NDc3NjgwMCwiZXhwIjoxNjc0ODYzMjAwfQ.xxxx

{
  "numeroPedido": "001",
  "valorTotal": 1500,
  "dataCriacao": "2024-03-09T12:30:00Z",
  "items": [
    {
      "idItem": "1",
      "quantidadeItem": 2,
      "valorItem": 750
    }
  ]
}
```

---

## Opção 2: Gerar Token com Script Node.js

### Passo 1: Execute o Script
```bash
node generate-token.js
```

**Saída:**
```
╔════════════════════════════════════════════════════════════╗
║           Token JWT Gerado com Sucesso!                   ║
╚════════════════════════════════════════════════════════════╝

📋 Payload:
{
  "userId": "test-user-123",
  "email": "test@example.com",
  "role": "admin",
  "username": "testuser"
}

🔑 Token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImlhdCI6MTY3NDc3NjgwMCwiZXhwIjoxNjc0ODYzMjAwfQ.xxxx
```

### Passo 2: Copie o Token
Copie a string do token (a linha depois de "🔑 Token:")

### Passo 3: Use no Postman
Siga os mesmos passos da Opção 1

---

## Configurar Token no Postman (Interface Visual)

### Método 1: Via Headers (Recomendado)
1. Abra uma requisição POST no Postman
2. Clique na aba **"Headers"**
3. Adicione:
   - **Key:** `Authorization`
   - **Value:** `Bearer seu_token_aqui`

### Método 2: Via Bearer Token (Postman 7+)
1. Abra uma requisição POST
2. Clique na aba **"Authorization"**
3. No dropdown, selecione **"Bearer Token"**
4. Cole seu token no campo **"Token"**

---

## Testando as Rotas

### Rotas Públicas (Sem Token)
```bash
# Listar todos os pedidos
curl http://localhost:3000/order/list

# Obter um pedido específico
curl http://localhost:3000/order/v10089015vdb-01
```

### Rotas Protegidas (Com Token)
```bash
# Criar pedido
curl -X POST http://localhost:3000/order \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "002",
    "valorTotal": 2000,
    "dataCriacao": "2024-03-09T12:30:00Z",
    "items": [{"idItem": "1", "quantidadeItem": 1, "valorItem": 2000}]
  }'

# Atualizar pedido
curl -X PUT http://localhost:3000/order/002 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"valorTotal": 2500}'

# Deletar pedido
curl -X DELETE http://localhost:3000/order/002 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## Endpoints de Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Gera novo token |
| POST | `/auth/refresh` | Refresh token (se implementado) |

---

## Informações do Token

- **Tipo:** JWT (JSON Web Token)
- **Formato:** `Bearer <token>`
- **Expiração:** 24 horas (configurável em `.env`)
- **Secret:** Definido na variável `JWT_SECRET` do `.env`

---

## Troubleshooting

### Erro: "Token não fornecido" (401)
- ✅ Solução: Certifique-se de incluir o header `Authorization: Bearer <token>`

### Erro: "Token inválido ou expirado" (403)
- ✅ Solução: Gere um novo token com `/auth/login`

### Erro: "Username é obrigatório" (400)
- ✅ Solução: Envie `{ "username": "seu_usuario" }` no body do `/auth/login`

---

## Variáveis de Ambiente (.env)

```env
# Autenticação
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRATION=24h

# Base de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=order_management
DB_USER=postgres
DB_PASSWORD=postgres
```

Para alterar a duração do token, modifique `JWT_EXPIRATION` no `.env`:
- `1h` - 1 hora
- `24h` - 24 horas (padrão)
- `7d` - 7 dias
- `30d` - 30 dias

---

## 🔄 Usar Scripts com Collection

### Atualizar Token Automaticamente

Você pode configurar um **"Pre-request Script"** para gerar novo token automaticamente:

1. Clique em **"Collections"** → **"Order Management API"**
2. Aba **"Pre-request Script"**
3. Adicione:

```javascript
// Se o token expirar, gera um novo automaticamente
if (!pm.environment.get("token") || pm.environment.get("tokenExpiry") < Date.now()) {
  pm.sendRequest({
    url: 'http://localhost:3000/auth/login',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    body: {
      mode: 'raw',
      raw: JSON.stringify({
        username: 'daniel',
        email: 'daniel@example.com'
      })
    }
  }, function (err, response) {
    if (!err) {
      var json = response.json();
      pm.environment.set("token", json.data.token);
      pm.environment.set("tokenExpiry", Date.now() + 24 * 60 * 60 * 1000);
    }
  });
}
```

4. Clique em **"Save"**

Agora o token será renovado automaticamente quando expirar!

---

## 📊 Estrutura da Collection

```
Order Management API
├── auth (Autenticação)
│   └── login                    (POST)
├── Criar Pedido                 (POST) - Requer token
├── Obter Pedido Específico      (GET)  - Público
├── Listar Todos os Pedidos      (GET)  - Público
├── Atualizar Pedido             (PUT)  - Requer token
└── Deletar Pedido               (DELETE) - Requer token
```

---

## 🛠️ Personalizando a Collection

### Adicionar Novo Endpoint

1. Clique em **"+"** ao lado de "Order Management API"
2. Nome: seu endpoint
3. URL: adicione a rota
4. Se precisar auth: Authorization → Bearer → `{{token}}`
5. Clique em **"Save"**

### Mudar a URL Base

Se sua API está em outro servidor:

1. Right-click na Collection
2. **"Edit"** → **"Variables"**
3. Adicione: 
   - **Variable:** `baseUrl`
   - **Initial:** `http://localhost:3000`
4. Nos endpoints, use: `{{baseUrl}}/order`

---

## 🚀 Dicas Pro

### 1. Usar Environments

Crie diferentes ambientes para dev, staging e produção:

1. **New** → **Environment**
2. Nome: "Development"
3. Variables:
   ```
   baseUrl: http://localhost:3000
   token: (seu token)
   ```
4. Fazer o mesmo para "Production", "Staging"
5. Switch entre ambientes no dropdown

### 2. Usar Tests para Validar Respostas

No endpoint `/auth/login`, aba **"Tests"**:

```javascript
pm.test("Response status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.token).to.exist;
});

// Salvar token automaticamente
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.token);
}
```

### 3. Usar Valores Dinâmicos nos Request

Você pode usar variáveis do Postman:

```json
{
  "numeroPedido": "P{{$randomInt(1000, 9999)}}",
  "valorTotal": {{$randomInt(100, 10000)}},
  "dataCriacao": "{{$timestamp}}"
}
```

---

## 📱 Testar em Mobile

Postman também tem aplicativo mobile:

1. Instale: "Postman" (iOS/Android)
2. Login com sua conta Postman
3. Suas collections sincronizam automaticamente
4. Use em qualquer lugar!

---

## 🔒 Exportar Collection com Segurança

Para compartilhar a collection sem expor tokens:

1. Right-click Collection
2. **"Export"**
3. Escolha **"Collection v2.1"**
4. **Export**

**Aviso:** Remova tokens antes de compartilhar!

---

## 🆘 Problemas Comuns

### Collection não importa
- Verifique se o arquivo `postman_collection.json` existe
- Tente reimportar

### Token não funciona
- Execute `/auth/login` novamente
- Atualize a variável `{{token}}`
- Verifique se está usando Bearer Token corretamente

### Request dá erro 401
- Token expirou → Gere um novo
- Header não foi enviado → Verifique Authorization
- Token incorreto → Copie o token novamente do `/auth/login`

### Variável não substitui valor
- Use sintaxe correta: `{{nome_da_variavel}}`
- Certifique-se que a variável foi criada
- Recarregue a collection (F5)

---

## 📚 Documentação oficial

- [Postman Collections](https://learning.postman.com/docs/sending-requests/managing-request-collections/)
- [Postman Variables](https://learning.postman.com/docs/sending-requests/variables/)
- [Postman Scripts](https://learning.postman.com/docs/writing-scripts/intro-to-scripts/)
