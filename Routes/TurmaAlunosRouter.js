import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { turmaAlunosController } from "../src/Controller/TurmaAlunosController.js";

const TurmaAlunosRouter = express.Router();
const TurmaAlunosController = new turmaAlunosController();

/**
 * @swagger
 * tags:
 *   name: TurmaAlunos
 *   description: Gerenciamento de vínculos entre alunos e turmas
 */

/**
 * @swagger
 * /turma/alunos/{id_turma}:
 *   get:
 *     summary: Lista todos os alunos vinculados a uma turma
 *     tags: [TurmaAlunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_turma
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Lista de alunos vinculados à turma
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   id_aluno:
 *                     type: integer
 *                   id_turma:
 *                     type: integer
 *                   Usuario:
 *                     type: object
 *                     properties:
 *                       nome:
 *                         type: string
 *       400:
 *         description: ID não informado ou inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Nenhum vínculo encontrado
 *       500:
 *         description: Erro ao buscar vínculos
 */
TurmaAlunosRouter.get('/:id_turma', auth, permissao([2]), TurmaAlunosController.getId); // ID Turma

/**
 * @swagger
 * /turma/alunos:
 *   get:
 *     summary: Lista todos os vínculos entre alunos e turmas
 *     tags: [TurmaAlunos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vínculos aluno-turma
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   id_aluno:
 *                     type: integer
 *                   id_turma:
 *                     type: integer
 *       204:
 *         description: Nenhum vínculo encontrado
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       500:
 *         description: Erro ao buscar vínculos
 */
TurmaAlunosRouter.get('/', auth, permissao([2]), TurmaAlunosController.getAll); 


/**
 * @swagger
 * /turma/alunos/:
 *   post:
 *     summary: Cria um vínculo entre um aluno e uma turma
 *     tags: [TurmaAlunos]
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
 *               - id_aluno
 *             properties:
 *               id_turma:
 *                 type: integer
 *               id_aluno:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Vínculo criado com sucesso
 *       400:
 *         description: Dados inválidos ou vínculo já existe
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Turma ou aluno não encontrado
 *       500:
 *         description: Erro ao criar vínculo
 */
TurmaAlunosRouter.post('/', auth, permissao([2]), TurmaAlunosController.cadastro); 

/**
 * @swagger
 * /turma/alunos/:
 *   put:
 *     summary: Altera um vínculo aluno-turma
 *     tags: [TurmaAlunos]
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
 *               id_aluno:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Vínculo alterado com sucesso
 *       400:
 *         description: Nenhum dado enviado
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Vínculo, turma ou aluno não encontrado
 *       500:
 *         description: Erro ao atualizar vínculo
 */
TurmaAlunosRouter.put('/', auth, permissao([2]), TurmaAlunosController.alterar); 

/**
 * @swagger
 * /turma/alunos/:
 *   delete:
 *     summary: Remove um ou mais vínculos aluno-turma
 *     tags: [TurmaAlunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_aluno
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID do aluno
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
 *         description: ID do vínculo (turmaAlunos.id)
 *     responses:
 *       200:
 *         description: Vínculo(s) removido(s) com sucesso
 *       400:
 *         description: Nenhum parâmetro informado
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Vínculo, aluno ou turma não encontrado
 *       500:
 *         description: Erro ao remover vínculo
 */
TurmaAlunosRouter.delete('/', auth, permissao([2]), TurmaAlunosController.deletar); // ID Aluno

export { TurmaAlunosRouter };