import express from "express";
import index from "../Routes/index.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

//Rotas
app.use('/', index);

export default app ;