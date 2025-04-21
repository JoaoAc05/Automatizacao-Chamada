import express from "express";
import index from "../Routes/index.js";
import cors from "cors";

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger');

const app = express();

app.use(cors());

app.use(express.json());


// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Rotas
app.use('/', index);

export default app ;