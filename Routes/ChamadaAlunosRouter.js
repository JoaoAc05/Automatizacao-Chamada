import express from "express";
import auth from "../middleware/auth.js";
import { chamadaAlunosController } from "../src/Controller/ChamadaAlunosController.js";

const ChamadaAlunosRouter = express.Router();
const ChamadaAlunosController = new chamadaAlunosController();

ChamadaAlunosRouter.get('/alunos', auth, ChamadaAlunosController.getAll);
ChamadaAlunosRouter.get('/:id_chamada/alunos', auth, ChamadaAlunosController.getId); // Get pelo ID da chamada
ChamadaAlunosRouter.post('/alunos', auth, ChamadaAlunosController.presenca); 
ChamadaAlunosRouter.put('/alunos', auth, ChamadaAlunosController.alterar); 
ChamadaAlunosRouter.delete('/:id_chamada/alunos/:id_aluno', auth, ChamadaAlunosController.deletar); // Delete pelo ID do aluno

export { ChamadaAlunosRouter };