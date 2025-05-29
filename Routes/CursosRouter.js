import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { cursosController } from "../src/Controller/CursosController.js";

const CursosRouter = express.Router();
const CursosController = new cursosController();

/**
 * @swagger
 * tags:
 *   name: Cursos
 *   description: Gerenciamento de cursos
 */

/**
 * @swagger
 * /cursos/{id}:
 *   get:
 *     summary: Buscar curso por ID
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Curso encontrado
 *       400:
 *         description: ID não informado ou inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Curso não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
CursosRouter.get('/:id', auth, permissao([2]), CursosController.getId);

/**
 * @swagger
 * /cursos:
 *   get:
 *     summary: Listar todos os cursos
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cursos retornada com sucesso
 *       204:
 *         description: Requisição bem-sucedida, mas sem conteúdo
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       500:
 *         description: Erro interno do servidor
 */
CursosRouter.get('/', auth, permissao([2]), CursosController.getAll);

/**
 * @swagger
 * /cursos:
 *   post:
 *     summary: Cadastrar um novo curso
 *     tags: [Cursos]
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
 *               - qtd_semestre
 *             properties:
 *               descricao:
 *                 type: string
 *               qtd_semestres:
 *                 type: integer
 *                 example: De 4 a 12 semestres de duração
 *               status:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Curso cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       500:
 *         description: Erro interno do servidor
 */
CursosRouter.post('/', auth, permissao([2]), CursosController.cadastro); 

/**
 * @swagger
 * /cursos:
 *   put:
 *     summary: Alterar um curso existente
 *     tags: [Cursos]
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
 *               qtd_semestres:
 *                 type: integer
 *                 example: De 4 a 12 semestres de duração
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Curso alterado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Curso não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
CursosRouter.put('/', auth, permissao([2]), CursosController.alterar);

/**
 * @swagger
 * /cursos/{id}:
 *   delete:
 *     summary: Deletar curso por ID
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Curso deletado com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Curso não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
CursosRouter.delete('/:id', auth, permissao([2]), CursosController.deletar); 

export { CursosRouter };