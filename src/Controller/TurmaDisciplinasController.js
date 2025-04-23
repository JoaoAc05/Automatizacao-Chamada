import { prisma } from "../prisma.js";

class turmaDisciplinasController {
    async getAll(req, res) { 
        try {
            const turmas = await prisma.turmaDisciplinas.findMany()
            if (turmas.length === 0) {
                return res.status(204).end();
            }

            return res.status(200).json(turmas);
        } catch (e) {
            return res.status(500).json({message: 'Erro ao retornar vinculo turma alunos: ' + e.message});
        }
    }

    async getId(req, res) {
        const { id_turma } = req.params;

        if (!id_turma) {
            return res.status(400).json({ message: 'Id_turma é obrigatório.'})
        }

        try {
            const turma = await prisma.turma.findUnique({
                where: {
                    id: Number(id_turma)
                }
            })
            if (!turma) {
                return res.status(404).json({ message: 'Turma não encontrada.'})
            }


            const turmaDisc = await prisma.turmaDisciplinas.findMany({
                where: {
                    id_turma: Number(id_turma),
                },
            })
            if (turmaDisc.length === 0) {
                return res.status(404).json({message: 'Não encontrado nenhum registro de disciplina desta turma'})
            }

            return res.status(200).json(turmaDisc)
        } catch (e) {
            return res.status(500).json({message: 'Erro ao retornar disciplinas da turma: ' + e.message})
        }
    };

    async cadastro(req, res) {
        const {id_turma, id_disciplina, id_semestre} = req.body
        try {
            //Verifica se veio todas as informações
            if (!id_turma || !id_disciplina || !id_semestre) {
                return res.status(400).json({ message: 'Os campos id_turma, id_disciplina e id_semestre são obrigatórios.' });
            }

            // Verifica se a turma existe
            const turma = await prisma.turma.findUnique({
                where: { 
                    id: Number(id_turma) 
                },
            });
            if (!turma) {
                return res.status(404).json({ message: 'Turma não encontrada.' });
            }

            const disciplina = await prisma.disciplina.findUnique({
                where: {
                    id: Number(id_disciplina)
                }
            })
            if (!disciplina) {
                return res.status(404).json({message: 'Disciplina não encontrada'})
            }

            const semestre = await prisma.semestre.findUnique({
                where: {
                    id: Number(id_semestre)
                }
            })
            if (!semestre) {
                return res.status(404).json({message: 'Semestre não encontrado'})
            }

            const disciplinaTurma = await prisma.turmaDisciplinas.findFirst({
                where: {
                    id_disciplina: Number(id_disciplina),
                    id_turma: Number(id_turma),                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                    id_semestre: Number(id_semestre)
                }
            })
            if (disciplinaTurma) {
                return res.status(400).json({message: 'Esta disciplina já está vinculada a está turma neste semestre'})
            }

            const createTurmaDisicplinas = await prisma.turmaDisciplinas.create({ 
                data: {
                    Disciplina: {
                        connect: {id: id_disciplina}
                    },
                    Turma: {
                        connect: {id: id_turma}
                    },
                    Semestre: {
                        connect: {id: id_semestre}
                    }
                }
            });
            return res.status(201).json(createTurmaDisicplinas);
        } catch (e) {
            return res.status(500).json({ message: 'Erro ao criar vinculo de disciplina na turma: ' + e.message });
        }
    }

    async alterar(req, res) {
        const {id_turma, id_disciplina, id_semestre, id} = req.body
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
                return res.status(404).json({ message: 'Turma não encontrado.' });
            }
        }

        if(id_disciplina) {
            const disciplina = await prisma.disciplina.findUnique({
            where: {
                id: Number(id_disciplina)
            }
            })
            if (!disciplina) {
                return res.status(404).json({message: 'Disciplina não encontrada'})
            }

        }
        
        if (id_semestre) {
            const semestre = await prisma.semestre.findUnique({
            where: {
                id: Number(id_semestre)
            }
            })
            if (!semestre) {
                return res.status(404).json({message: 'Semestre não encontrado'})
            }
        }
    
        try {
            delete dataToUpdate.id;
            const updateTurmaDisciplinas = await prisma.turmaDisciplinas.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate,
            });
            if (updateTurmaDisciplinas.count === 0) {
                return res.status(404).json({ message: 'Vinculo Disciplina Turma não encontrado.' });
            }
    
            return res.status(200).json({ message: 'Vinculo Disciplina Turma alterado com sucesso.' });
        } catch (e) {
            return res.status(500).json({ message: 'Erro ao alterar vinculo disciplina turma: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id_disciplina, id_turma, id_vinculo } = req.query;
        
        if (!id_turma && !id_disciplina && !id_vinculo) {
            return res.status(400).json({ message: 'Nenhum parâmetro informado.'})
        }

        try {

            if (id_vinculo) {
                const disciplinaTurma = await prisma.turmaDisciplinas.findUnique({
                    where: {
                        id: Number(id_vinculo)
                    }
                })
                if (!disciplinaTurma) {
                    return res.status(404).json({ message: 'Não existe vinculo com esse id' })
                }

                const deleted = await prisma.turmaDisciplinas.delete({
                    where: {
                        id: Number(id_vinculo)
                    }
                });
                if (!deleted) {
                    return res.status(404).json({ message: 'Nenhum vínculo encontrado para deletar.' });
                }
                
                return res.status(200).json({message: 'Vinculo Disciplina-Turma deletado com sucesso.'})
            }
            
            const deleteWhere = {};
            if (id_disciplina) {
                const disciplina = await prisma.disciplina.findUnique({
                    where: {
                        id: Number(id_disciplina)
                    }
                })
                if (!disciplina) {
                    return res.status(404).json({ message: 'Disciplina não encontrada.'})
                }

                const disciplinaTurma = await prisma.turmaDisciplinas.findFirst({
                    where: {
                        id_disciplina: Number(id_disciplina)
                    }
                })
                if (!disciplinaTurma) {
                    return res.status(404).json({ message: 'Esta disciplina não pertence a nenhuma turma' })
                }
                deleteWhere.id_disciplina = Number(id_disciplina); 
            }

            if (id_turma){
                const turma = await prisma.turma.findUnique({
                    where: {
                        id: Number(id_turma)
                    }
                })
                if (!turma) {
                    return res.status(404).json({ message: 'Turma não encontrada'})
                }

                const disciplinaTurma = await prisma.turmaDisciplinas.findFirst({
                    where: {
                        id_turma: Number(id_turma)
                    }
                })
                if (!disciplinaTurma) {
                    return res.status(404).json({ message: 'Esta turma não possui nenhuma disciplina' })
                }
                deleteWhere.id_turma = Number(id_turma);
            }
                
            const deleted = await prisma.turmaDisciplinas.deleteMany({
                where: deleteWhere
            });
            if (deleted.count === 0) {
                return res.status(404).json({ message: 'Nenhum vínculo encontrado para deletar.' });
            }

            return res.status(200).json({message: `${deleted.count} vínculo(s) Disciplina-Turma deletado(s) com sucesso.`})
            
            } catch (e) {
                return res.status(500).json({message: 'Erro ao deletar vinculo Disciplina-Turma: ' + e.message})
            }
    }
}
export { turmaDisciplinasController };
