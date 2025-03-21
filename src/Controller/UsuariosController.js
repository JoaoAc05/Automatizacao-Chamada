import { prisma } from "../prisma.js";
import jwt from 'jsonwebtoken';
const chavePrivada = "Fasipe2024"

class usuariosController {
    async getAll(req, res) { 
        try {
            const usuarios = await prisma.usuario.findMany()
            if (!usuarios) {
                return res.status(404).json({message: 'Nenhum registro encontrado'})
            }

            res.status(200).json(usuarios);
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar usuario: ' + e.message});
        }
    }

    async getId(req, res) {
        const { id } = req.params;
        try {
            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: Number(id),
                },
            })
            if (!usuario) {
                return res.status(404).json({message: 'Não encontrado nenhum registro deste usuario'})
            }

            res.status(200).json(usuario)
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar usuario: ' + e.message})
        }
    };

    async cadastro(req, res) {
        try {
            const createUsuario = await prisma.usuario.create({ data: req.body });
            res.status(201).json(createUsuario);
        } catch (e) {
            res.status(500).json({ message: 'Erro ao criar usuario: ' + e.message });
        }
    }

    // Nova rota para validação do cadastro do aluno
    async validacao(req,res) {
        const {nome, ra, email, senha, imei} = req.body;
        const dataToUpdate = req.body;

        if (!nome || !ra || !email || !senha || !imei) {
            return res.status(400).json({ message: 'Campos nome, ra, email e senha são obrigatórios'})
        }

        // Primeiro é necessario encontrar o cadastro do Aluno, pelo nome e pelo RA.
        const aluno = await prisma.usuario.findFirst({
            where: { 
                nome: String(nome),
                ra: String(ra)
            },
        });

        if (!aluno) {
            return res.status(404).json({ message: 'Cadastro não encontrado.' });
        }
        if (aluno.status !== 0) { 
            // Se status = 1 ele já esta valido, não precisa de uma nova validação. 
            // Se status = 2 então está inativo, não tem como validar.
            console.log(`Status do Aluno: ${aluno.status} - ${Number(aluno.status)}`)
            return res.status(400).json({ message: 'O cadastro do usuário se encontra em um status não autorizado para validar.'})
        }

        const emailExistente = await prisma.usuario.findUnique({
            where: { email: email }
        });
        if (emailExistente) {
            return res.status(400).json({ message: 'E-mail informado já está cadastrado.' });
        }

        try {
            // Se existir o cadastro, inserir as informações de email, senha e imei
            const validacaoAluno = await prisma.usuario.updateMany({
                where: {
                    id: aluno.id,
                },
                data: {
                    email: email,
                    senha: senha,
                    imei: imei,
                    status: 1,
                }
            })

            res.status(200).json({ message: 'Aluno validado com sucesso'})
        } catch (e) {
            res.status(500).json({ message: 'Erro ao validar usuario: ' + e.message });
        }
        
    } 

    async alterar(req, res) {
        const { id } = req.body;
        const dataToUpdate = req.body;
    
        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }
    
        try {
            const updateUsuarios = await prisma.usuario.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate,  // Passa diretamente o req.body
            });
    
            if (updateUsuarios.count === 0) {
                return res.status(404).json({ message: 'Usuario não encontrado.' });
            }
    
            res.status(200).json({ message: 'Usuario alterado com sucesso.' });
        } catch (e) {
            res.status(500).json({ message: 'Erro ao alterar usuario: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id } = req.params;
        try {
            const deleteUsuarios = await prisma.usuario.deleteMany({
                where: { 
                    id: Number(id), 
                },
            })
            res.status(200).json({message: 'Usuario deletado com sucesso.'})
        } catch (e) {
            res.status(500).json({message: 'Erro ao deletar usuario. ' + e.message})
        }
    }

    async loginAluno(req, res) {
        const { imei, email, senha } = req.body;
        
    
        try {
            // Verifica se os campos estão preenchidos
            if (!email || !senha) {
                return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
            }
    
            // Consulta o banco de dados para verificar se o email existe
            const usuario = await prisma.usuario.findUnique({
                where: { 
                    email: email 
                },
            });

            // Se o email não for encontrado, retorna um erro
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }
            if (usuario.tipo !== 0) {
                return res.status(401).json({ message: 'Usuário não é um aluno' });
            }
            // if (usuario.status !== 1) {
            //     return res.status(401).json({ message: 'Seu cadastro não está valido! Realize o cadastro.' });
            // }  
    
            // Compara a senha da req com a senha do banco de dados
            if (senha !== usuario.senha) {
                return res.status(400).json({ message: 'Senha incorreta.' });
            } 
            
            const usuarioPayload = {
                id: usuario.id,
                nome: usuario.nome,
                ra: usuario.ra,
                cpf: usuario.cpf
            };

            // Se o usuário não possui IMEI, atualiza o IMEI
            if (!usuario.imei) {
                const updateImei = await prisma.usuario.update({
                    where: {
                        email: email,
                    },
                    data: {
                        imei: imei,
                    },
                });

                
    
                // return res.status(200).json({ message: 'Login bem-sucedido. IMEI inserido com sucesso.' });
                jwt.sign(usuarioPayload, chavePrivada, (err, token) => {
                    if (err) {
                        res.status(500).json({ mensagem: "Erro ao gerar autenticação" });
    
                        return;
                    }
                    res.status(200).json({auth: true, token});
                });
    
            } else if (imei === usuario.imei) {
                // IMEI já cadastrado no banco de dados
                // return res.status(200).json({ message: 'Login bem-sucedido. IMEI já cadastrado.' });
                jwt.sign(usuarioPayload, chavePrivada, (err, token) => {
                    if (err) {
                        res.status(500).json({ mensagem: "Erro ao gerar autenticação" });
    
                        return;
                    }
                    res.status(200).json({auth: true, token});
                });
                
            } else {
                // IMEI diferente ou inválido
                return res.status(400).json({ message: 'IMEI diferente do usuário ou inválido.' });
            }
    
        } catch (e) {
            // Erro interno do servidor
            return res.status(500).json({ message: 'Erro interno no servidor: ' + e.message });
        }
    }

    async loginWeb(req, res) {
        const { email, senha } = req.body;
    
        try {
            // Verifica se os campos estão preenchidos
            if (!email || !senha) {
                return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
            }
    
            // Consulta o banco de dados para verificar se o email existe
            const usuario = await prisma.usuario.findUnique({
                where: { 
                    email: email 
                },
            });
    
            // Se o email não for encontrado, retorna um erro
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado. Verifique seu email e senha!' });
            }
            if (usuario.tipo !== 1) {
                return res.status(401).json({ message: 'Usuário não é um professor' });
            }
    
            // Compara a senha da req com a senha do banco de dados
            if (senha !== usuario.senha) {
                return res.status(400).json({ message: 'Senha incorreta.' });
            }

            const usuarioPayload = {
                id: usuario.id,
                nome: usuario.nome,
                cpf: usuario.cpf
            };

            // return res.status(200).json({ message: 'Login bem-sucedido.' });
            jwt.sign(usuarioPayload, chavePrivada, (err, token) => {
                if (err) {
                    res.status(500).json({ mensagem: "Erro ao gerar autenticação" });

                    return;
                }
                res.status(200).json({auth: true, token});
            });
    
        } catch (e) {
            // Erro interno do servidor
            return res.status(500).json({ message: 'Erro interno no servidor: ' + e.message });
        }
    }

}
export { usuariosController };