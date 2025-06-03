import { prisma } from "../prisma.js";
import { dataValida, dataFinalMaiorOuIgual } from '../Utils/DataUtils.js';

class chamadasController {
    async getAll(req, res) { 
        try {
            const chamadas = await prisma.chamada.findMany({
                orderBy: {
                    id: 'asc'
                },
                include: { 
                    Disciplina: {
                        select: {
                            descricao: true
                        }
                    } 
                }
            })
            if (chamadas.length === 0) {
                return res.status(204).end();
            }

            const todasChamadas = chamadas.map((c) => ({
                id: Number(c.id),
                id_disciplina: Number(c.id_disciplina),
                descricao: c.Disciplina.descricao,
                id_professor: Number(c.id_professor),
                id_semestre: Number(c.id_semestre),
                data_hora_inicio: c.data_hora_inicio,
                data_hora_final: c.data_hora_final
            }));
           
            return res.status(200).json(todasChamadas);
        } catch (e) {
            console.log('Erro ao retornar chamadas: ' + e.message)
            return res.status(500).json({ message: 'Erro ao retornar chamadas: ' + e.message });
        }
    }

    async getId(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Id é obrigatório'})
        }

        try {

            if(!id) {
                return res.status(400).json({ message: 'id é obrigatório nos parametros'})
            }

            const chamada = await prisma.chamada.findUnique({
                where: {
                    id: Number(id),
                },
                include: { 
                    Disciplina: {
                        select: {
                            descricao: true
                        }
                    } 
                }
            })
            if (!chamada) {
                return res.status(404).json({ message: 'Chamada não encontrada.' }); 
            }

            const chamadaOrdenada = chamada.map((c) => ({
                id: Number(c.id),
                id_disciplina: Number(c.id_disciplina),
                descricao: c.Disciplina.descricao,
                id_professor: Number(c.id_professor),
                id_semestre: Number(c.id_semestre),
                data_hora_inicio: c.data_hora_inicio,
                data_hora_final: c.data_hora_final
            }));

            return res.status(200).json(chamadaOrdenada)
        } catch (e) {
            console.log('Erro ao retornar chamada: ' + e.message)
            return res.status(500).json({ message: 'Erro ao retornar chamada: ' + e.message })
        }
    };

    async cadastro(req, res) {
        const {id_professor, id_disciplina, data_hora_inicio, id_semestre} = req.body
        try {
            //Verifica se veio todas as informações
            if (!id_professor || !id_disciplina || !data_hora_inicio) {
                return res.status(400).json({ message: 'Os campos id_professor, id_disciplina e data_hora_inicio são obrigatórios.' });
            }

            if (!dataValida(data_hora_inicio)) {
                return res.status(400).json({ message: 'Formato de data-hora inválido.' });
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
                return res.status(400).json({ message: 'Usuário informado não é um professor' })
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

            let semestre;
            if (id_semestre) {
                semestre = await prisma.semestre.findUnique({
                    where: {
                        id: Number(id_semestre)
                    }
                })
                if (!semestre) {
                    return res.status(404).json({ message: 'Semestre não encontrado.' });
                } 
            } else {
                semestre = await prisma.semestre.findFirst({
                    where: {
                        padrao: 0
                    }
                }) 
                if (!semestre) {
                    return res.status(404).json({ message: 'Semestre padrão não encontrado.' });
                } 
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
            return res.status(201).json(createChamadas);
        } catch (e) {
            console.log('Erro ao criar chamada: ' + e.message)
            return res.status(500).json({ message: 'Erro ao criar chamada: ' + e.message });
        }
    }

    async alterar(req, res) {
        const {id, id_professor, id_disciplina, id_semestre, data_hora_inicio, data_hora_final} = req.body
        const dataToUpdate = req.body;
        delete dataToUpdate.id;
    
        // Verifica se o body está vazio
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }

        if (!id) {
            return res.status(400).josn({ message: 'O campo id é obrigatório'})
        }
        
        try {
            const chamada = await prisma.chamada.findUnique({
                where: {
                    id: Number(id)
                }
            })
            if (!chamada) {
                return res.status(404).json({ message: 'Chamada não encontrada.'})
            }

            if (data_inicio && data_final) {
                if (!dataFinalMaiorOuIgual(data_hora_inicio, data_hora_final)) {
                    return res.status(400).json({ message: 'A data final deve ser maior ou igual à data de início.' });
                }
            } else {
                if (data_inicio) {
                    if (!dataValida(data_hora_inicio)) {
                        return res.status(400).json({ message: 'Data de início inválida.' });
                    }
                    if (!dataFinalMaiorOuIgual(data_hora_inicio, chamada.data_hora_final)) {
                        return res.status(400).json({ message: 'A nova data de início não pode ser maior que a data final atual.' });
                    }
                }
        
                if (data_final) {
                    if (!dataValida(data_hora_final)) {
                        return res.status(400).json({ message: 'Data final inválida.' });
                    }
                    if (!dataFinalMaiorOuIgual(chamada.data_hora_inicio, data_hora_final)) {
                        return res.status(400).json({ message: 'A nova data final não pode ser menor que a data de início atual.' });
                    }
                }
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
                    return res.status(400).json({ message: 'Usuário informado não é um professor.' })
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

            const updateChamadas = await prisma.chamada.updateMany({
                where: {
                    id: Number(id),
                },
                data: dataToUpdate, 
            });
    
            if (updateChamadas.count === 0) {
                return res.status(404).json({ message: 'Chamada não encontrada.' });
            }
    
            return res.status(200).json({ message: 'Chamada alterada com sucesso.' });
        } catch (e) {
            console.log('Erro ao alterar chamada: ' + e.message)
            return res.status(500).json({ message: 'Erro ao alterar chamada: ' + e.message });
        }
    }

    async deletar(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Id é obrigatório.'})
        }

        try {

            const chamada = await prisma.chamada.findUnique({
                where: { 
                    id: Number(id)
                },
            });
            if (!chamada) {
                return res.status(404).json({ message: 'Chamada não encontrada.' });
            }

            const deleteChamada = await prisma.chamada.delete({
                where: { 
                    id: Number(id), 
                },
            })
            if (!deleteChamada) {
                return res.status(404).json({ message: 'Nenhuma chamada encontrada para deletar.'})
            }
            return res.status(200).json({ message: 'Chamada deletado com sucesso.' })
        } catch (e) {
            console.log('Erro ao deletar chamada.' + e.message )
            return res.status(500).json({ message: 'Erro ao deletar chamada.' + e.message })
        }
    }

    async finalizarChamada(req, res) {
        const {id, data_hora_final} = req.body

        if (!data_hora_final || !id) {
            return res.status(400).json({ message: 'Os dados id e data_hora_final são obrigatórios.' });
        }

        if (!dataValida(data_hora_final)) {
            return res.status(400).json({ message: 'Formato de data-hora inválido.' });
        }

        try {
            const chamada = await prisma.chamada.findUnique({
                where: {
                    id: Number(id),
                },
            });
            if (!chamada) {
                return res.status(404).json({ message: 'Chamada não encontrada para ser finalizada.' })
            }
            if (chamada.data_hora_final != null){
                console.log(`Chamada já finalizada: ${chamada.data_hora_final}`)
                return res.status(400).json({ message: 'Chamada já finalizada.' })
            }

            if (!dataFinalMaiorOuIgual(chamada.data_hora_inicio, data_hora_final)) {
                return res.status(400).json({ message: 'A data final deve ser igual ou posterior à data inicial.' });
            }
    

            const updateChamadas = await prisma.chamada.update({
                where: {
                    id: Number(id),
                },
                data: {
                    data_hora_final: data_hora_final
                },  
            });
            if (!updateChamadas) {
                return res.status(404).json({ message: 'Chamada não encontrada para finalizar.'})
            }

            return res.status(200).json({ message: 'Chamada finalizada com sucesso.' })
        } catch (e) {
            console.log('Erro ao finalizar chamada: ' + e.message)
            return res.status(500).json({ message: 'Erro ao finalizar chamada: ' + e.message })
        }
    }

    async chamadaProfessor(req, res) {
        const { id_professor, id_semestre, id_disciplina } = req.query;
        // .../professor/?id_professor=1&id_semestre=1&id_disciplina=1
        
        if (!id_professor || isNaN(Number(id_professor))) {
            return res.status(400).json({ message: 'Id_professor é obrigatório.'})
        }

        try {
            let semestre;

            if (id_professor) {
                const professor = await prisma.usuario.findUnique({
                    where: {
                        id: Number(id_professor)
                    }
                })
                if (!professor) {
                    return res.status(404).json({ message: 'Professor não encontrado' })
                }
                if(professor.tipo !== 1) {
                    return res.status(401).json({ message: 'Usuário não é um professor.' });
                }
            }

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
                    return res.status(404).json({ message: 'Semestre padrão não encontrado.' });
                }
            }

            const filter = {
                id_professor: Number(id_professor),
                id_semestre: semestre.id,
                // id_disciplina será incluído abaixo somente se for passado
              };
              
              if (id_disciplina) {
                const disciplina = await prisma.disciplina.findUnique({
                  where: { id: Number(id_disciplina) },
                });
                if (!disciplina) {
                  return res.status(404).json({ message: 'Disciplina não encontrada.' });
                }
                filter.id_disciplina = Number(id_disciplina);
              }
              
              const chamadas = await prisma.chamada.findMany({
                where: filter,
                include: { 
                    Disciplina: true 
                },
                orderBy: {
                    id: 'asc'
                },
              });
              
              if (chamadas.length === 0) {
                return res
                  .status(404)
                  .json({ message: 'Chamadas do professor não encontradas.' });
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

            return res.status(200).json(chamadaProfessor)
        } catch (e) {
            console.log('Erro ao retornar chamadas do professor: ' + e.message)
            return res.status(500).json({ message: 'Erro ao retornar chamadas do professor: ' + e.message })
        }
    }
}
export { chamadasController };
