# 📦 Order Management API

Uma API REST para gerenciamento de pedidos, desenvolvida com Express.js, PostgreSQL e autenticação JWT.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express.js](https://img.shields.io/badge/Express.js-5+-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791)
![JWT](https://img.shields.io/badge/JWT-Autenticação-FF6B6B)
![Jest](https://img.shields.io/badge/Jest-Testes-15C213)

---

## 🎯 Descrição

API REST completa para gerenciar pedidos (orders) e itens (items) com:
- ✅ Autenticação segura com JWT
- ✅ CRUD completo de pedidos
- ✅ Relacionamentos entre tabelas
- ✅ Validação de dados
- ✅ Documentação com Swagger
- ✅ Testes automatizados (Jest)
- ✅ Docker Compose para ambiente local

---

## 🛠️ Tech Stack

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| **Node.js** | 18+ | Runtime |
| **Express.js** | 5.x | Web Framework |
| **PostgreSQL** | 13+ | Database |
| **Sequelize** | 6.x | ORM |
| **JWT** | 9.x | Autenticação |
| **Jest** | 30.x | Testes |
| **Docker** | Latest | Containerização |
| **Swagger** | 6.x | Documentação |

---

## 📋 Pré-requisitos

- **Node.js** 18+
- **PostgreSQL** 13+ (ou Docker + Docker Compose)
- **npm** ou **yarn**
- **Git**

---

## 🚀 Instalação

### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/seu-usuario/order-management.git
cd order-management
```

### 2️⃣ Instale as Dependências
```bash
npm install
```

### 3️⃣ Configure Variáveis de Ambiente

Copie o arquivo `.env.example`:
```bash
cp .env.example .env
```

Edite `.env` com seus valores:
```env
# Express
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=order_management
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRATION=24h
```

### 4️⃣ Inicie o PostgreSQL

**Opção A: Usando Docker Compose (Recomendado)**
```bash
docker-compose up -d
```

**Opção B: PostgreSQL Local**
```bash
# Crie o banco de dados
createdb order_management
```

### 5️⃣ Inicie a Aplicação

**Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

A API estará disponível em: `http://localhost:3000`

---

## 📚 Estrutura do Projeto

```
order-management/
├── src/
│   ├── app.js                    # Inicialização Express
│   ├── config/
│   │   ├── database.js           # Configuração Sequelize
│   │   └── swagger.js            # Documentação Swagger
│   ├── controllers/
│   │   └── OrderController.js    # Lógica dos pedidos
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   ├── models/
│   │   ├── Order.js              # Modelo de pedido
│   │   └── Item.js               # Modelo de item
│   ├── routes/
│   │   └── OrderRoutes.js        # Rotas da API
│   └── utils/
│       ├── mappers.js            # Mapeamento de dados
│       └── validators.js         # Validação de dados
├── tests/
│   ├── unit/
│   │   └── auth.test.js          # Testes unitários JWT
│   └── integration/
│       └── auth.integration.test.js  # Testes integração
├── generate-token.js             # Script para gerar tokens
├── jest.config.js                # Configuração Jest
├── package.json                  # Dependências
├── docker-compose.yml            # Configuração Docker
└── README.md                      # Este arquivo
```

---

## 🔐 Autenticação JWT

### 1️⃣ Gerar Token

**Endpoint:**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "daniel",
  "email": "daniel@example.com"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Token gerado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h",
    "user": {
      "userId": "user-1773095393518",
      "username": "daniel",
      "email": "daniel@example.com",
      "role": "admin"
    }
  }
}
```

### 2️⃣ Usar Token em Requisições

Adicione o header de autenticação em rotas protegidas:

```http
Authorization: Bearer seu_token_jwt_aqui
```

### Script Node.js para Gerar Token

```bash
node generate-token.js
```

Saída:
```
╔════════════════════════════════════════════════════════════╗
║           Token JWT Gerado com Sucesso!                   ║
╚════════════════════════════════════════════════════════════╝

🔑 Token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ...
```

---

## 📡 Endpoints da API

### 🔍 Health Check

```http
GET /
```

**Resposta (200):**
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

### 📝 Pedidos (Orders)

#### ➕ Criar Pedido (Requer Token)

```http
POST /order
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "numeroPedido": "P001",
  "valorTotal": 1500,
  "dataCriacao": "2024-03-09T22:30:00Z",
  "items": [
    {
      "idItem": "1",
      "quantidadeItem": 1,
      "valorItem": 1500
    }
  ]
}
```

**Resposta (201):**
```json
{
  "success": true,
  "message": "Pedido criado com sucesso",
  "data": {
    "numeroPedido": "P001",
    "valorTotal": 1500,
    "dataCriacao": "2024-03-09T22:30:00Z",
    "items": [...]
  }
}
```

**Erros possíveis:**
- `400` - Validação de dados inválidos
- `401` - Token não fornecido
- `403` - Token inválido ou expirado
- `409` - Pedido já existe

---

#### 📋 Listar Todos os Pedidos (Público)

```http
GET /order/list
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Pedidos listados com sucesso",
  "data": [
    {
      "numeroPedido": "P001",
      "valorTotal": 1500,
      "dataCriacao": "2024-03-09T22:30:00Z",
      "items": [...]
    }
  ],
  "count": 1
}
```

---

#### 🔎 Obter Pedido Específico (Público)

```http
GET /order/:orderId
```

**Exemplo:**
```http
GET /order/P001
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Pedido encontrado",
  "data": {
    "numeroPedido": "P001",
    "valorTotal": 1500,
    ...
  }
}
```

**Erros possíveis:**
- `404` - Pedido não encontrado

---

#### ✏️ Atualizar Pedido (Requer Token)

```http
PUT /order/:orderId
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "valorTotal": 2000,
  "dataCriacao": "2024-03-09T22:30:00Z",
  "items": [
    {
      "idItem": "2",
      "quantidadeItem": 2,
      "valorItem": 1000
    }
  ]
}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Pedido atualizado com sucesso",
  "data": {...}
}
```

---

#### 🗑️ Deletar Pedido (Requer Token)

```http
DELETE /order/:orderId
Authorization: Bearer SEU_TOKEN
```

**Exemplo:**
```http
DELETE /order/P001
Authorization: Bearer seu_token
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Pedido deletado com sucesso"
}
```

---

## 🧪 Testes

### Rodar Testes

```bash
# Todos os testes
npm test

# Apenas autenticação
npm test -- auth

# Com coverage
npm test -- --coverage

# Modo watch (rerun ao salvar)
npm run test:watch
```

### Estrutura de Testes

- **Unit Tests**: `tests/unit/auth.test.js`
  - 18 testes para geração e validação de tokens
  - Cobertura: 100% da lógica de autenticação

- **Integration Tests**: `tests/integration/auth.integration.test.js`
  - 23 testes de endpoints com autenticação
  - Validação de rotas públicas e protegidas

---

## 📖 Documentação Swagger

Acesse a documentação interativa em:

```
http://localhost:3000/api-docs
```

Interactive UI para testar todos os endpoints!

---

## 🔧 Postman Collection

### 1️⃣ Criar Collection
1. Abra o Postman
2. Crie uma nova Collection: `Order Management`

### 2️⃣ Configurar Autenticação
1. Aba **Authorization**
2. Type: **Bearer Token**
3. Token: Obtenha em `/auth/login`

### 3️⃣ Exemplos de Requisições

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "daniel"}'
```

#### Criar Pedido
```bash
curl -X POST http://localhost:3000/order \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "P001",
    "valorTotal": 1500,
    "dataCriacao": "2024-03-09T22:30:00Z",
    "items": [{"idItem": "1", "quantidadeItem": 1, "valorItem": 1500}]
  }'
```

#### Listar Pedidos
```bash
curl http://localhost:3000/order/list
```

#### Obter Pedido
```bash
curl http://localhost:3000/order/P001
```

#### Atualizar Pedido
```bash
curl -X PUT http://localhost:3000/order/P001 \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"valorTotal": 2000}'
```

#### Deletar Pedido
```bash
curl -X DELETE http://localhost:3000/order/P001 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 📊 Scripts NPM

```bash
npm start              # Inicia servidor em produção
npm run dev            # Inicia servidor com nodemon (desenvolvimento)
npm test               # Executa testes completos
npm run test:watch     # Modo watch para testes
npm run test:coverage  # Gera relatório de cobertura
```

---

## 🐛 Troubleshooting

### ❌ Erro: `connect ECONNREFUSED 127.0.0.1:5432`

**Problema:** PostgreSQL não está rodando

**Solução:**
```bash
# Com Docker
docker-compose up -d

# Ou local
brew services start postgresql  # macOS
systemctl start postgresql      # Linux
```

---

### ❌ Erro: `401 - Token não fornecido`

**Problema:** Header de autenticação não foi enviado

**Solução:** Adicione o header em rotas protegidas:
```
Authorization: Bearer seu_token_aqui
```

---

### ❌ Erro: `403 - Token inválido ou expirado`

**Problema:** Token expirou ou é inválido

**Solução:** Gere um novo token:
```bash
# Via API
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "daniel"}'

# Ou script
node generate-token.js
```

---

### ❌ Erro: `404 - Pedido não encontrado`

**Problema:** O pedido solicitado não existe no banco

**Solução:** 
1. Liste todos os pedidos: `GET /order/list`
2. Use um `numeroPedido` que existe

---

### ❌ Erro: `409 - Pedido já existe`

**Problema:** Tentou criar pedido com número duplicado

**Solução:** Use um `numeroPedido` diferente

---

## 🔒 Segurança

### Boas Práticas Implementadas

✅ **JWT Token**
- Assinado com secret key
- Expiração de 24 horas
- Bearer token pattern

✅ **Validação**
- Validação de dados em todas as rotas
- Sanitização de entrada
- Type checking com Sequelize

✅ **CORS & Headers**
- Express.json middleware
- Helmet para headers de segurança
- Tratamento de erro global

✅ **Database**
- Relacionamentos com FK
- Cascade delete/update
- Transações

### Recomendações Produção

- [ ] Usar HTTPS/SSL
- [ ] Adicionar rate limiting
- [ ] Implementar refresh tokens
- [ ] Adicionar role-based access control (RBAC)
- [ ] Usar secrets manager (AWS Secrets, Vault)
- [ ] Implementar logging estruturado
- [ ] Adicionar monitoring e alertas

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Modelo de Dados

### Order (Pedido)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `numeroPedido` | STRING | Primary Key - Identificador único |
| `valorTotal` | DECIMAL | Valor total do pedido |
| `dataCriacao` | DATETIME | Data de criação |
| `createdAt` | DATETIME | Timestamp criação (Sequelize) |
| `updatedAt` | DATETIME | Timestamp última atualização |

### Item (Item do Pedido)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INTEGER | Primary Key - Auto increment |
| `orderId` | STRING | Foreign Key para Order |
| `idItem` | STRING | ID do item |
| `quantidadeItem` | INTEGER | Quantidade |
| `valorItem` | DECIMAL | Valor unitário |
| `createdAt` | DATETIME | Timestamp criação |
| `updatedAt` | DATETIME | Timestamp última atualização |

**Relacionamento:**
- Order (1) → (N) Items
- Cascade Delete: Ao deletar Order, seus Items são deletados automaticamente

---

## 📚 Recursos Adicionais

- [Express.js Docs](https://expressjs.com/)
- [Sequelize Docs](https://sequelize.org/)
- [JWT Intro](https://jwt.io/introduction)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Jest Testing](https://jestjs.io/)

---

## 📄 Licença

Este projeto está sob a licença ISC.

---

## ✨ Desenvolvido por

Daniel - 2024

---

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório ou entre em contato.

---

**Versão:** 1.0.0  
**Última atualização:** 09/03/2026
