import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { chamadasController } from "../src/Controller/ChamadasController.js";

const ChamadasRouter = express.Router();
const ChamadasController = new chamadasController();

/**
 * @swagger
 * tags:
 *   name: Chamadas
 *   description: Endpoints de gerenciamento de chamadas
 */

/**
 * @swagger
 * /chamadas/professor/:
 *   get:
 *     summary: Listar chamadas de um professor no semestre
 *     tags: [Chamadas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_professor
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do professor
 *       - name: id_semestre
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID do semestre (Opcional, busca o padrão se não informado)
 *       - name: id_disciplina
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID da disciplina (Opcional, para buscar pela específica)
 *     responses:
 *       200:
 *         description: Lista de chamadas retornada com sucesso
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
 *                   id_professor:
 *                     type: integer
 *                   id_semestre:
 *                     type: integer
 *                   data_hora_inicio:
 *                     type: string
 *                     format: date-time
 *                   data_hora_final:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Professor, semestre ou chamadas não encontrados
 *       500:
 *         description: Erro interno do servidor
 */
ChamadasRouter.get('/professor/', auth, permissao([1, 2]), ChamadasController.chamadaProfessor) // [VER CHAMADAS DO PROFESSOR NO SEMESTRE]

/**
 * @swagger
 * /chamadas/{id}:
 *   get:
 *     summary: Buscar chamada por ID
 *     tags: [Chamadas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da chamada
 *     responses:
 *       200:
 *         description: Chamada encontrada
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Chamada não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
ChamadasRouter.get('/:id', auth, permissao([1, 2]), ChamadasController.getId); // [VER CHAMADAS ESPECÍFICA]

/**
 * @swagger
 * /chamadas:
 *   get:
 *     summary: Listar todas as chamadas
 *     tags: [Chamadas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de chamadas retornada com sucesso
 *       204:
 *         description: Requisição bem-sucedida, mas sem conteúdo
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       500:
 *         description: Erro interno do servidor
 */
ChamadasRouter.get('/', auth, permissao([2]), ChamadasController.getAll); // [VER TODAS CHAMADAS]

/**
 * @swagger
 * /chamadas:
 *   post:
 *     summary: Iniciar uma nova chamada
 *     tags: [Chamadas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_professor
 *               - id_disciplina
 *               - data_hora_inicio
 *             properties:
 *               id_disciplina:
 *                 type: integer
 *               id_professor:
 *                 type: integer
 *               id_semestre:
 *                 type: integer
 *               data_hora_inicio:
 *                 type: string
 *                 format: date-time
 *               data_hora_final:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Chamada iniciada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Professor, disciplina ou semestre não foram encontrados
 *       500:
 *         description: Erro interno do servidor
 */
ChamadasRouter.post('/', auth, permissao([1, 2]), ChamadasController.cadastro); // [PROFESSOR INICIA CHAMADA]

/**
 * @swagger
 * /chamadas/finalizar:
 *   put:
 *     summary: Finalizar chamada
 *     tags: [Chamadas]
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
 *               - data_hora_final
 *             properties:
 *               id:
 *                 type: integer
 *               data_hora_final:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Chamada finalizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Chamada não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
ChamadasRouter.put('/finalizar', auth, permissao([1, 2]), ChamadasController.finalizarChamada); // [PROFESSOR FINALIZA CHAMADA]

/**
 * @swagger
 * /chamadas:
 *   put:
 *     summary: Alterar chamada
 *     tags: [Chamadas]
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
 *               observacao:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chamada alterada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Chamada não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
ChamadasRouter.put('/', auth, permissao([2]), ChamadasController.alterar); // [ADMIN ALTERA CHAMADA]

/**
 * @swagger
 * /chamadas/{id}:
 *   delete:
 *     summary: Deletar chamada por ID
 *     tags: [Chamadas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da chamada
 *     responses:
 *       200:
 *         description: Chamada deletada com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Chamada não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
ChamadasRouter.delete('/:id', auth, permissao([2]), ChamadasController.deletar); // [ADMIN EXCLUI CHAMADA]

export { ChamadasRouter };