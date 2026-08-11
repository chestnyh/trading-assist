/*
  Warnings:

  - You are about to drop the column `externalServiceId` on the `UserRuleSettings` table. All the data in the column will be lost.
  - You are about to drop the `ExternalServices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRuleSettings" DROP CONSTRAINT "UserRuleSettings_externalServiceId_fkey";

-- AlterTable
ALTER TABLE "UserRuleSettings" DROP COLUMN "externalServiceId";

-- DropTable
DROP TABLE "ExternalServices";
