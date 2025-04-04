import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { chamadasController } from "../src/Controller/ChamadasController.js";

const ChamadasRouter = express.Router();
const ChamadasController = new chamadasController();

ChamadasRouter.get('/', auth, permissao([1, 2]), ChamadasController.getAll);
ChamadasRouter.get('/:id', auth, permissao([1, 2]), ChamadasController.getId);
ChamadasRouter.post('/', auth, ChamadasController.cadastro); 
ChamadasRouter.put('/', auth, permissao([1, 2]), ChamadasController.alterar); 
ChamadasRouter.delete('/:id', auth, permissao([2]), ChamadasController.deletar); 
ChamadasRouter.put('/finalizar', auth, permissao([1, 2]), ChamadasController.finalizarChamada);
ChamadasRouter.get('/professor/:id_professor', permissao([1, 2]), auth, ChamadasController.chamadaProfessor)

export { ChamadasRouter };