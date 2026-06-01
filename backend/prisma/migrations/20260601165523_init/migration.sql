/*
  Warnings:

  - The values [CAMCELADO] on the enum `ProjectStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProjectStatus_new" AS ENUM ('PLANIFICADO', 'EN_CURSO', 'COMPLETADO', 'CANCELADO');
ALTER TABLE "public"."Projects" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Projects" ALTER COLUMN "status" TYPE "ProjectStatus_new" USING ("status"::text::"ProjectStatus_new");
ALTER TYPE "ProjectStatus" RENAME TO "ProjectStatus_old";
ALTER TYPE "ProjectStatus_new" RENAME TO "ProjectStatus";
DROP TYPE "public"."ProjectStatus_old";
ALTER TABLE "Projects" ALTER COLUMN "status" SET DEFAULT 'PLANIFICADO';
COMMIT;
