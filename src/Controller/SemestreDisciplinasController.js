import { prisma } from "../prisma.js";

// Tabela referente ao vinculo de matérias que o professor irá reger no semestre do ano (/1 ou /2)

class semestreDisciplinasController {
    async getAll(req, res) { 
        try {
            const semestreDisciplinas = await prisma.semestreProfessorDisciplinas.findMany()

            if (semestreDisciplinas.length === 0) {
                return res.status(404).json({ message: 'Nenhum vinculo encontrado.' }); 
            }
            
            res.status(200).json(semestreDisciplinas);
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar os vinculos de disciplina, semestre e professor: ' + e.message});
        }
    }

    //Get de acordo com o ID do semestre do ano
    async getId(req, res) {
        const { id_semestre } = req.params;
        try {
            const semestreDisciplinas = await prisma.semestreProfessorDisciplinas.findMany({
                where: {
                    id_semestre: Number(id_semestre),
                },
            });
            if (semestreDisciplinas.length === 0) {
                return res.status(404).json({ message: 'Nenhum vinculo de disciplina encontrado deste semestre.' }); 
            }

            res.status(200).json(semestreDisciplinas)
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar disciplinas do semestre: ' + e.message})
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
                where: { id: id_disciplina },
            });
            if (!disciplina) {
                return res.status(404).json({ message: 'Disciplina não encontrada.' });
            }

            // Verifica se o usuario existe e é um professor
            const professor = await prisma.usuario.findUnique({
                where: { id: id_professor },
            });
            if (!professor) {
                return res.status(404).json({ message: 'Não encontrado usuario com o ID ' + id_professor });
            }
            if (professor.tipo !== 1) {
                return res.status(400).json({ message: 'Usuário não é um professor.' });
            }

            // Verifica se o semestre existe
            const semestre = await prisma.semestre.findUnique({
                where: { id: id_semestre },
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
                return res.status(401).json({message: 'Essa disciplina já está sendo regida neste semestre'})
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

            res.status(201).json(createSemestreDisciplinas);
        } catch (e) {
            res.status(500).json({ message: 'Erro ao criar semestreDisciplinas: ' + e.message });
        }
    }

    async alterar(req, res) {
        const { id } = req.body;
        const dataToUpdate = req.body;
    
        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
        }
    
        try {
            const updateSemestreDisciplinas = await prisma.semestreProfessorDisciplinas.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate,  // Passa diretamente o req.body
            });
    
            if (updateSemestreDisciplinas.count === 0) {
                return res.status(404).json({ message: 'Vinculo semestre_disciplina não encontrado.' });
            }
    
            res.status(200).json({ message: 'Vinculo semestre_disciplina alterado com sucesso.' });
        } catch (e) {
            res.status(500).json({ message: 'Erro ao alterar vinculo semestre_disciplina: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id } = req.params;
        try {
            const deleteSemestreDisciplinas = await prisma.semestreProfessorDisciplinas.deleteMany({
                where: { 
                    id: Number(id), 
                },
            })
            res.status(200).json({sucesso: 'Semestre deletado com sucesso.'})
        } catch (e) {
            res.status(500).json({error: 'Erro ao deletar semestreDisciplinas:' + e.message})
        }
    }
}
export { semestreDisciplinasController };
