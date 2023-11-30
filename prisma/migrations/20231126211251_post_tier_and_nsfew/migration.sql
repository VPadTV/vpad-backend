-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "minTierId" TEXT,
ADD COLUMN     "nsfw" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_minTierId_fkey" FOREIGN KEY ("minTierId") REFERENCES "SubscriptionTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
