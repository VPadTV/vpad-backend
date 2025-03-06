/*
  Warnings:

  - Added the required column `ownerId` to the `Series` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Series" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
