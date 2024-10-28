import express from "express";
import { semestresController } from "../src/Controller/SemestresController.js";

const SemestresRouter = express.Router();
const SemestresController = new semestresController();

SemestresRouter.get('/', SemestresController.getAll); 
SemestresRouter.get('/:id', SemestresController.getId); 
SemestresRouter.post('/', SemestresController.cadastro); 
SemestresRouter.put('/', SemestresController.alterar); 
SemestresRouter.delete('/:id', SemestresController.deletar);

export { SemestresRouter };