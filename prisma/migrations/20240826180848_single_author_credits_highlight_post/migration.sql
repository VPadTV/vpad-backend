/*
  Warnings:

  - You are about to drop the `_PostToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PostToUser" DROP CONSTRAINT "_PostToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToUser" DROP CONSTRAINT "_PostToUser_B_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "seriesId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "customCss" TEXT,
ADD COLUMN     "highlightId" TEXT;

-- DropTable
DROP TABLE "_PostToUser";

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostCredits" (
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostCredits_pkey" PRIMARY KEY ("postId","userId")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_highlightId_fkey" FOREIGN KEY ("highlightId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCredits" ADD CONSTRAINT "PostCredits_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCredits" ADD CONSTRAINT "PostCredits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
