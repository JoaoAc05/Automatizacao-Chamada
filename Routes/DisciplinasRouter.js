import express from "express";
import { disciplinasController } from "../src/Controller/DisciplinasController.js";

const DisciplinasRouter = express.Router();
const DisciplinasController = new disciplinasController();

DisciplinasRouter.get('/', DisciplinasController.getAll);
DisciplinasRouter.get('/:id', DisciplinasController.getId);
DisciplinasRouter.post('/', DisciplinasController.cadastro); 
DisciplinasRouter.put('/', DisciplinasController.alterar); 
DisciplinasRouter.delete('/:id', DisciplinasController.deletar); 

export { DisciplinasRouter };