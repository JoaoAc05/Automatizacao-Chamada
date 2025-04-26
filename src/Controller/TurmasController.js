import { prisma } from "../prisma.js";

class turmasController {
    async getAll(req, res) { 
        try {
            const turmas = await prisma.turma.findMany({
                include: {
                    Curso: {
                        select: {
                            descricao: true
                        }
                    }
                }
            })
            if (turmas.length === 0) {
                return res.status(204).end();
            }

            return res.status(200).json(turmas);
        } catch (e) {
            console.log('Erro ao retornar turmas: ' + e.message)
            return res.status(500).json({message: 'Erro ao retornar turmas: ' + e.message});
        }
    }

    async getId(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Id é obrigatório'})
        }

        try {
            const turma = await prisma.turma.findUnique({
                where: {
                    id: Number(id),
                },
                include: {
                    Curso: {
                        select: {
                            descricao: true
                        }
                    }
                }
            })
            if (!turma) {
                return res.status(404).json({message: 'Não encontrado nenhum registro desta turma'})
            }

            return res.status(200).json(turma)
        } catch (e) {
            console.log('Erro ao retornar turma: ' + e.message)
            return res.status(500).json({message: 'Erro ao retornar turma: ' + e.message})
        }
    };

    async cadastro(req, res) {
        let {semestre_curso, id_curso} = req.body
        try {
            //Verifica se veio todas as informações
            if (!semestre_curso || !id_curso) {
                return res.status(400).json({ message: 'Os campos semestre_curso e id_curso são obrigatórios.' });
            }

            id_curso = Number(id_curso);
            semestre_curso = Number(semestre_curso);

            // Verifica se o curso existe
            const curso = await prisma.curso.findUnique({
                where: { 
                    id: id_curso
                },
            });
            if (!curso) {
                return res.status(404).json({ message: 'Curso não encontrado.' });
            }


            const turma = await prisma.turma.findFirst({
                where: {
                    id_curso: id_curso,
                    semestre_curso: semestre_curso
                }
            })
            if (turma) {
                console.log(turma)
                return res.status(409).json({message: 'Já existe uma turma deste curso neste semestre'})
            }
            
            const createTurmas = await prisma.turma.create({ 
                data: {
                    semestre_curso: semestre_curso,
                    Curso: {
                        connect: {id: id_curso}
                    } 
                }
            });
            return res.status(201).json(createTurmas);
        } catch (e) {
            console.log('Erro ao criar turma: ' + e.message)
            return res.status(500).json({ message: 'Erro ao criar turma: ' + e.message });
        }
    }

    async alterar(req, res) {
        const { id, id_curso } = req.body;
        const dataToUpdate = req.body;
        delete dataToUpdate.id;
    
        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }

        try {
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
    
            const updateTurmas = await prisma.turma.update({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate, 
            });
    
            if (!updateTurmas) {
                return res.status(404).json({ message: 'Turma não encontrada.' });
            }
    
            return res.status(200).json({ message: 'Turma alterada com sucesso.' });
        } catch (e) {
            console.log('Erro ao alterar turma: ' + e.message)
            return res.status(500).json({ message: 'Erro ao alterar turma: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Id é obrigatório.'})
        }

        try {

            const turma = await prisma.turma.findUnique({
                where: { 
                    id: Number(id)
                },
            });
            if (!turma) {
                return res.status(404).json({ message: 'Turma não encontrada.' });
            }

            const deleteTurma = await prisma.turma.delete({
                where: { 
                    id: Number(id), 
                },
            })
            if (!deleteTurma) {
                return res.status(404).json({ message: 'Turma não encontrada para deletar.' });
            }

            return res.status(200).json({message: 'Turma deletada com sucesso.'})
        } catch (e) {
            console.log('Erro ao deletar turma: ' + e.message)
            return res.status(500).json({message: 'Erro ao deletar turma: ' + e.message})
        }
    }
}
export { turmasController };
