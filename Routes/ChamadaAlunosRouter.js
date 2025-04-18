import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { chamadaAlunosController } from "../src/Controller/ChamadaAlunosController.js";

const ChamadaAlunosRouter = express.Router();
const ChamadaAlunosController = new chamadaAlunosController();

ChamadaAlunosRouter.get('/alunos/', auth, permissao([1, 2]), ChamadaAlunosController.getId); // Get pelo ID da chamada
ChamadaAlunosRouter.get('/alunos', auth, permissao([2]), ChamadaAlunosController.getAll);
ChamadaAlunosRouter.post('/alunos', auth, ChamadaAlunosController.presenca); // PRESENÇA REGISTRADA PELO ALUNO
ChamadaAlunosRouter.put('/:id_chamada/alunos/:id_aluno', auth, permissao([1, 2]), ChamadaAlunosController.deletar); // Delete pelo ID do aluno
ChamadaAlunosRouter.put('/alunos', auth, permissao([2]), ChamadaAlunosController.alterar); 

export { ChamadaAlunosRouter };