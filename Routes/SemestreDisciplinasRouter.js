import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { semestreDisciplinasController } from "../src/Controller/SemestreDisciplinasController.js";

const SemestreDisciplinasRouter = express.Router();
const SemestreDisciplinasController = new semestreDisciplinasController();

SemestreDisciplinasRouter.get('/disciplinas', permissao([2]), auth, SemestreDisciplinasController.getAll); 
SemestreDisciplinasRouter.get('/:id_semestre/disciplinas', permissao([2]), auth, SemestreDisciplinasController.getId); // ID DO SEMESTRE DO ANO
SemestreDisciplinasRouter.post('/disciplinas', auth, permissao([2]), SemestreDisciplinasController.cadastro); 
SemestreDisciplinasRouter.put('/disciplinas', auth, permissao([2]), SemestreDisciplinasController.alterar); 
SemestreDisciplinasRouter.delete('/disciplinas/:id', auth, permissao([2]), SemestreDisciplinasController.deletar); // ID PROPRIO
SemestreDisciplinasRouter.get('/professor/:id_professor', auth, permissao([1, 2]), SemestreDisciplinasController.disciplinaProfessor);

export { SemestreDisciplinasRouter };