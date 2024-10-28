import express from "express";
import { semestreDisciplinasController } from "../src/Controller/SemestreDisciplinasController.js";

const SemestreDisciplinasRouter = express.Router();
const SemestreDisciplinasController = new semestreDisciplinasController();

SemestreDisciplinasRouter.get('/disciplinas', SemestreDisciplinasController.getAll); 
SemestreDisciplinasRouter.get('/:id_semestre/disciplinas', SemestreDisciplinasController.getId); // ID DO SEMESTRE DO ANO
SemestreDisciplinasRouter.post('/disciplinas', SemestreDisciplinasController.cadastro); 
SemestreDisciplinasRouter.put('/disciplinas', SemestreDisciplinasController.alterar); 
SemestreDisciplinasRouter.delete('/disciplinas/:id', SemestreDisciplinasController.deletar); // ID PROPRIO

export { SemestreDisciplinasRouter };