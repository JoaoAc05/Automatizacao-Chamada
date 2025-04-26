import { prisma } from "../prisma.js";
import { dataValida, dataFinalMaiorOuIgual } from '../Utils/DataUtils.js';

class semestresController {
    async getAll(req, res, next) { 
        try {
            const semestres = await prisma.semestre.findMany()
            if (semestres.length === 0) {
                return res.status(204).end();
            }

            return res.status(200).json(semestres);
        } catch (e) {
            console.log()
            return res.status(500).json({ message: 'Erro ao retornar semestres: ' + e.message });
        }
    }

    async getId(req, res, next) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Id é obrigatório'})
        }

        try {
            const semestre = await prisma.semestre.findUnique({
                where: {
                    id: Number(id),
                },
            })
            if (!semestre) {
                return res.status(404).json({ message: 'Não encontrado nenhum registro deste semestre' })
            }

            return res.status(200).json(semestre)
        } catch (e) {
            return res.status(500).json({ message: 'Erro ao retornar semestre: ' + e.message })
        }
    };

    async cadastro(req, res, next) {
        const { descricao, data_inicio, data_final, padrao } = req.body;

        if(!descricao || !data_inicio || !data_final) {
            return res.status(400).json({ message: 'Descricao, data_inicio e data_final são campos obrigatórios.'})
        }

        if (!dataValida(data_inicio) || !dataValida(data_final)) {
            return res.status(400).json({ message: 'Formato de data inválido.' });
        }
    
        if (!dataFinalMaiorOuIgual(data_inicio, data_final)) {
            return res.status(400).json({ message: 'A data final deve ser igual ou posterior à data inicial.' });
        }

        try {
            if (Number(padrao) === 0) {
                const SemestrePadrao = await prisma.semestre.findFirst({
                    where: {
                        padrao: 0
                    }
                })
                if (SemestrePadrao){
                   await prisma.semestre.update({
                        where: {
                            id: SemestrePadrao.id,
                        },
                        data: {
                            padrao: 1
                        },
                    }); 
                }
            } else {
                req.body.padrao = 1;
            }

            const createSemestres = await prisma.semestre.create({ data: req.body });
            return res.status(201).json(createSemestres);
        } catch (e) {
            return res.status(500).json({ message: 'Erro ao criar semestre: ' + e.message });
        }
    }

    async alterar(req, res, next) {
        const { id, padrao, data_inicio, data_final } = req.body;
        const dataToUpdate = req.body;
        delete dataToUpdate.id;

    
        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }

        try {

            const semestre = await prisma.semestre.findUnique({
                where: {
                    id: Number(id)
                }
            });
            if (!semestre) {
                return res.status(400).json({ message: 'Semestre não encontrado.' });
            }
            
            if (data_inicio && data_final) {
                if (!dataFinalMaiorOuIgual(data_inicio, data_final)) {
                    return res.status(400).json({ message: 'A data final deve ser maior ou igual à data de início.' });
                }
            } else {
                if (data_inicio) {
                    if (!dataValida(data_inicio)) {
                        return res.status(400).json({ message: 'Data de início inválida.' });
                    }
                    if (!dataFinalMaiorOuIgual(data_inicio, semestre.data_final)) {
                        return res.status(400).json({ message: 'A nova data de início não pode ser maior que a data final atual.' });
                    }
                }
        
                if (data_final) {
                    if (!dataValida(data_final)) {
                        return res.status(400).json({ message: 'Data final inválida.' });
                    }
                    if (!dataFinalMaiorOuIgual(semestre.data_inicio, data_final)) {
                        return res.status(400).json({ message: 'A nova data final não pode ser menor que a data de início atual.' });
                    }
                }
            }
    

            if (Number(padrao) === 0) {
                const SemestrePadrao = await prisma.semestre.findFirst({
                    where: {
                        padrao: 0
                    }
                })
                if (SemestrePadrao){
                   await prisma.semestre.update({
                        where: {
                            id: SemestrePadrao.id,
                        },
                        data: {
                            padrao: 1
                        },
                    }); 
                }
            }

            const updateSemestres = await prisma.semestre.update({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate,
            });
    
            if (!updateSemestres) {
                return res.status(404).json({ message: 'Semestre não encontrado.' });
            }
    
            return res.status(200).json({ message: 'Semestre alterado com sucesso.' });
        } catch (e) {
            return res.status(500).json({ message: 'Erro ao alterar semestre: ' + e.message });
        }
    }

    async deletar(req, res, next) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Id é obrigatório'})
        }

        try {

            const semestre = await prisma.semestre.findUnique({
                where: { 
                    id: Number(id)
                },
            });
            if (!semestre) {
                return res.status(404).json({ message: 'Semestre não encontrado.' });
            }

            const deleteSemestre = await prisma.semestre.delete({
                where: { 
                    id: Number(id), 
                },
            })
            if (!deleteSemestre) {
                return res.status(404).json({ message: 'Semestre não encontrado para deletar.' });
            }
            return res.status(200).json({ message: 'Semestre deletado com sucesso.' })
        } catch (e) {
            return res.status(500).json({ message: 'Erro ao deletar semestre:' + e.message })
        }
    }
}
export { semestresController };
