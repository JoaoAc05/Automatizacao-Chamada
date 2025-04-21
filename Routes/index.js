import express from "express";

import { UsuariosRouter } from "./UsuariosRouter.js";
import { DisciplinasRouter } from "./DisciplinasRouter.js";
import { CursosRouter } from "./CursosRouter.js";
import { SemestresRouter } from "./SemestresRouter.js";
import { TurmasRouter } from "./TurmasRouter.js";
import { TurmaAlunosRouter } from "./TurmaAlunosRouter.js";
import { TurmaDisciplinasRouter } from "./TurmaDisciplinasRouter.js";
import { SemestreDisciplinasRouter } from "./SemestreDisciplinasRouter.js";
import { ChamadasRouter } from "./ChamadasRouter.js";
import { ChamadaAlunosRouter } from "./ChamadaAlunosRouter.js"
import { LoginRouter } from "./LoginRouter.js";

const router = express.Router();

//rota default
router.get('/', (req, res) => {
    res.json({
        "statuscode": 200,
        "sucesso": "Rota default - V4.0 Auth"
    });
});

router.use("/usuarios", UsuariosRouter)
router.use("/disciplinas", DisciplinasRouter)
router.use("/cursos", CursosRouter)
router.use("/semestres", SemestresRouter)
router.use("/turmas", TurmasRouter)
router.use("/turma/alunos", TurmaAlunosRouter)
router.use("/turma/disciplinas", TurmaDisciplinasRouter)
router.use("/semestre", SemestreDisciplinasRouter)
router.use("/chamadas", ChamadasRouter)
router.use("/chamada", ChamadaAlunosRouter)
router.use("/login", LoginRouter)

export default router;