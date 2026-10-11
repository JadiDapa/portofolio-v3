-- AlterEnum
ALTER TYPE "ExperienceType" ADD VALUE 'ORGANIZATION';

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tools" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "skills" JSONB;
