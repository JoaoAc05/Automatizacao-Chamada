import { prisma } from "../prisma.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { json } from "express";

const chavePrivada = "Fasipe2024"

class loginController {
    

    async app(req, res) {
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
            if (!usuario) {// Se o email não for encontrado
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }
            if (usuario.tipo !== 0) {
                return res.status(403).json({ message: 'Usuário não é um aluno' });
            }
            if (usuario.status !== 1) {
                return res.status(401).json({ message: 'Seu cadastro não está valido! Realize o cadastro.' });
            }  

            // // Comparar Hashing da senha
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            console.log(`Senha Req: ${senha} - Senha BD: ${usuario.senha} - Resultado: ${senhaValida}`)
            if (!senhaValida) {
                return res.status(401).json({ message: "Senha incorreta" });
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
                if (!updateImei) {
                    console.log(`Usuário não encontrado para atualizar o imei.\nId_Usuario: ${usuario.id} Email: ${usuario.email} - Imei: ${imei}`)
                }

            } else if (imei !== usuario.imei) {
                 return res.status(400).json({ message: 'IMEI diferente do usuário ou inválido.' });
            }

            jwt.sign(usuarioPayload, chavePrivada, (err, token) => {
                if (err) {
                    console.log(`Erro ao gerar autenticação: ${err}`)
                    return res.status(500).json({ message: 'Erro ao gerar autenticação' });
                }
                console.log(`Login: ${usuarioPayload.nome}`)
                return res.status(200).json({auth: true, token});
            });
    
        } catch (e) {
            console.log('Erro interno no servidor: ' + e.message)
            return res.status(500).json({ message: 'Erro interno no servidor: ' + e.message });
        }
    }

    async dash(req, res) {
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
            if (usuario.tipo !== 1 && usuario.tipo !== 2) {
                return res.status(403).json({ message: 'Nivel de acesso negado'})
            }
    
            // // Comparar Hashing da senha
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ message: "Senha incorreta" });
            }

            const usuarioPayload = {
                id: usuario.id,
                nome: usuario.nome,
                cpf: usuario.cpf,
                tipo: usuario.tipo
            };

            jwt.sign(usuarioPayload, chavePrivada, (err, token) => { //Adcionar o expiresIn com 10 minutos, e uma forma do token dar refresh ao usar o aplicativo
                if (err) {
                    console.log(`Erro ao gerar autenticação: ${err}`)
                    return res.status(500).json({ message: 'Erro ao gerar autenticação' });
                }
                console.log(`Login: ${usuarioPayload.nome}, Tipo: ${usuarioPayload.tipo}`)
                return res.status(200).json({auth: true, token});
            });    
        } catch (e) {
            console.log('Erro interno no servidor: ' + e.message)
            return res.status(500).json({ message: 'Erro interno no servidor: ' + e.message });
        }
    }

}
export { loginController };