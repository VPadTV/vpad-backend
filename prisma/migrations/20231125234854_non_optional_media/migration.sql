/*
  Warnings:

  - Made the column `mediaUrl` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "mediaUrl" SET NOT NULL;
