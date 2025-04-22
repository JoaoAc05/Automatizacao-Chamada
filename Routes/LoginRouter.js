import express from "express";
import { loginController } from "../src/Controller/LoginController.js";

const LoginRouter = express.Router();
const LoginController = new loginController();

/**
 * @swagger
 * tags:
 *   name: Login
 *   description: Autenticação de usuários
 */

/**
 * @swagger
 * /login/app:
 *   post:
 *     summary: Login para o aplicativo (alunos)
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *               - imei
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               senha:
 *                 type: string
 *                 example: senha123
 *               imei:
 *                 type: string
 *                 example: "SP1A.200812.010"
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna token JWT
 *       400:
 *         descripton: Dados enviados inválidos ou faltando
 *       401:
 *         description: Credenciais inválidas
 *       403:
 *         description: Usuário não é um aluno
 *       404: 
 *         description: Nenhum usuário encontrado com este email
 *       500:
 *         description: Erro interno do servidor
 */
LoginRouter.post('/app', LoginController.app);

/**
 * @swagger
 * /login/dash:
 *   post:
 *     summary: Login para o painel administrativo (professores/administradores)
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@painel.com
 *               senha:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna token JWT
 *       401:
 *         description: Credenciais inválidas
 *       404:
 *         description: Nenhum usuário encontrado com este email
 *       500:
 *         description: Erro interno do servidor
 */
LoginRouter.post('/dash', LoginController.dash);


export { LoginRouter };