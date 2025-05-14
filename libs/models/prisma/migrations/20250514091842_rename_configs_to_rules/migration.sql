/*
  Warnings:

  - You are about to drop the `UserConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserConfig" DROP CONSTRAINT "UserConfig_authorId_fkey";

-- DropTable
DROP TABLE "UserConfig";

-- CreateTable
CREATE TABLE "UserRules" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "ruleBody" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "UserRules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserRules" ADD CONSTRAINT "UserRules_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
