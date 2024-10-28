import express from "express";
import { turmaAlunosController } from "../src/Controller/TurmaAlunosController.js";

const TurmaAlunosRouter = express.Router();
const TurmaAlunosController = new turmaAlunosController();

TurmaAlunosRouter.get('/', TurmaAlunosController.getAll); 
TurmaAlunosRouter.get('/:id_turma', TurmaAlunosController.getId); // ID Turma
TurmaAlunosRouter.post('/', TurmaAlunosController.cadastro); 
TurmaAlunosRouter.put('/', TurmaAlunosController.alterar); 
TurmaAlunosRouter.delete('/:id_aluno', TurmaAlunosController.deletar); // ID Aluno

export { TurmaAlunosRouter };