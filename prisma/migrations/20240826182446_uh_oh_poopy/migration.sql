/*
  Warnings:

  - You are about to drop the column `userId` on the `Post` table. All the data in the column will be lost.
  - The primary key for the `PostCredits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PostCredits` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "PostCredits" DROP CONSTRAINT "PostCredits_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "PostCredits_pkey" PRIMARY KEY ("postId", "userId");
