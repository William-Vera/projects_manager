-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANIFICADO', 'EN_CURSO', 'COMPLETADO', 'CAMCELADO');

-- CreateTable
CREATE TABLE "Projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANIFICADO',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duenoId" TEXT NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_duenoId_fkey" FOREIGN KEY ("duenoId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
