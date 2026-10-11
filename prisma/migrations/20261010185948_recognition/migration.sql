-- CreateEnum
CREATE TYPE "RecognitionKind" AS ENUM ('AWARD', 'PRESS', 'CERTIFICATION', 'COMPETITION');

-- CreateTable
CREATE TABLE "Recognition" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "kind" "RecognitionKind" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "year" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recognition_pkey" PRIMARY KEY ("id")
);
