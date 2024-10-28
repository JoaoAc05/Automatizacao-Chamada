import express from "express";
import { chamadasController } from "../src/Controller/ChamadasController.js";

const ChamadasRouter = express.Router();
const ChamadasController = new chamadasController();

ChamadasRouter.get('/', ChamadasController.getAll);
ChamadasRouter.get('/:id', ChamadasController.getId);
ChamadasRouter.post('/', ChamadasController.cadastro); 
ChamadasRouter.put('/', ChamadasController.alterar); 
ChamadasRouter.delete('/:id', ChamadasController.deletar); 
ChamadasRouter.post('/finalizar', ChamadasController.finalizarChamada);

export { ChamadasRouter };