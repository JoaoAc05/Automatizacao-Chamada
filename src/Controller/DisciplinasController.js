import { prisma } from "../prisma.js";

class disciplinasController {
    async getAll(req, res, next) { 
        try {
            const disciplinas = await prisma.disciplina.findMany()

            res.status(200).json(disciplinas);
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar disciplinas: ' + e.message});
        }
    }

    async getId(req, res, next) {
        const { id } = req.params;
        try {
            const disciplina = await prisma.disciplina.findUnique({
                where: {
                    id: Number(id),
                },
            })

            res.status(200).json(disciplina)
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar disciplina: ' + e.message})
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
                where: { id: id_curso },
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
            res.status(201).json(createDisciplinas);
        } catch (e) {
            res.status(500).json({ message: 'Erro ao criar disciplina: ' + e.message });
        }
    }

    async alterar(req, res, next) {
        const { id } = req.body;
        const dataToUpdate = req.body;
    
        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' });
        }
    
        try {
            const updateDisciplinas = await prisma.disciplina.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate,  // Passa diretamente o req.body
            });
    
            if (updateDisciplinas.count === 0) {
                return res.status(404).json({ message: 'Disciplina não encontrado.' });
            }
    
            res.status(200).json({ message: 'Displina alterado com sucesso.' });
        } catch (e) {
            res.status(500).json({ message: 'Erro ao alterar disciplina: ' + e.message });
        }
    }

    async deletar(req, res, next) {
        const { id } = req.params;
        try {
            const deleteDisciplinas = await prisma.disciplina.deleteMany({
                where: { 
                    id: Number(id), 
                },
            })
            res.status(200).json({sucesso: 'Disciplina deletado com sucesso.'})
        } catch (e) {
            res.status(500).json({error: 'Erro ao deletar disciplina.' + e.message})
        }
    }
}
export { disciplinasController };
