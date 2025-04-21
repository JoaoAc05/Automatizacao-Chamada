import express from "express";
import index from "../Routes/index.js";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../docs/swagger.js";

const app = express();

app.use(cors());

app.use(express.json());


// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Rotas
app.use('/', index);

export default app ;