/*
  Warnings:

  - Added the required column `thumbnailHeight` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailWidth` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "thumbnailHeight" INTEGER NOT NULL,
ADD COLUMN     "thumbnailWidth" INTEGER NOT NULL;
