/*
  Warnings:

  - Made the column `serviceCode` on table `UserRuleSettings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserRuleSettings" ALTER COLUMN "serviceCode" SET NOT NULL;
