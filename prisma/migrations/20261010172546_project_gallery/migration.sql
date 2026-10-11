-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "gallery" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "heroVideo" TEXT,
ADD COLUMN     "websiteUrl" TEXT;
