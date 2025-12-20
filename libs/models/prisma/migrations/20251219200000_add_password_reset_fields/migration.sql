-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "passwordResetCode" TEXT,
ADD COLUMN     "passwordResetTokenExpiresAt" TIMESTAMP(3);

