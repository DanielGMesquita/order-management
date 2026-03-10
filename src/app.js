import express from 'express';
import dotenv from 'dotenv';
import router from "./routes/router.js";
import db from "./config/database.js"
import { serve, setup } from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

dotenv.config();

export const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/", router);

// Inicializa o banco de dados e inicia o servidor (apenas se não for em modo de testes)
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await db.authenticate();
      await db.sync({ alter: true });
      
      app.listen(3000, function() {
          console.log("Listening to port 3000");
      });
    } catch (error) {
      console.error('Falha ao inicializar:', error);
      process.exit(1);
    }
  })();
}

// Documentação Swagger
app.use('/api-docs', serve);
app.get('/api-docs', setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
  },
}));

// Middleware de tratamento de urls não encontradas
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
  });
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});