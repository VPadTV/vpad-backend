/*
  Warnings:

  - You are about to drop the `Crewmate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Crewmate";

-- DropEnum
DROP TYPE "Color";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePhotoUrl" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
