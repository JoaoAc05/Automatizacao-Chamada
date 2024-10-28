import express from "express";
import { turmaDisciplinasController } from "../src/Controller/TurmaDisciplinasController.js";

const TurmaDisciplinasRouter = express.Router();
const TurmaDisciplinasController = new turmaDisciplinasController();

TurmaDisciplinasRouter.get('/', TurmaDisciplinasController.getAll); 
TurmaDisciplinasRouter.get('/:id_turma', TurmaDisciplinasController.getId); // ID Turma
TurmaDisciplinasRouter.post('/', TurmaDisciplinasController.cadastro); 
TurmaDisciplinasRouter.put('/', TurmaDisciplinasController.alterar); 
TurmaDisciplinasRouter.delete('/:id_disciplina', TurmaDisciplinasController.deletar); // ID Disciplina

export { TurmaDisciplinasRouter };