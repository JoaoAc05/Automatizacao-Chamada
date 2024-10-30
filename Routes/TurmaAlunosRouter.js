import express from "express";
import auth from "../middleware/auth.js";
import { turmaAlunosController } from "../src/Controller/TurmaAlunosController.js";

const TurmaAlunosRouter = express.Router();
const TurmaAlunosController = new turmaAlunosController();

TurmaAlunosRouter.get('/', auth, TurmaAlunosController.getAll); 
TurmaAlunosRouter.get('/:id_turma', auth, TurmaAlunosController.getId); // ID Turma
TurmaAlunosRouter.post('/', auth, TurmaAlunosController.cadastro); 
TurmaAlunosRouter.put('/', auth, TurmaAlunosController.alterar); 
TurmaAlunosRouter.delete('/:id_aluno', auth, TurmaAlunosController.deletar); // ID Aluno

export { TurmaAlunosRouter };