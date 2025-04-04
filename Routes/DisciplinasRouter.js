import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { disciplinasController } from "../src/Controller/DisciplinasController.js";

const DisciplinasRouter = express.Router();
const DisciplinasController = new disciplinasController();

DisciplinasRouter.get('/', auth, permissao([2]), DisciplinasController.getAll);
DisciplinasRouter.get('/:id', auth, permissao([2]), DisciplinasController.getId);
DisciplinasRouter.post('/', auth, permissao([2]), DisciplinasController.cadastro); 
DisciplinasRouter.put('/', auth, permissao([2]), DisciplinasController.alterar); 
DisciplinasRouter.delete('/:id', auth, permissao([2]), DisciplinasController.deletar); 

export { DisciplinasRouter };