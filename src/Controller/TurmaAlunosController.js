import { prisma } from "../prisma.js";

class turmaAlunosController {
    async getAll(req, res) { 
        try {
            const turmas = await prisma.turmaAlunos.findMany()
            if (turmas.length === 0) {
                return res.status(404).json({message: 'Nenhum vinculo encontrado'})
            }

            res.status(200).json(turmas);
        } catch (e) {
            res.status(500).json({ message: 'Erro ao retornar vinculo turma alunos: ' + e.message });
        }
    }

    async getId(req, res) {
        const { id_turma } = req.params;
        try {
            const turma = await prisma.turmaAlunos.findUnique({
                where: {
                    id_turma: Number(id_turma),
                },
            })
            if (!turma) {
                return res.status(404).json({ message: 'Não encontrado nenhum registro de aluno desta turma'} )
            }

            res.status(200).json(turma)
        } catch (e) {
            res.status(500).json({ message: 'Erro ao retornar alunos da turma: ' + e.message })
        }
    };

    async cadastro(req, res) {
        const {id_turma, id_aluno} = req.body
        try {
            //Verifica se veio todas as informações
            if (!id_turma || !id_aluno) {
                return res.status(400).json({ message: 'Os campos id_turma e id_aluno são obrigatórios.' });
            }

            // Verifica se a turma existe
            const turma = await prisma.turma.findUnique({
                where: { 
                    id: Number(id_turma) 
                },
            });
            if (!turma) {
                return res.status(404).json({ message: 'Turma não encontrado.' });
            }


            const aluno = await prisma.usuario.findUnique({
                where: {
                    id: Number(id_aluno)
                }
            })
            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado' })
            }
            if(aluno.tipo !== 0) {
                return res.status(401).json({ message: 'Usuário não é um aluno.' });
            }

            const AlunoTurma = await prisma.turmaAlunos.findFirst({
                where: {
                    id_aluno: Number(id_aluno),
                    id_turma: Number(id_turma)
                }
            })
            if (AlunoTurma) {
                return res.status(400).json({ message: 'Este aluno já pertence a esta turma' })
            }
            
            const createTurmaAlunos = await prisma.turmaAlunos.create({ 
                data: {
                    Usuario: {
                        connect: {id: id_aluno}
                    },
                    Turma: {
                        connect: {id: id_turma}
                    }
                }
            });
            res.status(201).json(createTurmaAlunos);
        } catch (e) {
            res.status(500).json({ message: 'Erro ao criar vinculo de aluno na turma: ' + e.message });
        }
    }

    async alterar(req, res) {
        const {id_turma, id_aluno, id} = req.body
        const dataToUpdate = req.body;
    
        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }

        if (id_turma) {
            const turma = await prisma.turma.findUnique({
                where: { 
                    id: Number(id_turma) 
                },
            });
            if (!turma) {
                return res.status(404).json({ message: 'Turma não encontrada.' });
            }
        }

        if (id_aluno) {
            const aluno = await prisma.usuario.findUnique({
                where: {
                    id: Number(id_aluno)
                }
            })
            if (!aluno) {
                return res.status(404).json({ message: 'Aluno não encontrado' })
            }
            if(aluno.tipo !== 0) {
                return res.status(401).json({ message: 'Usuário não é um aluno.' });
            }
        }
    
        try {
            const updateTurmaAlunos = await prisma.turmaAlunos.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate,
            });
    
            if (updateTurmaAlunos.count === 0) {
                return res.status(404).json({ message: 'Vinculo Aluno Turma não encontrado.' });
            }
    
            res.status(200).json({ message: 'Vinculo Aluno Turma alterado com sucesso.' });
        } catch (e) {
            res.status(500).json({ message: 'Erro ao alterar vinculo aluno turma: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id_aluno } = req.params;

        try {

            const alunoTurma = await prisma.turmaAlunos.findFirst({
                where: {
                    id_aluno: Number(id_aluno)
                }
            })
            if (!alunoTurma) {
                return res.status(404).json({ message: 'Este aluno não pertence a nenhuma turma' })
            }

            const deleteTurmaAlunos = await prisma.turmaAlunos.deleteMany({
                where: { 
                    id_aluno: Number(id_aluno), 
                },
            })
            res.status(200).json({ message: 'Vinculo Aluno Turma deletado com sucesso.' })
        } catch (e) {
            res.status(500).json({ message: 'Erro ao deletar vinculo aluno turma: ' + e.message })
        }
    }
}
export { turmaAlunosController };
