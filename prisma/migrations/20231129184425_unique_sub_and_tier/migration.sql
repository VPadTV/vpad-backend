/*
  Warnings:

  - A unique constraint covering the columns `[creatorId,userId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,creatorId,price]` on the table `SubscriptionTier` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SubscriptionTier_name_creatorId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_creatorId_userId_key" ON "Subscription"("creatorId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionTier_name_creatorId_price_key" ON "SubscriptionTier"("name", "creatorId", "price");
