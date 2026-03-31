/*
  Warnings:

  - You are about to drop the `UserTelegramSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UserTelegramSettings" DROP CONSTRAINT "UserTelegramSettings_userId_fkey";

-- DropTable
DROP TABLE "public"."UserTelegramSettings";
