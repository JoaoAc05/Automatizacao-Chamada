import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { chamadasController } from "../src/Controller/ChamadasController.js";

const ChamadasRouter = express.Router();
const ChamadasController = new chamadasController();

ChamadasRouter.get('/professor/', auth, permissao([1, 2]), ChamadasController.chamadaProfessor) // [VER CHAMADAS DO PROFESSOR NO SEMESTRE]
ChamadasRouter.get('/:id', auth, permissao([1, 2]), ChamadasController.getId); // [VER CHAMADAS ESPECÍFICA]
ChamadasRouter.get('/', auth, permissao([2]), ChamadasController.getAll); // [VER TODAS CHAMADAS]
ChamadasRouter.post('/', auth, permissao([1, 2]), ChamadasController.cadastro); // [PROFESSOR INICIA CHAMADA]
ChamadasRouter.put('/finalizar', auth, permissao([1, 2]), ChamadasController.finalizarChamada); // [PROFESSOR FINALIZA CHAMADA]
ChamadasRouter.put('/', auth, permissao([2]), ChamadasController.alterar); // [ADMIN ALTERA CHAMADA]
ChamadasRouter.delete('/:id', auth, permissao([2]), ChamadasController.deletar); // [ADMIN EXCLUI CHAMADA]

export { ChamadasRouter };