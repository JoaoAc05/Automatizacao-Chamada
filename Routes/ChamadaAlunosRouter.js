import express from "express";
import { chamadaAlunosController } from "../src/Controller/ChamadaAlunosController.js";

const ChamadaAlunosRouter = express.Router();
const ChamadaAlunosController = new chamadaAlunosController();

ChamadaAlunosRouter.get('/alunos', ChamadaAlunosController.getAll);
ChamadaAlunosRouter.get('/:id_chamada/alunos', ChamadaAlunosController.getId); // Get pelo ID da chamada
ChamadaAlunosRouter.post('/alunos', ChamadaAlunosController.presenca); 
ChamadaAlunosRouter.put('/alunos', ChamadaAlunosController.alterar); 
ChamadaAlunosRouter.delete('/:id_chamada/alunos/:id_aluno', ChamadaAlunosController.deletar); // Delete pelo ID do aluno

export { ChamadaAlunosRouter };