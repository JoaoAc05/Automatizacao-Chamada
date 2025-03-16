import { prisma } from "../prisma.js";

class cursosController {
    async getAll(req, res) { 
        try {
            const cursos = await prisma.curso.findMany()

            res.status(200).json(cursos);
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar cursos: ' + e.message});
        }
    }

    async getId(req, res) {
        const { id } = req.params;
        try {
            const curso = await prisma.curso.findUnique({
                where: {
                    id: Number(id),
                },
            })
            if (curso.length === 0) {
                return res.status(404).json({ message: 'Curso não encontrado.' }); 
            }

            res.status(200).json(curso)
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar curso: ' + e.message})
        }
    };

    async cadastro(req, res) {
        const {descricao} = req.body.descricao;
        const {qtd_semestres} = req.body.qtd_semestres;

        if (!descricao || !qtd_semestres) {
            console.log(descricao + " " + qtd_semestres)
            return res.status(400).json({ message: 'Os campos descricao e qtd_semestres são obrigatórios.' });
        }

        try {
            const createCursos = await prisma.curso.create({ data: req.body });
            res.status(201).json(createCursos);
        } catch (e) {
            res.status(500).json({ message: 'Erro ao criar curso: ' + e.message });
        }
    }

    async alterar(req, res) {
        const { id } = req.body;
        const dataToUpdate = req.body;
    
        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }
    
        try {
            const updateCursos = await prisma.curso.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate,
            });
    
            if (updateCursos.count === 0) {
                return res.status(404).json({ message: 'Curso não encontrado.' });
            }
    
            res.status(200).json({ message: 'Curso alterado com sucesso.' });
        } catch (e) {
            res.status(500).json({ message: 'Erro ao alterar curso: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id } = req.params;
        try {
            const deleteCursos = await prisma.curso.deleteMany({
                where: { 
                    id: Number(id), 
                },
            })
            res.status(200).json({message: 'Curso deletado com sucesso.'})
        } catch (e) {
            res.status(500).json({message: 'Erro ao deletar curso: ' + e.message})
        }
    }
}
export { cursosController };
