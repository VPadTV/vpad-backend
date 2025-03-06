/*
  Warnings:

  - The primary key for the `PostCredits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[postId,userId]` on the table `PostCredits` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `PostCredits` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "PostCredits" DROP CONSTRAINT "PostCredits_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "PostCredits_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "PostCredits_postId_userId_key" ON "PostCredits"("postId", "userId");
