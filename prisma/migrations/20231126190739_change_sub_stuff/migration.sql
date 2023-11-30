/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `tier` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `tierId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_creatorId_fkey";

-- DropIndex
DROP INDEX "Subscription_creatorId_userId_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "creatorId",
DROP COLUMN "tier",
ADD COLUMN     "tierId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "SubscriptionTier"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
