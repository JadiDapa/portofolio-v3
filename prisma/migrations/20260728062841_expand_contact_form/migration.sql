/*
  Warnings:

  - You are about to drop the column `projectType` on the `ContactSubmission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContactSubmission" DROP COLUMN "projectType",
ADD COLUMN     "budget" TEXT,
ADD COLUMN     "company" TEXT,
ADD COLUMN     "projectTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "timeline" TEXT;
