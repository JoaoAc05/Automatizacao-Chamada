import { prisma } from "../prisma.js";
import { limparCPF, validarCPF, formatarCPF } from '../Utils/CpfUtils.js';
import { validarEmail } from '../Utils/EmailUtils.js'
import bcrypt from 'bcryptjs';
const chavePrivada = "Fasipe2024"

class usuariosController {
    async getAll(req, res) {
        try {
            const usuarios = await prisma.usuario.findMany({
                orderBy: {
                    id: 'asc'
                }
            })
            if (usuarios.length === 0) {
                return res.status(204).end();
            }

            return res.status(200).json(usuarios);
        } catch (e) {
            console.log('Erro ao retornar usuarios: ' + e.message)
            return res.status(500).json({ message: 'Erro ao retornar usuarios: ' + e.message });
        }
    }

    async getId(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Id é obrigatório.'})
        }

        try {
            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: Number(id),
                },
            })
            if (!usuario) {
                return res.status(404).json({ message: 'Não encontrado nenhum registro deste usuario.' })
            }

            return res.status(200).json(usuario)
        } catch (e) {
            console.log('Erro ao retornar usuario: ' + e.message)
            return res.status(500).json({ message: 'Erro ao retornar usuario: ' + e.message })
        }
    };

    async cadastro(req, res) {
        const { tipo, nome, ra, cpf, email, senha } = req.body;
        if (!nome || tipo === undefined || tipo === null || isNaN(tipo)) {
            console.log(`Nome: ${nome}, Tipo: ${tipo}`)
            return res.status(400).json({ message: 'Campos nome e tipo são obrigatórios.' })
        }

        let usuario;
        
        if (![0, 1, 2].includes(tipo)) {
            return res.status(400).json({ message: 'Tipo inválido.'})
        }
        
        try {
            if (tipo == 0) { //Aluno
                if (!nome || !ra || !cpf) {
                    return res.status(400).json({ message: 'Nome, RA e CPF são obrigatórios.' })
                }
                
                usuario = await prisma.usuario.findUnique({
                    where: { ra: ra }
                })
                if (usuario) {
                    return res.status(409).json({ message: 'RA já cadastrado.' })
                }
            } else { //Professor e Admin
                if (!email || !senha) {
                    return res.status(400).json({ message: 'Email e Senha são obrigatórios.' })
                }
                // HASHEAR A SENHA
                const saltRounds = 10;
                // Gera o hash da senha
                const senhaHash = await bcrypt.hash(senha, saltRounds);
                req.body.senha = senhaHash

                if (!validarEmail(email)) {
                    return res.status(400).json({ message: 'Email inválido.' });
                }

                // Verificação de cadastros já realizados
                usuario = await prisma.usuario.findUnique({
                    where: { email: email }
                })
                if (usuario) {
                    return res.status(409).json({ message: 'Email já cadastrado.' })
                }

                req.body.status = 1
                delete req.body.imei;
                delete req.body.ra;
            }

            if ([0, 1].includes(tipo)) {
                if (!cpf) {
                    return res.status(400).json({ message: 'CPF é obrigatório.' });
                }
                const cpfLimpo = limparCPF(cpf);
                if (!validarCPF(cpfLimpo)) {
                    return res.status(400).json({ message: 'CPF inválido.' });
                }

                // Formata o CPF para salvar no banco
                req.body.cpf = formatarCPF(cpfLimpo);

                usuario = await prisma.usuario.findUnique({
                where: { cpf: cpf }
                })
                if (usuario) {
                    return res.status(409).json({ message: 'CPF já cadastrado.' })
                }
            } else {
                delete req.body.cpf;
            }

            const createUsuario = await prisma.usuario.create({ data: req.body });
            return res.status(201).json(createUsuario);
        } catch (e) {
            console.log('Erro ao criar usuario: ' + e.message)
            return res.status(500).json({ message: 'Erro ao criar usuario: ' + e.message });
        }
    }

    // Nova rota para validação do cadastro do aluno
    async validacao(req, res) {
        const { nome, ra, email, senha, imei } = req.body;
        const dataToUpdate = req.body;

        if (!nome || !ra || !email || !senha || !imei) {
            return res.status(400).json({ message: 'Campos nome, ra, email e senha são obrigatórios' })
        }

        try {
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
                return res.status(403).json({ message: 'O cadastro do usuário se encontra em um status não autorizado para validar.' })
            }
    
            if (!validarEmail(email)) {
                return res.status(400).json({ message: 'Email inválido.' });
            }
    
            const emailExistente = await prisma.usuario.findFirst({
                where: { email: email }
            });
            if (emailExistente) {
                return res.status(409).json({ message: 'E-mail informado já está cadastrado.' });
            }
    
            // HASHEAR A SENHA
            const saltRounds = 10;
            // Gera o hash da senha
            const senhaHash = await bcrypt.hash(senha, saltRounds);

            // Se existir o cadastro, inserir as informações de email, senha e imei
            const validacaoAluno = await prisma.usuario.updateMany({
                where: {
                    id: aluno.id,
                },
                data: {
                    email: email,
                    senha: senhaHash,
                    imei: imei,
                    status: 1,
                }
            })

            return res.status(200).json({ message: 'Aluno validado com sucesso' })
        } catch (e) {
            console.log('Erro ao validar usuario: ' + e.message)
            return res.status(500).json({ message: 'Erro ao validar usuario: ' + e.message });
        }

    }

    async alterar(req, res) {
        const { id, tipo } = req.body;
        const dataToUpdate = req.body;
        delete dataToUpdate.id;
        delete dataToUpdate.data_cadastro;

        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }

        try {
            let usuario;

            if (dataToUpdate.cpf) {
                const cpfLimpo = limparCPF(dataToUpdate.cpf);
                if (!validarCPF(cpfLimpo)) {
                    return res.status(400).json({ message: 'CPF inválido.' });
                }
                dataToUpdate.cpf = formatarCPF(cpfLimpo);

                usuario = await prisma.usuario.findUnique({
                where: { cpf: dataToUpdate.cpf }
                })
                if (usuario && usuario.id !== id) {
                    return res.status(409).json({ message: 'CPF já cadastrado.' })
                }
            }
            if (dataToUpdate.email) {
                if (!validarEmail(dataToUpdate.email)) {
                    return res.status(400).json({ message: 'Email inválido.' });
                }

                usuario = await prisma.usuario.findUnique({
                    where: { email: dataToUpdate.email }
                })
                if (usuario  && usuario.id !== id) {
                    return res.status(409).json({ message: 'Email já cadastrado.' })
                }
            }
            if(dataToUpdate.senha) {
                const saltRounds = 10;
                // Gera o hash da senha
                const senhaHash = await bcrypt.hash(dataToUpdate.senha, saltRounds);
                dataToUpdate.senha = senhaHash
            }

            if( tipo == 0 || tipo == 1) {
                if (dataToUpdate.cpf === "") {
                    return res.status(400).json({ message: 'Aluno e professor devem ter CPF.'})
                }
            } else {
                if (dataToUpdate.cpf === "") {
                    dataToUpdate.cpf = null;
                }
            }

            if ( tipo == 0 ) {
                if (dataToUpdate.ra === "") {
                    return res.status(400).json({ message: 'Aluno deve conter RA.'})
                }

                if (dataToUpdate.senha === "") {
                    dataToUpdate.senha = null;
                    if (dataToUpdate.status != 2) {
                        dataToUpdate.status = 0 // Refazer validação
                    }
                }
                if (dataToUpdate.imei === "") {
                    dataToUpdate.imei  = null;
                    if (dataToUpdate.status != 2) {
                        dataToUpdate.status = 0 // Refazer validação
                    }
                }
                if (dataToUpdate.email === "") {
                    dataToUpdate.email  = null
                    if (dataToUpdate.status != 2) {
                        dataToUpdate.status = 0 // Refazer validação
                    }
                }
            } else {
                if (dataToUpdate.ra === "") {
                    dataToUpdate.ra = null;
                }
                if (dataToUpdate.email === "") {
                    return res.status(400).json({ message: 'Defina um nov email.'})
                }
                if (dataToUpdate.senha === "") {
                    return res.status(400).json({ message: 'Defina uma nova senha.'})
                }
                if (dataToUpdate.imei === "") {
                    dataToUpdate.imei  = null;
                }
            }
            
            

            const updateUsuarios = await prisma.usuario.update({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate, 
            });

            if (!updateUsuarios) {
                return res.status(404).json({ message: 'Usuario não encontrado.' });
            }

            return res.status(200).json({ message: 'Usuario alterado com sucesso.' });
        } catch (e) {
            console.log('Erro ao alterar usuario: ' + e.message)
            return res.status(500).json({ message: 'Erro ao alterar usuario: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Id é obrigatório.'})
        }

        try {

            const usuario = await prisma.usuario.findUnique({
                where: { 
                    id: Number(id)
                },
            });
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario não encontrado.' });
            }

            const deleteUsuario = await prisma.usuario.delete({
                where: {
                    id: Number(id),
                },
            })
            if (!deleteUsuario) {
                return res.status(404).json({ message: 'Nenhum usuário encontrado para deletar.'})
            }

            return res.status(200).json({ message: 'Usuario deletado com sucesso.' })
        } catch (e) {
            console.log('Erro ao deletar usuario: ' + e.message)
            return res.status(500).json({ message: 'Erro ao deletar usuario. ' + e.message })
        }
    }
}
export { usuariosController };