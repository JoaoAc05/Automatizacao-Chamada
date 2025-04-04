import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { usuariosController } from "../src/Controller/UsuariosController.js";

const UsuariosRouter = express.Router();
const UsuariosController = new usuariosController();

//Rotas Usuário (/Usuario)
UsuariosRouter.get('/:id', auth, permissao([1, 2]), UsuariosController.getId); 
UsuariosRouter.get('/', auth, permissao([2]), UsuariosController.getAll); 
UsuariosRouter.post('/', auth, permissao([2]), UsuariosController.cadastro); 
UsuariosRouter.post('/valida', UsuariosController.validacao); // Rota para validacao do cadastro do aluno
UsuariosRouter.put('/', auth, permissao([2]), UsuariosController.alterar); 
UsuariosRouter.delete('/:id', auth, permissao([2]), UsuariosController.deletar);



export { UsuariosRouter };