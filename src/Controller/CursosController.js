import { prisma } from "../prisma.js";

class cursosController {
    async getAll(req, res) { 
        try {
            const cursos = await prisma.curso.findMany()
            if (cursos.length === 0) {
                return res.status(204).end();
            }

            return res.status(200).json(cursos);
        } catch (e) {
            console.log('Erro ao retornar cursos: ' + e.message)
            return res.status(500).json({ message: 'Erro ao retornar cursos: ' + e.message });
        }
    }

    async getId(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Id é obrigatório'})
        }

        try {
            const curso = await prisma.curso.findUnique({
                where: {
                    id: Number(id),
                },
            })
            if (!curso) {
                return res.status(404).json({ message: 'Curso não encontrado.' }); 
            }

            return res.status(200).json(curso)
        } catch (e) {
            console.log('Erro ao retornar curso: ' + e.message)
            return res.status(500).json({ message: 'Erro ao retornar curso: ' + e.message })
        }
    };

    async cadastro(req, res) {
        const {descricao, qtd_semestres} = req.body;

        if (!descricao || !qtd_semestres) {
            return res.status(400).json({ message: 'Os campos descricao e qtd_semestres são obrigatórios.' });
        }

        if (Number(qtd_semestres) > 12) {
            req.body.qtd_semestres = 12
        } else if (Number(qtd_semestres) < 4) {
            req.body.qtd_semestres = 4
        }

        try {
            const createCursos = await prisma.curso.create({ data: req.body });
            return res.status(201).json(createCursos);
        } catch (e) {
            console.log('Erro ao criar curso: ' + e.message)
            return res.status(500).json({ message: 'Erro ao criar curso: ' + e.message });
        }
    }

    async alterar(req, res) {
        const { id, qtd_semestres } = req.body;
        const dataToUpdate = req.body;
        delete dataToUpdate.id;
    
        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }

        if (Number(qtd_semestres) > 12) {
            req.body.qtd_semestres = 12
        } else if (Number(qtd_semestres) < 4) {
            req.body.qtd_semestres = 4
        }
    
        try {
            delete dataToUpdate.id;
            const updateCursos = await prisma.curso.update({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate,
            });
            if (!updateCursos) {
                return res.status(404).json({ message: 'Curso não encontrado.' });
            }
    
            return res.status(200).json({ message: 'Curso alterado com sucesso.' });
        } catch (e) {
            console.log('Erro ao alterar curso: ' + e.message)
            return res.status(500).json({ message: 'Erro ao alterar curso: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Id é obrigatório'})
        }

        try {
            const curso = await prisma.curso.findUnique({
                where: { 
                    id: Number(id)
                },
            });
            if (!curso) {
                return res.status(404).json({ message: 'Curso não encontrado.' });
            }

            const deleteCurso = await prisma.curso.delete({
                where: { 
                    id: Number(id), 
                },
            })
            if (!deleteCurso) {
                return res.status(404).json({ message: 'Curso não encontrado para deletar.' });
            }

            return res.status(200).json({ message: 'Curso deletado com sucesso.' })
        } catch (e) {
            console.log('Erro ao deletar curso: ' + e.message)
            return res.status(500).json({ message: 'Erro ao deletar curso: ' + e.message })
        }
    }
}
export { cursosController };
