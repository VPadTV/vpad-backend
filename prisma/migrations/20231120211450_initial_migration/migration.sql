-- CreateEnum
CREATE TYPE "Color" AS ENUM ('RED', 'BLUE', 'GREEN', 'PINK', 'ORANGE', 'YELLOW', 'BLACK', 'WHITE', 'PURPLE', 'BROWN', 'CYAN', 'LIME');

-- CreateTable
CREATE TABLE "Crewmate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" "Color" NOT NULL,

    CONSTRAINT "Crewmate_pkey" PRIMARY KEY ("id")
);
