-- AlterTable
ALTER TABLE "public"."PasswordReset" ADD COLUMN "attemptsCount" INTEGER NOT NULL DEFAULT 0;

