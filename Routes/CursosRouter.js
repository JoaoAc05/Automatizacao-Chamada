import express from "express";
import auth from "../middleware/auth.js";
import { cursosController } from "../src/Controller/CursosController.js";

const CursosRouter = express.Router();
const CursosController = new cursosController();

CursosRouter.get('/', auth, CursosController.getAll);
CursosRouter.get('/:id', auth, CursosController.getId);
CursosRouter.post('/', auth, CursosController.cadastro); 
CursosRouter.put('/', auth, CursosController.alterar); 
CursosRouter.delete('/:id', auth, CursosController.deletar); 

export { CursosRouter };