import { prisma } from "../prisma.js";

// Tabela referente ao vinculo de matérias que o professor irá reger no semestre do ano (/1 ou /2)

class semestreDisciplinasController {
    async getAll(req, res) { 
        try {
            const semestreDisciplinas = await prisma.semestreProfessorDisciplinas.findMany({
                orderBy: {
                    id: 'asc'
                }
            })
            if (semestreDisciplinas.length === 0) {
                return res.status(204).end();
            }
            
            return res.status(200).json(semestreDisciplinas);
        } catch (e) {
            console.log('Erro ao retornar inculos de disciplina, semestre e professor: ' + e.message)
            return res.status(500).json({ message: 'Erro ao retornar os vinculos de disciplina, semestre e professor: ' + e.message });
        }
    }

    //Get de acordo com o ID do semestre do ano
    async getId(req, res) {
        const { id_semestre } = req.params;

        if (!id_semestre) {
            return res.status(400).json({ message: 'Id_semestre é obrigatório.'})
        }

        try {

            const semestre = await prisma.semestre.findUnique({
                where: {
                    id: Number(id_semestre)
                }
            })
            if (!semestre) {
                    return res.status(404).json({ message: 'Semestre não encontrado'})
            }

            const semestreDisciplinas = await prisma.semestreProfessorDisciplinas.findMany({
                where: {
                    id_semestre: Number(id_semestre),
                },
            });
            if (semestreDisciplinas.length === 0) {
                return res.status(404).json({ message: 'Nenhum vinculo de disciplina encontrado deste semestre.' }); 
            }

            return res.status(200).json(semestreDisciplinas)
        } catch (e) {
            console.log('Erro ao retornar disciplinas do semestre: ' + e.message)
            return res.status(500).json({ message: 'Erro ao retornar disciplinas do semestre: ' + e.message })
        }
    };



    async cadastro(req, res) {
        try {
            const { id_disciplina, id_professor, id_semestre } = req.body;

            //Verifica se veio todas as informações
            if (!id_disciplina || !id_professor || !id_semestre) {
                return res.status(400).json({ message: 'Os campos id_disciplina, id_professor e id_semestre são obrigatórios.' });
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

            // Verifica se o usuario existe e é um professor
            const professor = await prisma.usuario.findUnique({
                where: { 
                    id: Number(id_professor) 
                },
            });
            if (!professor) {
                return res.status(404).json({ message: 'Não encontrado usuario com o ID ' + id_professor });
            }
            if (professor.tipo !== 1) {
                return res.status(400).json({ message: 'Usuário não é um professor.' });
            }

            // Verifica se o semestre existe
            const semestre = await prisma.semestre.findUnique({
                where: { 
                    id: Number(id_semestre) 

                },
            });
            if (!semestre) {
                return res.status(404).json({ message: 'Semestre não encontrado.' });
            }

            const disciplinaSemestre = await prisma.semestreProfessorDisciplinas.findFirst({
                where: {
                    id_disciplina: Number(id_disciplina),
                    id_semestre: Number(id_semestre)
                }
            })
            if (disciplinaSemestre) {
                return res.status(400).json({ message: 'Essa disciplina já está sendo regida neste semestre' })
            }

            const createSemestreDisciplinas = await prisma.semestreProfessorDisciplinas.create({
            data: {
                Disciplina: {
                    connect: { id: id_disciplina }
                },
                Professor: {
                    connect: { id: id_professor } 
                },
                Semestre: {
                    connect: { id: id_semestre } 
                }
            }
        });

            return res.status(201).json(createSemestreDisciplinas);
        } catch (e) {
            console.log('Erro ao alterar vinculo semestre_disciplina: ' + e.message)
            return res.status(500).json({ message: 'Erro ao criar semestre_disciplina: ' + e.message });
        }
    }

    async alterar(req, res) {
        const { id, id_disciplina, id_professor, id_semestre } = req.body;
        const dataToUpdate = req.body;
        delete dataToUpdate.id;
    
        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }
    
        try {
            if (id_disciplina){
                const disciplina = await prisma.disciplina.findUnique({
                where: { 
                    id: Number(id_disciplina) 
                },
                });
                if (!disciplina) {
                    return res.status(404).json({ message: 'Disciplina não encontrada.' });
                }
            }
            if (id_professor) {
                const professor = await prisma.usuario.findUnique({
                where: { 
                    id: Number(id_professor) 
                },
                });
                if (!professor) {
                    return res.status(404).json({ message: 'Não encontrado usuario com o ID ' + id_professor });
                }
                if (professor.tipo !== 1) {
                    return res.status(400).json({ message: 'Usuário não é um professor.' });
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

            delete dataToUpdate.id;
            const updateSemestreDisciplinas = await prisma.semestreProfessorDisciplinas.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate,  // Passa diretamente o req.body
            });
    
            if (updateSemestreDisciplinas.count === 0) {
                return res.status(404).json({ message: 'Vinculo semestre_disciplina não encontrado.' });
            }
    
            return res.status(200).json({ message: 'Vinculo semestre_disciplina alterado com sucesso.' });
        } catch (e) {
            console.log('Erro ao alterar vinculo semestre_disciplina: ' + e.message)
            return res.status(500).json({ message: 'Erro ao alterar vinculo semestre_disciplina: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id } = req.params;
        try {

            const semestreProfessorDisciplina = await prisma.semestreProfessorDisciplinas.findUnique({
                where: { 
                    id: Number(id)
                },
            });
            if (!semestreProfessorDisciplina) {
                return res.status(404).json({ message: 'SemestreDisciplinas não encontrada.' });
            }

            const deleteSemestreDisciplina = await prisma.semestreProfessorDisciplinas.delete({
                where: { 
                    id: Number(id), 
                },
            })
            if (!deleteSemestreDisciplina) {
                return res.status(404).json({ message: 'Nenhum vínculo encontrado para deletar.' });
            }

            return res.status(200).json({ message: 'Semestre deletado com sucesso.' })
        } catch (e) {
            console.log('Erro ao deletar semestre_disciplina: ' + e.message)
            return res.status(500).json({ message: 'Erro ao deletar semestre_disciplina:' + e.message })
        }
    }

    async disciplinaProfessor(req, res) {
        const {id_professor, id_semestre} = req.query;

        if (!id_professor) {
            return res.status(400).json({ message: 'Id_professor é obrigatório.'})
        }

        try{
            const professor = await prisma.usuario.findUnique({
                where: { 
                    id: Number(id_professor) 
                },
            });
            if (!professor) {
                return res.status(404).json({ message: 'Não encontrado usuario com o ID ' + id_professor });
            }
            if (professor.tipo !== 1) {
                return res.status(401).json({ message: 'Usuário não é um professor.' });
            }

            let semestre;
            if(id_semestre) {
                semestre = await prisma.semestre.findUnique({
                    where: { 
                        id: Number(id_semestre)
                    },
                });
                if (!semestre) {
                    return res.status(404).json({ message: 'Semestre não encontrado.' });
                }
            } else {
                semestre = await prisma.semestre.findFirst({
                    where: { 
                        padrao: 0
                    },
                });
                if (!semestre) {
                    return res.status(404).json({ message: 'Semestre não encontrado.' });
                }
            }

            const dps = await prisma.semestreProfessorDisciplinas.findMany({ //Pegar todas as disciplinas que o professor irá aplicar no semestre
                where: {
                    id_professor: Number(id_professor),
                    id_semestre: Number(semestre.id)
                },
                include: {
                    Disciplina: true, // Trazer detalhes da disciplina,
                    Semestre: true
                }
            })
            if(dps.length === 0){
                return res.status(404).json({ message: 'Nenhuma disciplina atribuída ao professor neste semestre.' })
            }

            const disciplinas = dps.map((d) => ({
                id: d.id_disciplina,
                descricao: d.Disciplina.descricao,
                carga_horaria: d.Disciplina.carga_horario,
                id_semestre: d.id_semestre,
                semestre: d.Semestre.descricao
            }));
            return res.status(200).json(disciplinas)
        } catch (e) {
            console.log('Erro ao consultar disciplinas: ' + e.message)
            return res.status(500).json({ message: 'Erro ao consultar disciplinas: ' + e.message });
        }
    }
}
export { semestreDisciplinasController };
