-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "relatedIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
