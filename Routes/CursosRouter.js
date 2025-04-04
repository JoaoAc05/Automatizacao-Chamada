import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { cursosController } from "../src/Controller/CursosController.js";

const CursosRouter = express.Router();
const CursosController = new cursosController();

CursosRouter.get('/', auth, permissao([2]), CursosController.getAll);
CursosRouter.get('/:id', auth, permissao([2]), CursosController.getId);
CursosRouter.post('/', auth, permissao([2]), CursosController.cadastro); 
CursosRouter.put('/', auth, permissao([2]), CursosController.alterar); 
CursosRouter.delete('/:id', auth, permissao([2]), CursosController.deletar); 

export { CursosRouter };