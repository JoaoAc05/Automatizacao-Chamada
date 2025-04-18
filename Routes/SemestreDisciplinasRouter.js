import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { semestreDisciplinasController } from "../src/Controller/SemestreDisciplinasController.js";

const SemestreDisciplinasRouter = express.Router();
const SemestreDisciplinasController = new semestreDisciplinasController();

SemestreDisciplinasRouter.get('/professor/', auth, permissao([1, 2]), SemestreDisciplinasController.disciplinaProfessor);
SemestreDisciplinasRouter.get('/:id_semestre/disciplinas',  auth, permissao([2]), SemestreDisciplinasController.getId); // ID DO SEMESTRE DO ANO
SemestreDisciplinasRouter.get('/disciplinas', auth, permissao([2]), SemestreDisciplinasController.getAll); 
SemestreDisciplinasRouter.post('/disciplinas', auth, permissao([2]), SemestreDisciplinasController.cadastro); 
SemestreDisciplinasRouter.put('/disciplinas', auth, permissao([2]), SemestreDisciplinasController.alterar); 
SemestreDisciplinasRouter.delete('/disciplinas/:id', auth, permissao([2]), SemestreDisciplinasController.deletar); // ID PROPRIO

export { SemestreDisciplinasRouter };