import { prisma } from "../prisma.js";

class disciplinasController {
    async getAll(req, res, next) { 
        try {
            const disciplinas = await prisma.disciplina.findMany({
                include: {
                    Curso: {
                        select: {
                            descricao: true
                        }
                    }
                },
                orderBy: {
                    id: 'asc'
                }
            })
            if (disciplinas.length === 0) {
                return res.status(204).end();
            }

            // const disciplinasFormatado = disciplinas.map((d) => ({
            //     id: Number(d.id),
            //     descricao: p.descricao,
            //     id_curso: Number(p.id_curso),
            //     carga_horario: Number(p.carga_horario),
            //     status: Number(p.status),
            //     curso: p.Curso.descricao
            // }));

            return res.status(200).json(disciplinas);
        } catch (e) {
            console.log('Erro ao retornar disciplinas: ' + e.message)
            return res.status(500).json({ message: 'Erro ao retornar disciplinas: ' + e.message });
        }
    }

    async getId(req, res, next) {
        // const { id } = req.params;   
        const {id, id_curso} = req.query;

        if (!id || !id_curso) { 
            return res.status(400).json({ message: 'Parâmetro de busca não informado.'})
        }

        try {
            
            if (id) {
                const disciplina = await prisma.disciplina.findUnique({
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
                if (!disciplina) {
                    return res.status(404).json({ message: 'Disciplina não encontrada.' }); 
                }

                return res.status(200).json(disciplina)
            }

            const curso = await prisma.curso.findUnique({
                where: {
                    id: Number(id_curso),
                }
            })
            if (!curso) {
                return res.status(404).json({ message: 'Curso não encontrado.' }); 
            }

            const disciplinaCurso  = await prisma.disciplina.findMany({
                where: {
                    id_curso: Number(id_curso),
                    status: 0 // Ativa
                },
                include: {
                    Curso: {
                        select: {
                            descricao: true
                        }
                    }
                }
            })
            if (disciplinaCurso.length === 0) {
                return res.status(404).json({ message: 'Disciplinas não encontradas.' }); 
            }

            return res.status(200).json(disciplinaCurso)

        } catch (e) {
            console.log('Erro ao retornar disciplina: ' + e.message)
            return res.status(500).json({ message: 'Erro ao retornar disciplina: ' + e.message })
        }
    };

    async cadastro(req, res, next) {
        const { descricao, id_curso, carga_horario } = req.body;
        try {
            //Verifica se veio todas as informações
            if (!descricao || !id_curso || !carga_horario) {
                return res.status(400).json({ message: 'Os campos descricao, id_curso e carga_horario são obrigatórios.' });
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

            const createDisciplinas = await prisma.disciplina.create({
                data: {
                    descricao: descricao,
                    Curso: {
                        connect: { id: id_curso } 
                    },
                    carga_horario: carga_horario
                }
            });
            return res.status(201).json(createDisciplinas);
        } catch (e) {
            console.log('Erro ao criar disciplina: ' + e.message)
            return res.status(500).json({ message: 'Erro ao criar disciplina: ' + e.message });
        }
    }

    async alterar(req, res, next) {
        const { id } = req.body;
        const dataToUpdate = req.body;
        delete dataToUpdate.id;
    
        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }
    
        try {
            delete dataToUpdate.id;
            const updateDisciplinas = await prisma.disciplina.update({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate, 
            });
    
            if (!updateDisciplinas) {
                return res.status(404).json({ message: 'Disciplina não encontrado.' });
            }
    
            return res.status(200).json({ message: 'Displina alterado com sucesso.' });
        } catch (e) {
            console.log('Erro ao alterar disciplina: ' + e.message)
            return res.status(500).json({ message: 'Erro ao alterar disciplina: ' + e.message });
        }
    }

    async deletar(req, res, next) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Id é obrigatório.'})
        }

        try {
            const disciplina = await prisma.disciplina.findUnique({
                where: { 
                    id: Number(id)
                },
            });
            if (!disciplina) {
                return res.status(404).json({ message: 'Disciplina não encontrada.' });
            }

            const deleteDisciplina = await prisma.disciplina.delete({
                where: { 
                    id: Number(id), 
                },
            })
            if (!deleteDisciplina) {
                return res.status(404).json({ message: 'Nenhuma disciplina encontrada para deletar.'})
            }

            return res.status(200).json({ message: 'Disciplina deletado com sucesso.' })
        } catch (e) {
            console.log('Erro ao deletar disciplina: ' + e.message)
            return res.status(500).json({ message: 'Erro ao deletar disciplina: ' + e.message })
        }
    }
}
export { disciplinasController };
