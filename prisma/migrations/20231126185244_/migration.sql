/*
  Warnings:

  - You are about to drop the column `tier` on the `SubscriptionTier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,creatorId]` on the table `SubscriptionTier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `SubscriptionTier` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SubscriptionTier_tier_creatorId_key";

-- AlterTable
ALTER TABLE "SubscriptionTier" DROP COLUMN "tier",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionTier_name_creatorId_key" ON "SubscriptionTier"("name", "creatorId");
