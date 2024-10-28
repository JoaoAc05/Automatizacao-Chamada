import express from "express";
import { usuariosController } from "../src/Controller/UsuariosController.js";

const UsuariosRouter = express.Router();
const UsuariosController = new usuariosController();

//Rotas Usuário (/Usuario)
UsuariosRouter.get('/', UsuariosController.getAll); 
UsuariosRouter.get('/:id', UsuariosController.getId); 
UsuariosRouter.post('/', UsuariosController.cadastro); 
UsuariosRouter.put('/', UsuariosController.alterar); 
UsuariosRouter.delete('/:id', UsuariosController.deletar);
UsuariosRouter.post('/login', UsuariosController.loginAluno);
UsuariosRouter.post('/loginWeb', UsuariosController.loginWeb);

export { UsuariosRouter };