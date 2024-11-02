import express from "express";
import auth from "../middleware/auth.js";
import { semestreDisciplinasController } from "../src/Controller/SemestreDisciplinasController.js";

const SemestreDisciplinasRouter = express.Router();
const SemestreDisciplinasController = new semestreDisciplinasController();

SemestreDisciplinasRouter.get('/disciplinas', auth, SemestreDisciplinasController.getAll); 
SemestreDisciplinasRouter.get('/:id_semestre/disciplinas', auth, SemestreDisciplinasController.getId); // ID DO SEMESTRE DO ANO
SemestreDisciplinasRouter.post('/disciplinas', auth, SemestreDisciplinasController.cadastro); 
SemestreDisciplinasRouter.put('/disciplinas', auth, SemestreDisciplinasController.alterar); 
SemestreDisciplinasRouter.delete('/disciplinas/:id', auth, SemestreDisciplinasController.deletar); // ID PROPRIO
SemestreDisciplinasRouter.get('/professor/:id_professor', auth, SemestreDisciplinasController.disciplinaProfessor); 

export { SemestreDisciplinasRouter };