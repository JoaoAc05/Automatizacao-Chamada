import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { turmasController } from "../src/Controller/TurmasController.js";

const TurmasRouter = express.Router();
const TurmasController = new turmasController();

/**
 * @swagger
 * tags:
 *   name: Turmas
 *   description: Grenciamento de turmas
 */

/**
 * @swagger
 * /turmas/{id}:
 *   get:
 *     summary: Buscar turma por ID
 *     tags: [Turmas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Turma encontrada
 *       400:
 *         description: ID não informado ou inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
TurmasRouter.get('/:id', auth, permissao([2]), TurmasController.getId);

/**
 * @swagger
 * /turmas:
 *   get:
 *     summary: Listar todas as turmas
 *     tags: [Turmas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turmas retornada com sucesso
 *       204:
 *         description: Requisição bem-sucedida, mas sem conteúdo
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       500:
 *         description: Erro interno do servidor
 */
TurmasRouter.get('/', auth, permissao([2]), TurmasController.getAll); 

/**
 * @swagger
 * /turmas:
 *   post:
 *     summary: Cadastrar uma nova turma
 *     tags: [Turmas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - semestre_curso
 *               - id_curso
 *             properties:
 *               semestre_curso:
 *                 type: integer
 *                 description: Em qual semestre a turma se encontra (ex 5º Semestre, 6º Semestre ...)
 *                 example: 4
 *               id_curso:
 *                 type: integer
 *               status:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Turma cadastrada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Curso não encontrado
 *       409:
 *         description: Dado informado já está cadastrado
 *       500:
 *         description: Erro interno do servidor
 */
TurmasRouter.post('/', auth, permissao([2]), TurmasController.cadastro); 

/**
 * @swagger
 * /turmas:
 *   put:
 *     summary: Alterar uma turma
 *     tags: [Turmas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               semestre_curso:
 *                 type: integer
 *                 example: Em qual semestre a turma se encontra
 *               id_curso:
 *                 type: integer
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Turma alterada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Turma ou curso não encontrados
 *       500:
 *         description: Erro interno do servidor
 */
TurmasRouter.put('/', auth, permissao([2]), TurmasController.alterar); 

/**
 * @swagger
 * /turmas/{id}:
 *   delete:
 *     summary: Deletar turma por ID
 *     tags: [Turmas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Turma deletada com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
TurmasRouter.delete('/:id', auth, permissao([2]), TurmasController.deletar);

export { TurmasRouter };