-- AlterTable
ALTER TABLE "chamada_alunos" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "curso" ADD COLUMN     "qtd_semestres" INTEGER NOT NULL DEFAULT 4,
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "disciplina" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "turma" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "usuario" ALTER COLUMN "cpf" DROP NOT NULL,
ALTER COLUMN "senha" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;
