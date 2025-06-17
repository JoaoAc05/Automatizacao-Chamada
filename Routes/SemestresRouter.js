import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { semestresController } from "../src/Controller/SemestresController.js";

const SemestresRouter = express.Router();
const SemestresController = new semestresController();

/**
 * @swagger
 * tags:
 *   name: Semestres
 *   description: Gerenciamento de semestres
 */

/**
 * @swagger
 * /semestres/padrao/:
 *   get:
 *     summary: Buscar semestre padrão
 *     tags: [Semestres]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Semestre encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                   example: "2024/2"
 *                 data_inicio:
 *                   type: string
 *                   format: date-time
 *                 data_final:
 *                   type: string
 *                   format: date-time
 *                 padrao:
 *                   type: integer
 *                   description: 0 - padrão, 1 - não
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Semestre não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
SemestresRouter.get('/padrao/', auth, permissao([1, 2]), SemestresController.getPadrao); 

/**
 * @swagger
 * /semestres/{id}:
 *   get:
 *     summary: Buscar semestre por ID
 *     tags: [Semestres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do semestre
 *     responses:
 *       200:
 *         description: Semestre encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                   example: "2024/2"
 *                 data_inicio:
 *                   type: string
 *                   format: date-time
 *                 data_final:
 *                   type: string
 *                   format: date-time
 *                 padrao:
 *                   type: integer
 *                   description: 0 - padrão, 1 - não
 *       400:
 *         description: ID não informado ou inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Semestre não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
SemestresRouter.get('/:id', auth, permissao([2]), SemestresController.getId); 

/**
 * @swagger
 * /semestres:
 *   get:
 *     summary: Listar todos os semestres
 *     tags: [Semestres]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de semestres retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   descricao:
 *                     type: string
 *                     example: "2024/2"
 *                   data_inicio:
 *                     type: string
 *                     format: date-time
 *                   data_final:
 *                     type: string
 *                     format: date-time
 *                   padrao:
 *                     type: integer
 *                     description: 0 - padrão, 1 - não
 *       204:
 *         description: Requisição bem-sucedida, mas sem conteúdo
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       500:
 *         description: Erro interno do servidor
 */
SemestresRouter.get('/', auth, permissao([2]),  SemestresController.getAll); 

/**
 * @swagger
 * /semestres:
 *   post:
 *     summary: Cadastrar um novo semestre
 *     tags: [Semestres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descricao
 *               - data_inicio
 *               - data_final
 *             properties:
 *               descricao:
 *                 type: string
 *                 example: "2025/1"
 *               data_inicio:
 *                 type: string
 *                 format: date
 *               data_final:
 *                 type: string
 *                 format: date
 *               padrao:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: Define se o semestre será o padrão atual.
 *                 example: 0
 *     responses:
 *       201:
 *         description: Semestre cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       500:
 *         description: Erro interno do servidor
 */
SemestresRouter.post('/', auth, permissao([2]), SemestresController.cadastro);

/**
 * @swagger
 * /semestres:
 *   put:
 *     summary: Alterar um semestre existente
 *     tags: [Semestres]
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
 *               descricao:
 *                 type: string
 *                 example: "2025/1"
 *               data_inicio:
 *                 type: string
 *                 format: date
 *               data_final:
 *                 type: string
 *                 format: date
 *               padrao:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: Define se o semestre será o padrão atual.
 *                 example: 0
 *     responses:
 *       200:
 *         description: Semestre alterado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Semestre não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
SemestresRouter.put('/', auth, permissao([2]), SemestresController.alterar); 

/**
 * @swagger
 * /semestres/{id}:
 *   delete:
 *     summary: Deletar semestre por ID
 *     tags: [Semestres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do semestre
 *     responses:
 *       200:
 *         description: Semestre deletado com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Semestre não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
SemestresRouter.delete('/:id', auth, permissao([2]), SemestresController.deletar);

export { SemestresRouter };