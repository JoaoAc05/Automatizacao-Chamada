import { prisma } from "../prisma.js";

class turmasController {
    async getAll(req, res) { 
        try {
            const turmas = await prisma.turma.findMany()
            if (!turmas) {
                return res.status(404).json({message: 'Nenhum registro encontrado'})
            }

            res.status(200).json(turmas);
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar turmas: ' + e.message});
        }
    }

    async getId(req, res) {
        const { id } = req.params;
        try {
            const turma = await prisma.turma.findUnique({
                where: {
                    id: Number(id),
                },
            })
            if (!turma) {
                return res.status(404).json({message: 'Não encontrado nenhum registro desta turma'})
            }

            res.status(200).json(turma)
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar turma: ' + e.message})
        }
    };

    async cadastro(req, res) {
        const {semestre_curso, id_curso} = req.body
        try {
            //Verifica se veio todas as informações
            if (!semestre_curso || !id_curso) {
                return res.status(400).json({ message: 'Os campos semestre_curso e id_curso são obrigatórios.' });
            }

            // Verifica se o curso existe
            const curso = await prisma.curso.findUnique({
                where: { 
                    id: Number(id_curso) 
                },
            });
            if (!curso) {
                return res.status(404).json({ message: 'Curso não encontrado.' });
            }


            const turma = await prisma.turma.findMany({
                where: {
                    id_curso: Number(id_curso),
                    semestre_curso: semestre_curso
                }
            })
            if (turma) {
                return res.status(400).json({message: 'Já existe uma turma deste curso neste semestre'})
            }
            
            const createTurmas = await prisma.turma.create({ 
                data: {
                    semestre_curso: semestre_curso,
                    Curso: {
                        connect: {id: id_curso}
                    } 
                }
            });
            res.status(201).json(createTurmas);
        } catch (e) {
            res.status(500).json({ message: 'Erro ao criar turma: ' + e.message });
        }
    }

    async alterar(req, res) {
        const { id, id_curso } = req.body;
        const dataToUpdate = req.body;
    
        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
        }

        if (id_curso) {
            const curso = await prisma.curso.findUnique({
                where: { 
                    id:  Number(id_curso) 
                },
            });
            if (!curso) {
                return res.status(404).json({ message: 'Curso não encontrado.' });
            }
        }
    
        try {
            const updateTurmas = await prisma.turma.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate,  // Passa diretamente o req.body
            });
    
            if (updateTurmas.count === 0) {
                return res.status(404).json({ message: 'Turma não encontrado.' });
            }
    
            res.status(200).json({ message: 'Turma alterado com sucesso.' });
        } catch (e) {
            res.status(500).json({ message: 'Erro ao alterar turma: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id } = req.params;
        try {
            const deleteTurmas = await prisma.turma.deleteMany({
                where: { 
                    id: Number(id), 
                },
            })
            res.status(200).json({sucesso: 'Turma deletado com sucesso.'})
        } catch (e) {
            res.status(500).json({error: 'Erro ao deletar turma: ' + e.message})
        }
    }
}
export { turmasController };
