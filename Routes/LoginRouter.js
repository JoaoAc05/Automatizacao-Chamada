import express from "express";
import { loginController } from "../src/Controller/LoginController.js";

const LoginRouter = express.Router();
const LoginController = new loginController();

//Rotas Usuário (/login)
LoginRouter.post('/app', LoginController.app);
LoginRouter.post('/dash', LoginController.dash);


export { LoginRouter };