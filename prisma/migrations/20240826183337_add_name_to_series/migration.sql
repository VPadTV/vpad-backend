/*
  Warnings:

  - Added the required column `name` to the `Series` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Series" ADD COLUMN     "name" TEXT NOT NULL;
