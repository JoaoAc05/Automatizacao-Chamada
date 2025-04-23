import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { turmaDisciplinasController } from "../src/Controller/TurmaDisciplinasController.js";

const TurmaDisciplinasRouter = express.Router();
const TurmaDisciplinasController = new turmaDisciplinasController();

/**
 * @swagger
 * tags:
 *   name: TurmaDisciplinas
 *   description: Gerenciamento de vínculos entre turmas e disciplinas
 */

/**
 * @swagger
 * /turma/disciplinas/{id_turma}:
 *   get:
 *     summary: Retorna os vínculos de uma turma específica
 *     tags: [TurmaDisciplinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_turma
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Lista de disciplinas da turma retornada com sucesso.
 *       400:
 *         description: ID não informado ou inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Nenhum vínculo encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
TurmaDisciplinasRouter.get('/:id_turma', auth, permissao([2]), TurmaDisciplinasController.getId); // ID Turma

/**
 * @swagger
 * /turma/disciplinas/:
 *   get:
 *     summary: Lista todos os vínculos de disciplinas em turmas
 *     tags: [TurmaDisciplinas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vínculos retornada com sucesso.
 *       204:
 *         description: Nenhum vínculo encontrado.
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       500:
 *         description: Erro interno do servidor.
 */
TurmaDisciplinasRouter.get('/', auth, permissao([2]), TurmaDisciplinasController.getAll);

/**
 * @swagger
 * /turma/disciplinas/:
 *   post:
 *     summary: Cadastra um novo vínculo de disciplina em uma turma
 *     tags: [TurmaDisciplinas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_turma
 *               - id_disciplina
 *               - id_semestre
 *             properties:
 *               id_turma:
 *                 type: integer
 *               id_disciplina:
 *                 type: integer
 *               id_semestre:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Vínculo criado com sucesso.
 *       400:
 *         description: Dados inválidos ou vínculo já existente.
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Turma, disciplina ou semestre não encontrados.
 *       500:
 *         description: Erro interno do servidor.
 */
TurmaDisciplinasRouter.post('/', auth, permissao([2]), TurmaDisciplinasController.cadastro); 

/**
 * @swagger
 * /turma/disciplinas/:
 *   put:
 *     summary: Altera um vínculo de disciplina em turma
 *     tags: [TurmaDisciplinas]
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
 *               id_turma:
 *                 type: integer
 *               id_disciplina:
 *                 type: integer
 *               id_semestre:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Vínculo alterado com sucesso.
 *       400:
 *         description: Nenhum dado informado para alteração.
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Vínculo não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
TurmaDisciplinasRouter.put('/', auth, permissao([2]), TurmaDisciplinasController.alterar); 

/**
 * @swagger
 * /turma/disciplinas/:
 *   delete:
 *     summary: Remove um ou mais vínculos de disciplina em turma
 *     tags: [TurmaDisciplinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_disciplina
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID da disciplina
 *       - in: query
 *         name: id_turma
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID da turma
 *       - in: query
 *         name: id_vinculo
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID do vínculo (turmaDisciplinas.id)
 *     responses:
 *       200:
 *         description: Vínculo(s) removido(s) com sucesso.
 *       400:
 *         description: Nenhum parâmetro informado.
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Vínculo(s) não encontrado(s).
 *       500:
 *         description: Erro interno do servidor.
 */
TurmaDisciplinasRouter.delete('/', auth, permissao([2]), TurmaDisciplinasController.deletar); // ID Disciplina

export { TurmaDisciplinasRouter };