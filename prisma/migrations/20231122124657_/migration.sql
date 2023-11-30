-- AlterTable
ALTER TABLE "User" ADD COLUMN     "banTimeout" TIMESTAMP(3),
ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false;
