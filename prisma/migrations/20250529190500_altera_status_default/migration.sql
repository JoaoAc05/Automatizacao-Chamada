/*
  Warnings:

  - Made the column `data_hora_inicio` on table `chamada` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "chamada" ALTER COLUMN "data_hora_inicio" SET NOT NULL;

-- AlterTable
ALTER TABLE "chamada_alunos" ALTER COLUMN "status" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "turma" ALTER COLUMN "semestre_curso" SET DEFAULT 1;
