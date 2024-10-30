import express from "express";
import auth from "../middleware/auth.js";
import { turmasController } from "../src/Controller/TurmasController.js";

const TurmasRouter = express.Router();
const TurmasController = new turmasController();

TurmasRouter.get('/', auth, TurmasController.getAll); 
TurmasRouter.get('/:id', auth, TurmasController.getId); 
TurmasRouter.post('/', auth, TurmasController.cadastro); 
TurmasRouter.put('/', auth, TurmasController.alterar); 
TurmasRouter.delete('/:id', auth, TurmasController.deletar);

export { TurmasRouter };