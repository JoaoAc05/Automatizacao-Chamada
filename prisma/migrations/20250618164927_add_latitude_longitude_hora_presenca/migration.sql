-- AlterTable
ALTER TABLE "chamada_alunos" ADD COLUMN     "data_hora_presenca" TIMESTAMP(3),
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "observacao" TEXT;
