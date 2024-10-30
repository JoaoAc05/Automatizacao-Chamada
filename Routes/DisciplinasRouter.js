import express from "express";
import auth from "../middleware/auth.js";
import { disciplinasController } from "../src/Controller/DisciplinasController.js";

const DisciplinasRouter = express.Router();
const DisciplinasController = new disciplinasController();

DisciplinasRouter.get('/', auth, DisciplinasController.getAll);
DisciplinasRouter.get('/:id', auth, DisciplinasController.getId);
DisciplinasRouter.post('/', auth, DisciplinasController.cadastro); 
DisciplinasRouter.put('/', auth, DisciplinasController.alterar); 
DisciplinasRouter.delete('/:id', auth, DisciplinasController.deletar); 

export { DisciplinasRouter };