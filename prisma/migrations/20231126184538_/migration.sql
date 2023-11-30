/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `Votes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "SubscriptionTier" (
    "id" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionTier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionTier_tier_creatorId_key" ON "SubscriptionTier"("tier", "creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "Votes_userId_postId_key" ON "Votes"("userId", "postId");

-- AddForeignKey
ALTER TABLE "SubscriptionTier" ADD CONSTRAINT "SubscriptionTier_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE RESTRICT;
