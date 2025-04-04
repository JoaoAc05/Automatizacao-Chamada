import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { turmaDisciplinasController } from "../src/Controller/TurmaDisciplinasController.js";

const TurmaDisciplinasRouter = express.Router();
const TurmaDisciplinasController = new turmaDisciplinasController();

TurmaDisciplinasRouter.get('/:id_turma', auth, permissao([2]), TurmaDisciplinasController.getId); // ID Turma
TurmaDisciplinasRouter.get('/', auth, permissao([2]), TurmaDisciplinasController.getAll); 
TurmaDisciplinasRouter.post('/', auth, permissao([2]), TurmaDisciplinasController.cadastro); 
TurmaDisciplinasRouter.put('/', auth, permissao([2]), TurmaDisciplinasController.alterar); 
TurmaDisciplinasRouter.delete('/:id_disciplina', auth, permissao([2]), TurmaDisciplinasController.deletar); // ID Disciplina

export { TurmaDisciplinasRouter };