import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { turmaAlunosController } from "../src/Controller/TurmaAlunosController.js";

const TurmaAlunosRouter = express.Router();
const TurmaAlunosController = new turmaAlunosController();

TurmaAlunosRouter.get('/:id_turma', auth, permissao([2]), TurmaAlunosController.getId); // ID Turma
TurmaAlunosRouter.get('/', auth, permissao([2]), TurmaAlunosController.getAll); 
TurmaAlunosRouter.post('/', auth, permissao([2]), TurmaAlunosController.cadastro); 
TurmaAlunosRouter.put('/', auth, permissao([2]), TurmaAlunosController.alterar); 
TurmaAlunosRouter.delete('/', auth, permissao([2]), TurmaAlunosController.deletar); // ID Aluno

export { TurmaAlunosRouter };