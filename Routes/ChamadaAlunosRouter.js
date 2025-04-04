import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { chamadaAlunosController } from "../src/Controller/ChamadaAlunosController.js";

const ChamadaAlunosRouter = express.Router();
const ChamadaAlunosController = new chamadaAlunosController();

ChamadaAlunosRouter.get('/alunos', auth, permissao([1, 2]), ChamadaAlunosController.getAll);
ChamadaAlunosRouter.get('/:id_chamada/alunos', auth, permissao([1, 2]), ChamadaAlunosController.getId); // Get pelo ID da chamada
ChamadaAlunosRouter.post('/alunos', auth, ChamadaAlunosController.presenca); // PRESENÇA REGISTRADA PELO ALUNO
ChamadaAlunosRouter.put('/alunos', auth, permissao([2]), ChamadaAlunosController.alterar); 
ChamadaAlunosRouter.put('/:id_chamada/alunos/:id_aluno', auth, permissao([1, 2]), ChamadaAlunosController.deletar); // Delete pelo ID do aluno

export { ChamadaAlunosRouter };