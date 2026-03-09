import express from "express";
import pkg from "body-parser";
import router from "./routes/orderRoutes.js";
import db from "./config/database.js"

export const app = express();
const { json, urlencoded } = pkg;

app.use(json());
app.use(urlencoded({extended: true}));
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