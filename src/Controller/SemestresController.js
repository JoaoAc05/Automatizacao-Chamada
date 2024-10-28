import { prisma } from "../prisma.js";

class semestresController {
    async getAll(req, res, next) { 
        try {
            const semestres = await prisma.semestre.findMany()
            if (!semestres) {
                return res.status(404).json({message: 'Nenhum registro encontrado'})
            }

            res.status(200).json(semestres);
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar semestres: ' + e.message});
        }
    }

    async getId(req, res, next) {
        const { id } = req.params;
        try {
            const semestre = await prisma.semestre.findUnique({
                where: {
                    id: Number(id),
                },
            })
            if (!semestre) {
                return res.status(404).json({message: 'Não encontrado nenhum registro deste semestre'})
            }

            res.status(200).json(semestre)
        } catch (e) {
            res.status(500).json({message: 'Erro ao retornar semestre: ' + e.message})
        }
    };

    async cadastro(req, res, next) {
        try {
            const createSemestres = await prisma.semestre.create({ data: req.body });
            res.status(201).json(createSemestres);
        } catch (e) {
            res.status(500).json({ message: 'Erro ao criar semestre: ' + e.message });
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
            const updateSemestres = await prisma.semestre.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate,  // Passa diretamente o req.body
            });
    
            if (updateSemestres.count === 0) {
                return res.status(404).json({ message: 'Semestre não encontrado.' });
            }
    
            res.status(200).json({ message: 'Semestre alterado com sucesso.' });
        } catch (e) {
            res.status(500).json({ message: 'Erro ao alterar semestre: ' + e.message });
        }
    }

    async deletar(req, res, next) {
        const { id } = req.params;
        try {
            const deleteSemestres = await prisma.semestre.deleteMany({
                where: { 
                    id: Number(id), 
                },
            })
            res.status(200).json({sucesso: 'Semestre deletado com sucesso.'})
        } catch (e) {
            res.status(500).json({error: 'Erro ao deletar semestre.' + e.message})
        }
    }
}
export { semestresController };
