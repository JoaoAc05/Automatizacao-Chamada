import express from "express";
import { turmasController } from "../src/Controller/TurmasController.js";

const TurmasRouter = express.Router();
const TurmasController = new turmasController();

TurmasRouter.get('/', TurmasController.getAll); 
TurmasRouter.get('/:id', TurmasController.getId); 
TurmasRouter.post('/', TurmasController.cadastro); 
TurmasRouter.put('/', TurmasController.alterar); 
TurmasRouter.delete('/:id', TurmasController.deletar);

export { TurmasRouter };