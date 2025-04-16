import { prisma } from "../prisma.js";

class chamadaAlunosController {
    async getAll(req, res) { 
        try {
            const chamadasAlunos = await prisma.chamadaAlunos.findMany()
            if (chamadasAlunos.length === 0) {
                return res.status(204).end();
            }
 
            res.status(200).json(chamadasAlunos);
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar presenças das chamadas: ' + e.message});
        }
    }

    async getId(req, res) {
        const { id_chamada } = req.params;
        try {
            const chamada = await prisma.chamada.findMany({
                where: {
                    id: Number(id_chamada),
                },
            })
            if (chamada.length === 0) {
                return res.status(404).json({ message: 'Chamada não encontrada.' }); 
            }

            const chamadaAlunos = await prisma.chamadaAlunos.findMany({
                where: {
                    id_chamada: Number(id_chamada),
                },
            })
            if (chamadaAlunos.length === 0) {
                return res.status(404).json({ message: 'Lista de presença desta chamada não foi encontrada.' }); 
            }

            res.status(200).json(chamadaAlunos)
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar presenças da chamada: ' + e.message})
        }
    };

    async presenca (req, res) {
        const { hora_post, id_chamada, id_aluno } = req.body;
        try {
            // Verifica se a hora_post está presente e é uma data válida
            if (!hora_post || isNaN(new Date(hora_post))) {
                return res.status(400).json({ message: 'Hora do post inválida.' });
            }

            // Obtém a hora atual do servidor (VERCEL É FUSO WHASHINGTON)
            const serverTime = new Date();
            
            const postTime = new Date(hora_post);
                        
            // (SEGUNDOS SERVIDOR - SEGUNDOS POST) + 60 * (MINUTOS SERVIDOR - MINUTOS POST)
            //EX: Horário Servidor = 13:01:58
            // Horário Post = 13:02:02
            // Segundos - Segundos ( 58 - 2 = 56)
            // Minutos  - Minutos ( 1 - 2 = -1)
            // Minutos Res * 60 ( -1 * 60 = -60)
            // Segundos Res + Minutos Res ( 56 + (-60) = -4)
            // RESULTADO = 4 segundos de diferenca
            const secondsDifference = Math.abs(serverTime.getUTCSeconds() - postTime.getUTCSeconds() + 60 * (serverTime.getUTCMinutes() - postTime.getUTCMinutes()));
    
            // Verifica se a diferença em segundos é maior que 5
            if (secondsDifference > 5) {
                return res.status(400).json({
                    message: 'Horário do aluno é inválido.',
                    serverTime: serverTime.toISOString(),
                    postTime: postTime.toISOString(),
                });
            }

            if (!id_aluno || !id_chamada) {
                return res.status(400).json({ message: 'Os campos id_aluno e id_chamada são obrigatórios.' });
            }

            const aluno = await prisma.usuario.findUnique({
                where: {
                    id: Number(id_aluno)
                }
            })
            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado.' });
            }
            if(aluno.tipo !== 0) {
                return res.status(401).json({ message: 'Usuário não é um aluno.' });
            }

            const chamada = await prisma.chamada.findUnique({
                where: {
                    id: Number(id_chamada)
                }
            })
            if (!chamada) {
                return res.status(404).json({ message: 'Chamada não encontrada.' })
            }

            const presenca = await prisma.chamadaAlunos.findFirst({
                where:{
                    id_aluno: Number(id_aluno),
                    id_chamada: Number(id_chamada)
                }
            })
            if (presenca) {
                 return res.status(400).json({ message: 'Presença registrada com sucesso!' })
            }

            const createChamadaAluno = await prisma.chamadaAlunos.create({ 
                data: {
                   Chamada: {
                        connect: {id: Number(id_chamada)}
                    } ,
                    Aluno: {
                        connect: {id: Number(id_aluno)}
                    }, 
                }
            }); 
            if(createChamadaAluno.length === 0) {
                return res.status(400).json({ message: 'Presença não foi registrada, contate o suporte!' })
            } 

            res.status(201).json(createChamadaAluno);
        } catch (e) {
            res.status(500).json({ message: 'Erro ao definir presenca: ' + e.message });
        }
    }

    async alterar(req, res) {
        const { id, id_chamada, id_aluno } = req.body;
        const dataToUpdate = req.body;

        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }

        // Se tiver id_chamada, verificar se a chamada existe
        if(id_chamada) {
            const chamada = await prisma.chamada.findUnique({
                where:{
                    id: Number(id_chamada)
                }
            })
            if (!chamada) {
                return res.status(404).json({ message: 'Chamada não encontrada' })
            }
        }

        // Se tiver id_aluno, verificar se o usuario existe e é um aluno
        if (id_aluno) {
            const aluno = await prisma.usuario.findUnique({
                where: {
                    id: Number(id_aluno)
                }
            })
            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado' })
            }
            if (aluno.tipo !== 0) {
                return res.status(401).json({ message: 'Usuário não é um aluno.' })
            }
        }
    
        try {
            const updateChamadaAlunos = await prisma.chamadaAlunos.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate,  // Passa diretamente o req.body
            });
    
            if (updateChamadaAlunos.count === 0) {
                return res.status(404).json({ message: 'Registro de chamada não encontrado.' });
            }
    
            res.status(200).json({ message: 'Presença alterada com sucesso.' });
        } catch (e) {
            res.status(500).json({ message: 'Erro ao alterar presença: ' + e.message });
        }
    }
    
    async deletar(req, res) { // As presenças não podem ser excluidas de forma alguma, então será dado apenas o update no status
        const { id_chamada, id_aluno } = req.params;
        try {

            const deleteChamadaAluno = await prisma.chamadaAlunos.updateMany({
                where: { 
                    id_chamada: Number(id_chamada),
                    id_aluno: Number(id_aluno), 
                },
                data: {
                    status: 1 // Presença Removida
                }
            })
            if (deleteChamadaAluno.count === 0) {
                return res.status(404).json({ message: 'Registro de presença não encontrado.' });
            }

            res.status(200).json({ message: 'Presença do aluno removida com sucesso.' })
        } catch (e) {
            res.status(500).json({ message: 'Erro ao remover presença: ' + e.message })
        }
    }
}
export { chamadaAlunosController };