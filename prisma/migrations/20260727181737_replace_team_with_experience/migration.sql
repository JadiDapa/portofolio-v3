/*
  Warnings:

  - You are about to drop the `TeamMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ExperienceType" AS ENUM ('WORK', 'EDUCATION');

-- DropTable
DROP TABLE "TeamMember";

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "type" "ExperienceType" NOT NULL,
    "organization" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);
