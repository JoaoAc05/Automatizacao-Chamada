import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { semestresController } from "../src/Controller/SemestresController.js";

const SemestresRouter = express.Router();
const SemestresController = new semestresController();

SemestresRouter.get('/', auth, permissao([2]),  SemestresController.getAll); 
SemestresRouter.get('/:id', auth, permissao([2]), SemestresController.getId); 
SemestresRouter.post('/', auth, permissao([2]), SemestresController.cadastro); 
SemestresRouter.put('/', auth, permissao([2]), SemestresController.alterar); 
SemestresRouter.delete('/:id', auth, permissao([2]), SemestresController.deletar);

export { SemestresRouter };