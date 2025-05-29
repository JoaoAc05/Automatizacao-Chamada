import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { chamadaAlunosController } from "../src/Controller/ChamadaAlunosController.js";

const ChamadaAlunosRouter = express.Router();
const ChamadaAlunosController = new chamadaAlunosController();

/**
 * @swagger
 * tags:
 *   name: ChamadaAlunos
 *   description: Gerenciamento de presença dos alunos
*/

/**
 * @swagger
 * /chamada/falta/:
 *   get:
 *     summary: Buscar alunos vinculados a uma disciplina em um semestre
 *     tags: [ChamadaAlunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_disciplina
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da disciplina vinculada à chamada
 *       - in: query
 *         name: id_semestre
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID do semestre (opcional; se não enviado, usará o semestre padrão)
 *     responses:
 *       200:
 *         description: Lista de alunos encontrados para a disciplina no semestre especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_usuario:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   id_turma:
 *                     type: integer
 *       400:
 *         description: Nenhum dado fornecido para consulta
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Disciplina, semestre ou turma não encontrados
 *       500:
 *         description: Erro interno do servidor
*/
ChamadaAlunosRouter.get('/falta/', auth, permissao([1, 2]), ChamadaAlunosController.getAlunos);

/**
 * @swagger
 * /chamada/alunos/:
 *   get:
 *     summary: Buscar presenças filtradas por chamada, aluno ou vínculo
 *     tags: [ChamadaAlunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_chamada
 *         schema:
 *           type: integer
 *         description: ID da chamada
 *       - in: query
 *         name: id_aluno
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *       - in: query
 *         name: id_vinculo
 *         schema:
 *           type: integer
 *         description: ID do vínculo direto da tabela chamadaAlunos
 *     responses:
 *       200:
 *         description: Lista de presenças encontradas
 *       204:
 *         description: Nenhuma presença encontrada
 *       400:
 *         description: Nenhum dado fornecido para consulta
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Chamada, aluno ou registro não encontrado
 *       500:
 *         description: Erro interno do servidor
*/
ChamadaAlunosRouter.get('/alunos/', auth, permissao([1, 2]), ChamadaAlunosController.getId); // Get pelo ID da chamada

/**
 * @swagger
 * /chamada/alunos:
 *   get:
 *     summary: Buscar todas as presenças de chamadas
 *     tags: [ChamadaAlunos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de presenças retornada com sucesso
 *       204:
 *         description: Nenhuma presença encontrada
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       500:
 *         description: Erro ao retornar presenças
 */
ChamadaAlunosRouter.get('/alunos', auth, permissao([2]), ChamadaAlunosController.getAll);

/**
 * @swagger
 * /chamada/alunos:
 *   post:
 *     summary: Registrar presença do aluno na chamada
 *     tags: [ChamadaAlunos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Dados para registro da presença
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hora_post
 *               - id_chamada
 *               - id_aluno
 *             properties:
 *               hora_post:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-21T16:03:15"
 *               id_chamada:
 *                 type: integer
 *               id_aluno:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Presença registrada com sucesso
 *       400:
 *         description: Dados inválidos ou presença já registrada
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Aluno ou chamada não encontrados
 *       409:
 *         description: Presença duplicada
 * 
 * 
 *       500:
 *         description: Erro ao registrar presença
 */
ChamadaAlunosRouter.post('/alunos', auth, ChamadaAlunosController.presenca); // PRESENÇA REGISTRADA PELO ALUNO

/**
 * @swagger
 * /chamada/alunos/remover:
 *   put:
 *     summary: Remover presença do aluno na chamada
 *     tags: [ChamadaAlunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_vinculo
 *         schema:
 *           type: integer
 *         description: ID do vínculo da presença (chamadaAlunos.id).
 *       - in: query
 *         name: id_chamada
 *         schema:
 *           type: integer
 *         description: ID da chamada. Obrigatório se id_vinculo não for informado.
 *       - in: query
 *         name: id_aluno
 *         schema:
 *           type: integer
 *         description: ID do aluno. Obrigatório se id_vinculo não for informado.
 *     responses:
 *       200:
 *         description: Presença marcada como removida com sucesso
 *       400:
 *         description: Parâmetros obrigatórios ausentes
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Registro de presença não encontrado
 *       500:
 *         description: Erro ao remover presença
 */
ChamadaAlunosRouter.put('/alunos/remover', auth, permissao([1, 2]), ChamadaAlunosController.deletar); // Delete pelo ID do aluno

/**
 * @swagger
 * /chamada/alunos:
 *   put:
 *     summary: Atualizar os dados da presença de um aluno
 *     tags: [ChamadaAlunos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Dados para atualizar o registro de presença
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
 *               id_chamada:
 *                 type: integer
 *               id_aluno:
 *                 type: integer
 *               status:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       200:
 *         description: Presença alterada com sucesso
 *       400:
 *         description: Dados ausentes
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Registro de chamada não encontrado
 *       500:
 *         description: Erro ao alterar presença
 */
ChamadaAlunosRouter.put('/alunos', auth, permissao([2]), ChamadaAlunosController.alterar); 

export { ChamadaAlunosRouter };