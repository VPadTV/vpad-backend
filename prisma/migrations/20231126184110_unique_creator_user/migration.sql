/*
  Warnings:

  - A unique constraint covering the columns `[creatorId,userId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_creatorId_userId_key" ON "Subscription"("creatorId", "userId");
