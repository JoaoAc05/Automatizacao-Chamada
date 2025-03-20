import { prisma } from "../prisma.js";

class chamadasController {
    async getAll(req, res) { 
        try {
            const chamadas = await prisma.chamada.findMany()
            
            res.status(200).json(chamadas);
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar chamadas: ' + e.message});
        }
    }

    async getId(req, res) {
        const { id } = req.params;
        try {
            const chamada = await prisma.chamada.findUnique({
                where: {
                    id: Number(id),
                },
            })
            if (chamada.length === 0) {
                return res.status(404).json({ message: 'Chamada não encontrada.' }); 
            }

            res.status(200).json(chamada)
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar chamada: ' + e.message})
        }
    };

    async cadastro(req, res) {
        const {id_professor, id_disciplina, data_hora_inicio} = req.body
        try {
            //Verifica se veio todas as informações
            if (!id_professor || !id_disciplina || !data_hora_inicio) {
                return res.status(400).json({ message: 'Os campos id_professor, id_disciplina, id_semestre e data_hora_inicio são obrigatórios.' });
            }

            // Verifica se o professor existe
            const professor = await prisma.usuario.findUnique({
                where: { 
                    id: Number(id_professor)
                },
            });
            if (!professor) {
                return res.status(404).json({ message: 'Usuario não encontrado.' });
            }
            if (professor.tipo !== 1) {
                return res.status(400).json({ message: 'Usuário informado não é um professor'})
            }

            // Verifica se a disciplina existe
            const disciplina = await prisma.disciplina.findUnique({
                where: { 
                    id: Number(id_disciplina) 
                },
            });
            if (!disciplina) {
                return res.status(404).json({ message: 'Disciplina não encontrada.' });
            }

            const semestre = await prisma.semestre.findFirst({
                where: {padrao: 0}
            })
            console.log(semestre.id);
            if (!semestre) {
                return res.status(404).json({ message: 'Semestre não encontrado.' });
            } 
            
            const createChamadas = await prisma.chamada.create({ 
                data: {
                    Professor: {
                        connect: {id: Number(id_professor)}
                    },
                    Disciplina: {
                        connect: {id: Number(id_disciplina)}
                    } ,
                    Semestre: {
                        connect: {id: Number(semestre.id)}
                    },
                    data_hora_inicio: data_hora_inicio
                }
                
            });
            res.status(201).json(createChamadas);
        } catch (e) {
            res.status(500).json({ message: 'Erro ao criar chamada: ' + e.message });
        }
    }

    async alterar(req, res) {
        const { id } = req.body;
        const {id_professor, id_disciplina, id_semestre} = req.body
        const dataToUpdate = req.body;
    
        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }

        if (!id) {
            return res.status(400).josn({ message: 'O campo id é obrigatório'})
        }

        if (id_professor) {
            const professor = await prisma.usuario.findUnique({
                where: { 
                    id: Number(id_professor)
                },
            });
            if (!professor) {
                return res.status(404).json({ message: 'Usuario não encontrado.' });
            }
            if (professor.tipo !== 1) {
                return res.status(400).json({ message: 'Usuário informado não é um professor.'})
            }
        }
        
        if (id_disciplina) {
            const disciplina = await prisma.disciplina.findUnique({
                where: { 
                    id: Number(id_disciplina) 
                },
            });
            if (!disciplina) {
                return res.status(404).json({ message: 'Disciplina não encontrada.' });
            }
        }

        if (id_semestre) {
            const semestre = await prisma.semestre.findUnique({
                where: { 
                    id: Number(id_semestre) 
                },
            });
            if (!semestre) {
                return res.status(404).json({ message: 'Semestre não encontrado.' });
            }
        }

        try {
            const updateChamadas = await prisma.chamada.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate, 
            });
    
            if (updateChamadas.count === 0) {
                return res.status(404).json({ message: 'Chamada não encontrada.' });
            }
    
            res.status(200).json({ message: 'Chamada alterada com sucesso.' });
        } catch (e) {
            res.status(500).json({ message: 'Erro ao alterar chamada: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id } = req.params;
        try {
            const deleteTurmas = await prisma.chamada.deleteMany({
                where: { 
                    id: Number(id), 
                },
            })
            res.status(200).json({message: 'Chamada deletado com sucesso.'})
        } catch (e) {
            res.status(500).json({message: 'Erro ao deletar chamada.' + e.message})
        }
    }

    async finalizarChamada(req, res) {
        const {id, data_hora_final} = req.body

        if (!data_hora_final || !id) {
            return res.status(400).json({ message: 'Os dados id e data_hora_final são obrigatórios.' });
        }

        try {
            const chamada = await prisma.chamada.findUnique({
                where: {
                    id: Number(id),
                },
            });
            if (!chamada) {
                return res.status(404).json({message: 'Chamada não encontrada para ser finalizada.'})
            }
            console.log("Hora final da chamada: " + chamada.data_hora_final)
            if (chamada.data_hora_final != null){
                console.log("Chamada finalizada?")
                return res.status(400).json({message: 'Chamada já finalizada.'})
            }

            const updateChamadas = await prisma.chamada.updateMany({
                where: {
                    id: Number(id),
                },
                data: {
                    data_hora_final: data_hora_final
                },  
            });
            res.status(200).json({message: 'Chamada finalizada com sucesso.'})
        } catch (e) {
            res.status(500).json({error: 'Erro ao finalizar chamada: ' + e.message})
        }
    }

    async chamadaProfessor(req, res) {
        const { id_professor } = req.params;
        try {
            if (id_professor) {
                const professor = await prisma.usuario.findUnique({
                    where: {
                        id: Number(id_professor)
                    }
                })
                if (!professor) {
                    return res.status(404).json({message: 'Professor não encontrado'})
                }
                if(professor.tipo !== 1) {
                    return res.status(401).json({message: 'Usuário não é um professor.'});
                }
            }

            const chamadas = await prisma.chamada.findMany({
                where: {
                    id_professor: Number(id_professor),
                },
                include: {
                    Disciplina: true // Trazer detalhes da disciplina
                }
            })
            if (chamadas.length === 0) {
                return res.status(404).json({ message: 'Chamadas do professor não encontradas.' }); 
            }

            const chamadaProfessor = chamadas.map((c) => ({
                id: Number(c.id),
                id_disciplina: Number(c.id_disciplina),
                descricao: c.Disciplina.descricao,
                id_professor: Number(c.id_professor),
                id_semestre: Number(c.id_semestre),
                data_hora_inicio: c.data_hora_inicio,
                data_hora_final: c.data_hora_final
            }));

            console.log(chamadaProfessor) // LOG TESTE

            res.status(200).json(chamadaProfessor)
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar chamadas do professor: ' + e.message})
        }
    }
}
export { chamadasController };
