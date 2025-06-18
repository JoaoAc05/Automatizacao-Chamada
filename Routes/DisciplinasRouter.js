import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { disciplinasController } from "../src/Controller/DisciplinasController.js";

const DisciplinasRouter = express.Router();
const DisciplinasController = new disciplinasController();

/**
 * @swagger
 * tags:
 *   name: Disciplinas
 *   description: Gerenciamento de disciplinas
 */

/**
 * @swagger
 * /disciplinas/{id}:
 *   get:
 *     summary: Buscar disciplina por ID
 *     tags: [Disciplinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID da disciplina
 *       - in: query
 *         name: id_curso
 *         schema:
 *           type: integer
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Disciplina encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 descricao:
 *                   type: string
 *                 id_curso:
 *                   type: integer
 *                 carga_horario:
 *                   type: integer
 *                 status:
 *                   type: integer
 *       400:
 *         description: ID não informado ou inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Disciplina não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
DisciplinasRouter.get('/', auth, permissao([2]), DisciplinasController.getId);

/**
 * @swagger
 * /disciplinas:
 *   get:
 *     summary: Listar todas as disciplinas
 *     tags: [Disciplinas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de disciplinas
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
 *                   id_curso:
 *                     type: integer
 *                   carga_horario:
 *                     type: integer
 *                   status:
 *                     type: integer
 *                   Curso:
 *                     type: object
 *                     properties:
 *                       descricao:
 *                         type: string
 *       204:
 *         description: Requisição bem-sucedida, mas sem conteúdo
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       500:
 *         description: Erro interno do servidor
 */
DisciplinasRouter.get('/', auth, permissao([2]), DisciplinasController.getAll);

/**
 * @swagger
 * /disciplinas:
 *   post:
 *     summary: Cadastrar nova disciplina
 *     tags: [Disciplinas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - id_curso
 *               - carga_horario
 *             properties:
 *               nome:
 *                 type: string
 *               carga_horario:
 *                 type: integer
 *               id_curso:
 *                 type: integer
 *               status:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Disciplina cadastrada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       500:
 *         description: Erro interno do servidor
 */
DisciplinasRouter.post('/', auth, permissao([2]), DisciplinasController.cadastro); 

/**
 * @swagger
 * /disciplinas:
 *   put:
 *     summary: Atualizar dados da disciplina
 *     tags: [Disciplinas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *               nome:
 *                 type: string
 *               carga_horario:
 *                 type: integer
 *               id_curso:
 *                 type: integer
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Disciplina atualizada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Disciplina não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
DisciplinasRouter.put('/', auth, permissao([2]), DisciplinasController.alterar); 

/**
 * @swagger
 * /disciplinas/{id}:
 *   delete:
 *     summary: Deletar disciplina por ID
 *     tags: [Disciplinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina
 *     responses:
 *       200:
 *         description: Disciplina deletada com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Disciplina não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
DisciplinasRouter.delete('/:id', auth, permissao([2]), DisciplinasController.deletar); 

export { DisciplinasRouter };