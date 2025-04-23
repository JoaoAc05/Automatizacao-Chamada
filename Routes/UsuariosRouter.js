import express from "express";
import auth, { permissao }  from "../middleware/auth.js";
import { usuariosController } from "../src/Controller/UsuariosController.js";

const UsuariosRouter = express.Router();
const UsuariosController = new usuariosController();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários do sistema
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       400:
 *         description: Id não informado
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
UsuariosRouter.get('/:id', auth, permissao([1, 2]), UsuariosController.getId); 

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       204:
 *         description: Requisição bem-sucedida, mas sem conteúdo
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       500:
 *         description: Erro interrno do servidor
 */
UsuariosRouter.get('/', auth, permissao([2]), UsuariosController.getAll);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cadastrar novo usuário
 *     tags: [Usuários]
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
 *               - tipo
 *             properties:
 *               nome:
 *                 type: string
 *               cpf:
 *                 type: string
 *               ra:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               tipo:
 *                 type: integer
 *               status:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         descripton: Dados enviados inválidos ou faltando
 *       401:
 *         description: Não autorizado
 *       403:
 *         desciption: Sem nível de permissão
 *       409:
 *         description: Dados informados já existem no banco de dados
 *       500:
 *         description: Erro interno do servidor
 */
UsuariosRouter.post('/', auth, permissao([2]), UsuariosController.cadastro);

/**
 * @swagger
 * /usuarios/valida:
 *   post:
 *     summary: Validar cadastro de aluno
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - ra
 *               - email
 *               - senha
 *               - imei
 *             properties:
 *               nome:
 *                 type: string
 *               ra:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               imei:
 *                 type: string  
 *     responses:
 *       200:
 *         description: Validação bem-sucedida
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: O cadastro já está valido ou inativo
 *       404:
 *         description: Não encontrado aluno com este nome e ra
 *       409:
 *         description: Email informado já está em uso
 *       500: 
 *         description: Erro interno do servidor
 */
UsuariosRouter.post('/valida', UsuariosController.validacao);

/**
 * @swagger
 * /usuarios:
 *   put:
 *     summary: Atualizar dados do usuário
 *     tags: [Usuários]
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
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Sem nível de permissão
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
UsuariosRouter.put('/', auth, permissao([2]), UsuariosController.alterar); 

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Deletar usuário por ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário deletado
 *       400: 
 *         description: Id não informado ou inválido
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 *       500: 
 *         description: Erro interno do servidor
 */
UsuariosRouter.delete('/:id', auth, permissao([2]), UsuariosController.deletar);


export { UsuariosRouter };