import express from "express";
import auth from "../middleware/auth.js";
import { chamadasController } from "../src/Controller/ChamadasController.js";

const ChamadasRouter = express.Router();
const ChamadasController = new chamadasController();

ChamadasRouter.get('/', auth, ChamadasController.getAll);
ChamadasRouter.get('/:id', auth, ChamadasController.getId);
ChamadasRouter.post('/', auth, ChamadasController.cadastro); 
ChamadasRouter.put('/', auth, ChamadasController.alterar); 
ChamadasRouter.delete('/:id', auth, ChamadasController.deletar); 
ChamadasRouter.post('/finalizar', auth, ChamadasController.finalizarChamada);
ChamadasRouter.get('/professor/:id_professor', auth, ChamadasController.chamadaProfessor)

export { ChamadasRouter };