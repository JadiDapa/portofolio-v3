-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "faqs" JSONB,
ADD COLUMN     "headline" TEXT,
ADD COLUMN     "lead" TEXT,
ADD COLUMN     "process" JSONB;
