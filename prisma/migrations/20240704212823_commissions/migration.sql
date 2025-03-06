/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Subscription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_creatorId_fkey";

-- DropIndex
DROP INDEX "Subscription_creatorId_userId_key";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "text" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "creatorId";

-- CreateTable
CREATE TABLE "Commission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
