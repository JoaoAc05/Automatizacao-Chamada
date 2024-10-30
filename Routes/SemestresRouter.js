import express from "express";
import auth from "../middleware/auth.js";
import { semestresController } from "../src/Controller/SemestresController.js";

const SemestresRouter = express.Router();
const SemestresController = new semestresController();

SemestresRouter.get('/', auth,  SemestresController.getAll); 
SemestresRouter.get('/:id', auth, SemestresController.getId); 
SemestresRouter.post('/', auth, SemestresController.cadastro); 
SemestresRouter.put('/', auth, SemestresController.alterar); 
SemestresRouter.delete('/:id', auth, SemestresController.deletar);

export { SemestresRouter };