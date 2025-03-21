import express from "express";
import auth from "../middleware/auth.js";
import { usuariosController } from "../src/Controller/UsuariosController.js";

const UsuariosRouter = express.Router();
const UsuariosController = new usuariosController();

//Rotas Usuário (/Usuario)
UsuariosRouter.get('/', auth, UsuariosController.getAll); 
UsuariosRouter.get('/:id', auth, UsuariosController.getId); 
UsuariosRouter.post('/', auth, UsuariosController.cadastro); 
UsuariosRouter.post('/valida', UsuariosController.validacao); // Rota para validacao do cadastro do aluno
UsuariosRouter.put('/', auth, UsuariosController.alterar); 
UsuariosRouter.delete('/:id', auth, UsuariosController.deletar);
// UsuariosRouter.post('/login', UsuariosController.loginAluno);
// UsuariosRouter.post('/loginWeb', UsuariosController.loginWeb);


export { UsuariosRouter };