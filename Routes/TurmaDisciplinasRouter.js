import express from "express";
import auth from "../middleware/auth.js";
import { turmaDisciplinasController } from "../src/Controller/TurmaDisciplinasController.js";

const TurmaDisciplinasRouter = express.Router();
const TurmaDisciplinasController = new turmaDisciplinasController();

TurmaDisciplinasRouter.get('/', auth, TurmaDisciplinasController.getAll); 
TurmaDisciplinasRouter.get('/:id_turma', auth, TurmaDisciplinasController.getId); // ID Turma
TurmaDisciplinasRouter.post('/', auth, TurmaDisciplinasController.cadastro); 
TurmaDisciplinasRouter.put('/', auth, TurmaDisciplinasController.alterar); 
TurmaDisciplinasRouter.delete('/:id_disciplina', auth, TurmaDisciplinasController.deletar); // ID Disciplina

export { TurmaDisciplinasRouter };