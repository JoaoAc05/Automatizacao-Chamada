import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { semestreDisciplinasController } from "../src/Controller/SemestreDisciplinasController.js";

const SemestreDisciplinasRouter = express.Router();
const SemestreDisciplinasController = new semestreDisciplinasController();

/**
 * @swagger
 * tags:
 *   name: SemestreProfessorDisciplinas
 *   description: Gerenciamento de vínculos entre professores, disciplinas e semestres
 */


/**
 * @swagger
 * /semestre/professor/:
 *   get:
 *     summary: Listar disciplinas atribuídas a um professor durante um semestre
 *     tags: [SemestreProfessorDisciplinas]
 *     parameters:
 *       - in: query
 *         name: id_professor
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do professor
 *       - in: query
 *         name: id_semestre
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID do semestre (Opcional, busca o padrão se não informado)
 *     responses:
 *       200:
 *         description: Lista de disciplinas atribuídas ao professor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_disciplina:
 *                     type: integer
 *                   descricao_disciplina:
 *                     type: string
 *                   carga_horaria:
 *                     type: integer
 *                   id_semestre:
 *                     type: integer
 *                   descricao_semestre:
 *                     type: string
 *                     example: "2024/2"
 *       400:
 *         description: ID do professor não fornecido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Nenhuma disciplina atribuída ao professor neste semestre
 *       500:
 *         description: Erro interno do servidor
 */
SemestreDisciplinasRouter.get('/professor/', auth, permissao([1, 2]), SemestreDisciplinasController.disciplinaProfessor);

/**
 * @swagger
 * /semestre/{id_semestre}/disciplinas:
 *   get:
 *     summary: Listar disciplinas de um semestre específico
 *     tags: [SemestreProfessorDisciplinas]
 *     parameters:
 *       - in: path
 *         name: id_semestre
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do semestre
 *     responses:
 *       200:
 *         description: Lista de disciplinas do semestre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   id_disciplina:
 *                     type: integer
 *                   descricao_disciplina:
 *                     type: string
 *                   id_curso:
 *                     type: integer
 *                   descricao_curso:
 *                     type: string
 *                   id_professor:
 *                     type: integer
 *                   nome_professor:
 *                     type: string
 *                   id_semestre:
 *                     type: integer
 *                   descricao_semestre:
 *                     type: string
 *                     example: "2024/2"
 *       400:
 *         description: ID do semestre não fornecido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Nenhum vínculo de disciplina encontrado para este semestre
 *       500:
 *         description: Erro interno do servidor
 */
SemestreDisciplinasRouter.get('/:id_semestre/disciplinas',  auth, permissao([2]), SemestreDisciplinasController.getId); // ID DO SEMESTRE DO ANO

/**
 * @swagger
 * /semestre/disciplinas:
 *   get:
 *     summary: Listar todos os vínculos entre professores, disciplinas e semestres
 *     tags: [SemestreProfessorDisciplinas]
 *     responses:
 *       200:
 *         description: Lista de vínculos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   id_disciplina:
 *                     type: integer
 *                   descricao_disciplina:
 *                     type: string
 *                   id_professor:
 *                     type: integer
 *                   id_semestre:
 *                     type: integer
 *                   descricao_semestre:
 *                     type: string
 *                     example: "2024/2"
 *       204:
 *         description: Nenhum vínculo encontrado
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       500:
 *         description: Erro interno do servidor
 */
SemestreDisciplinasRouter.get('/disciplinas', auth, permissao([2]), SemestreDisciplinasController.getAll); 

/**
 * @swagger
 * /semestre/disciplinas:
 *   post:
 *     summary: Criar um novo vínculo entre professor, disciplina e semestre
 *     tags: [SemestreProfessorDisciplinas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_disciplina
 *               - id_professor
 *               - id_semestre
 *             properties:
 *               id_disciplina:
 *                 type: integer
 *               id_professor:
 *                 type: integer
 *               id_semestre:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Vínculo criado com sucesso
 *       400:
 *         description: Dados inválidos ou vínculo já existente
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Disciplina, professor ou semestre não encontrados
 *       500:
 *         description: Erro interno do servidor
 */
SemestreDisciplinasRouter.post('/disciplinas', auth, permissao([2]), SemestreDisciplinasController.cadastro); 

/**
 * @swagger
 * /semestre/disciplinas:
 *   put:
 *     summary: Atualizar um vínculo existente
 *     tags: [SemestreProfessorDisciplinas]
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
 *                 example: 1
 *               id_disciplina:
 *                 type: integer
 *                 example: 2
 *               id_professor:
 *                 type: integer
 *                 example: 3
 *               id_semestre:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Vínculo atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Vínculo, professor, semestre ou disciplina não encontrados
 *       500:
 *         description: Erro interno do servidor
 */
SemestreDisciplinasRouter.put('/disciplinas', auth, permissao([2]), SemestreDisciplinasController.alterar); 

/**
 * @swagger
 * /semestre/disciplinas/{id}:
 *   delete:
 *     summary: Deletar um vínculo existente
 *     tags: [SemestreProfessorDisciplinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do vínculo
 *     responses:
 *       200:
 *         description: Vínculo deletado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Vínculo não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
SemestreDisciplinasRouter.delete('/disciplinas/:id', auth, permissao([2]), SemestreDisciplinasController.deletar); // ID PROPRIO

export { SemestreDisciplinasRouter };