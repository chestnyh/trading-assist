/*
  Warnings:

  - Added the required column `apiToken` to the `UserTelegramSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserTelegramSettings" ADD COLUMN     "apiToken" TEXT NOT NULL;
