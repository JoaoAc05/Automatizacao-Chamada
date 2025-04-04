import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { turmasController } from "../src/Controller/TurmasController.js";

const TurmasRouter = express.Router();
const TurmasController = new turmasController();

TurmasRouter.get('/:id', auth, permissao([2]), TurmasController.getId); 
TurmasRouter.get('/', auth, permissao([2]), TurmasController.getAll); 
TurmasRouter.post('/', auth, permissao([2]), TurmasController.cadastro); 
TurmasRouter.put('/', auth, permissao([2]), TurmasController.alterar); 
TurmasRouter.delete('/:id', auth, permissao([2]), TurmasController.deletar);

export { TurmasRouter };