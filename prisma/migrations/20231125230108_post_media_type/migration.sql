/*
  Warnings:

  - Added the required column `mediaType` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('VIDEO', 'IMAGE');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "mediaType" "MediaType" NOT NULL;
