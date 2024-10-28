-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "ra" TEXT,
    "cpf" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "imei" TEXT,
    "tipo" INTEGER NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 0,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semestre" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_inicio" TIMESTAMP(3),
    "data_final" TIMESTAMP(3),
    "padrao" INTEGER NOT NULL,

    CONSTRAINT "semestre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curso" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disciplina" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "carga_horario" INTEGER NOT NULL,

    CONSTRAINT "disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turma" (
    "id" SERIAL NOT NULL,
    "semestre_curso" INTEGER NOT NULL,
    "id_curso" INTEGER NOT NULL,

    CONSTRAINT "turma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turma_disciplinas" (
    "id" SERIAL NOT NULL,
    "id_disciplina" INTEGER NOT NULL,
    "id_semestre" INTEGER NOT NULL,
    "id_turma" INTEGER NOT NULL,
    "semestre_curso" INTEGER NOT NULL,

    CONSTRAINT "turma_disciplinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turma_alunos" (
    "id" SERIAL NOT NULL,
    "id_aluno" INTEGER NOT NULL,
    "id_turma" INTEGER NOT NULL,

    CONSTRAINT "turma_alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chamada" (
    "id" SERIAL NOT NULL,
    "id_professor" INTEGER NOT NULL,
    "id_disciplina" INTEGER NOT NULL,
    "id_semestre" INTEGER NOT NULL,
    "data_hora_inicio" TIMESTAMP(3),
    "data_hora_final" TIMESTAMP(3),

    CONSTRAINT "chamada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chamada_alunos" (
    "id" SERIAL NOT NULL,
    "id_chamada" INTEGER NOT NULL,
    "id_aluno" INTEGER NOT NULL,

    CONSTRAINT "chamada_alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semestre_professor_disciplinas" (
    "id" SERIAL NOT NULL,
    "id_disciplina" INTEGER NOT NULL,
    "id_professor" INTEGER NOT NULL,
    "id_semestre" INTEGER NOT NULL,

    CONSTRAINT "semestre_professor_disciplinas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_ra_key" ON "usuario"("ra");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_cpf_key" ON "usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_imei_key" ON "usuario"("imei");

-- AddForeignKey
ALTER TABLE "disciplina" ADD CONSTRAINT "disciplina_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma" ADD CONSTRAINT "turma_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma_disciplinas" ADD CONSTRAINT "turma_disciplinas_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma_disciplinas" ADD CONSTRAINT "turma_disciplinas_id_semestre_fkey" FOREIGN KEY ("id_semestre") REFERENCES "semestre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma_disciplinas" ADD CONSTRAINT "turma_disciplinas_id_turma_fkey" FOREIGN KEY ("id_turma") REFERENCES "turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma_alunos" ADD CONSTRAINT "turma_alunos_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turma_alunos" ADD CONSTRAINT "turma_alunos_id_turma_fkey" FOREIGN KEY ("id_turma") REFERENCES "turma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamada" ADD CONSTRAINT "chamada_id_professor_fkey" FOREIGN KEY ("id_professor") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamada" ADD CONSTRAINT "chamada_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamada" ADD CONSTRAINT "chamada_id_semestre_fkey" FOREIGN KEY ("id_semestre") REFERENCES "semestre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamada_alunos" ADD CONSTRAINT "chamada_alunos_id_chamada_fkey" FOREIGN KEY ("id_chamada") REFERENCES "chamada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamada_alunos" ADD CONSTRAINT "chamada_alunos_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semestre_professor_disciplinas" ADD CONSTRAINT "semestre_professor_disciplinas_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semestre_professor_disciplinas" ADD CONSTRAINT "semestre_professor_disciplinas_id_professor_fkey" FOREIGN KEY ("id_professor") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semestre_professor_disciplinas" ADD CONSTRAINT "semestre_professor_disciplinas_id_semestre_fkey" FOREIGN KEY ("id_semestre") REFERENCES "semestre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
