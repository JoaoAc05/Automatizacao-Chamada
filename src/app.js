import express from "express";
import index from "../Routes/index.js";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../docs/swagger.js";

const app = express();

app.use(cors());

app.use(express.json());

// Servir JSON diretamente
app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  // Swagger UI apontando para o JSON
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Rotas
app.use('/', index);

export default app ;