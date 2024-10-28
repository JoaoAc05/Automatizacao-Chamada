import express from "express";
import { alunoController } from "../src/Controller/AlunoController.js";

const AlunoRouter = express.Router();
const AlunoController = new alunoController();

//Rotas Usuário (/aluno)
AlunoRouter.get('/', AlunoController.getAll); // Select *
AlunoRouter.get('/:id', AlunoController.getId); //Select * where id =
AlunoRouter.post('/', AlunoController.cadastro); //Insert
AlunoRouter.put('/:id', AlunoController.alterar); //Alter
AlunoRouter.delete('/:id', AlunoController.deletar); //Delete

export { AlunoRouter };